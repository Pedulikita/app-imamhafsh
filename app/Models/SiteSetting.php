<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'type',
        'group',
        'label', 
        'value',
        'description',
        'order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer'
    ];

    // Get setting value by key
    public static function get($key, $default = null)
    {
        // Auto-initialize settings if not exist
        self::initializeDefaults();
        
        return Cache::remember("site_setting_{$key}", 3600, function () use ($key, $default) {
            $setting = self::where('key', $key)->where('is_active', true)->first();
            return $setting ? $setting->value : $default;
        });
    }

    // Set setting value
    public static function set($key, $value)
    {
        $setting = self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        Cache::forget("site_setting_{$key}");
        return $setting;
    }

    // Get settings by group
    public static function getByGroup($group)
    {
        // Auto-initialize settings if not exist
        self::initializeDefaults();
        
        return Cache::remember("site_settings_group_{$group}", 3600, function () use ($group) {
            return self::where('group', $group)
                ->where('is_active', true)
                ->orderBy('order')
                ->get(['key', 'value', 'label'])
                ->toArray();
        });
    }

    // Clear all settings cache
    public static function clearCache()
    {
        $keys = self::pluck('key');
        foreach ($keys as $key) {
            Cache::forget("site_setting_{$key}");
        }
        
        $groups = self::distinct()->pluck('group');
        foreach ($groups as $group) {
            Cache::forget("site_settings_group_{$group}");
        }
    }

    // Auto-initialize default settings
    public static function initializeDefaults()
    {
        // Check if initialization is needed (only run once per cache cycle)
        if (Cache::has('site_settings_initialized')) {
            return;
        }

        $defaults = [
            // Contact Information
            ['key' => 'contact_email', 'type' => 'text', 'group' => 'contact', 'label' => 'Email Kontak', 'value' => 'imam@hafshtech.com', 'description' => 'Alamat email utama untuk kontak', 'order' => 1, 'is_active' => true],
            ['key' => 'contact_phone', 'type' => 'text', 'group' => 'contact', 'label' => 'Nomor Telepon', 'value' => '+62 812-3456-7890', 'description' => 'Nomor telepon kontak', 'order' => 2, 'is_active' => true],
            ['key' => 'contact_whatsapp', 'type' => 'text', 'group' => 'contact', 'label' => 'WhatsApp', 'value' => '+62 812-3456-7890', 'description' => 'Nomor WhatsApp kontak', 'order' => 3, 'is_active' => true],
            ['key' => 'contact_address', 'type' => 'textarea', 'group' => 'contact', 'label' => 'Alamat', 'value' => 'Jl. Pendidikan No. 123, Jakarta, Indonesia', 'description' => 'Alamat lengkap kantor', 'order' => 4, 'is_active' => true],
            
            // Social Media
            ['key' => 'social_facebook', 'type' => 'url', 'group' => 'social', 'label' => 'Facebook URL', 'value' => 'https://facebook.com/imamhafsh', 'description' => 'Link profil Facebook', 'order' => 1, 'is_active' => true],
            ['key' => 'social_twitter', 'type' => 'url', 'group' => 'social', 'label' => 'Twitter URL', 'value' => 'https://twitter.com/imamhafsh', 'description' => 'Link profil Twitter/X', 'order' => 2, 'is_active' => true],
            ['key' => 'social_instagram', 'type' => 'url', 'group' => 'social', 'label' => 'Instagram URL', 'value' => 'https://instagram.com/imamhafsh', 'description' => 'Link profil Instagram', 'order' => 3, 'is_active' => true],
            ['key' => 'social_linkedin', 'type' => 'url', 'group' => 'social', 'label' => 'LinkedIn URL', 'value' => 'https://linkedin.com/in/imamhafsh', 'description' => 'Link profil LinkedIn', 'order' => 4, 'is_active' => true],
            ['key' => 'social_youtube', 'type' => 'url', 'group' => 'social', 'label' => 'YouTube URL', 'value' => 'https://youtube.com/c/imamhafsh', 'description' => 'Link channel YouTube', 'order' => 5, 'is_active' => true],
            
            // General Settings
            ['key' => 'site_name', 'type' => 'text', 'group' => 'general', 'label' => 'Nama Situs', 'value' => 'Imam Hafsh Tech', 'description' => 'Nama website/aplikasi', 'order' => 1, 'is_active' => true],
            ['key' => 'site_description', 'type' => 'textarea', 'group' => 'general', 'label' => 'Deskripsi Situs', 'value' => 'Platform pembelajaran dan teknologi pendidikan', 'description' => 'Deskripsi singkat website', 'order' => 2, 'is_active' => true],
            ['key' => 'site_logo', 'type' => 'image', 'group' => 'general', 'label' => 'Logo Situs', 'value' => '/images/logo.png', 'description' => 'Logo website', 'order' => 3, 'is_active' => true],
        ];

        foreach ($defaults as $setting) {
            $existing = self::where('key', $setting['key'])->first();
            if (!$existing) {
                // Create new setting
                self::create($setting);
            } elseif (empty($existing->value) || is_null($existing->value)) {
                // Update existing setting if value is empty
                $existing->update([
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'group' => $setting['group'],
                    'label' => $setting['label'],
                    'description' => $setting['description'],
                    'order' => $setting['order'],
                    'is_active' => $setting['is_active']
                ]);
            }
        }

        // Mark as initialized for this cache cycle
        Cache::put('site_settings_initialized', true, 3600);
    }

    protected static function booted()
    {
        static::saved(function ($setting) {
            Cache::forget("site_setting_{$setting->key}");
            Cache::forget("site_settings_group_{$setting->group}");
        });

        static::deleted(function ($setting) {
            Cache::forget("site_setting_{$setting->key}");
            Cache::forget("site_settings_group_{$setting->group}");
        });
    }
}
