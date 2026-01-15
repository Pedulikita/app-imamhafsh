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
        
        // Clear initialization flag to force reload
        Cache::forget('site_settings_initialized');
        
        // Clear any Inertia cache
        if (class_exists('\Inertia\Inertia')) {
            try {
                \Inertia\Inertia::flushShared();
            } catch (\Exception $e) {
                // Silent fail if method doesn't exist
            }
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
            ['key' => 'contact_description', 'type' => 'textarea', 'group' => 'contact', 'label' => 'Deskripsi Lokasi', 'value' => 'Lokasi strategis boarding school sangat strategis dan asri, dengan dikelilingi sawah, bukit, dan view gunung Salak Bogor.', 'description' => 'Deskripsi singkat tentang lokasi sekolah', 'order' => 5, 'is_active' => true],
            ['key' => 'contact_map_embed', 'type' => 'textarea', 'group' => 'contact', 'label' => 'Google Maps Embed URL', 'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.150711139771!2d106.73816268477667!3d-6.5025976467700355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c3af7cf49cff%3A0x31c36e13b0f3b5f2!2sMAHAD%20IMAM%20HAFSH!5e0!3m2!1sen!2sid!4v1768376416507!5m2!1sen!2sid', 'description' => 'URL embed Google Maps (dari Share > Embed a map)', 'order' => 6, 'is_active' => true],
            
            // Social Media
            ['key' => 'social_facebook', 'type' => 'url', 'group' => 'social', 'label' => 'Facebook URL', 'value' => 'https://facebook.com/imamhafsh', 'description' => 'Link profil Facebook', 'order' => 1, 'is_active' => true],
            ['key' => 'social_twitter', 'type' => 'url', 'group' => 'social', 'label' => 'Twitter URL', 'value' => 'https://twitter.com/imamhafsh', 'description' => 'Link profil Twitter/X', 'order' => 2, 'is_active' => true],
            ['key' => 'social_instagram', 'type' => 'url', 'group' => 'social', 'label' => 'Instagram URL', 'value' => 'https://instagram.com/imamhafsh', 'description' => 'Link profil Instagram', 'order' => 3, 'is_active' => true],
            ['key' => 'social_linkedin', 'type' => 'url', 'group' => 'social', 'label' => 'LinkedIn URL', 'value' => 'https://linkedin.com/in/imamhafsh', 'description' => 'Link profil LinkedIn', 'order' => 4, 'is_active' => true],
            ['key' => 'social_youtube', 'type' => 'url', 'group' => 'social', 'label' => 'YouTube URL', 'value' => 'https://youtube.com/c/imamhafsh', 'description' => 'Link channel YouTube', 'order' => 5, 'is_active' => true],
            
            // General Settings
            ['key' => 'site_name', 'type' => 'text', 'group' => 'general', 'label' => 'Nama Situs', 'value' => 'Imam Hafsh Islamic Boarding School', 'description' => 'Nama website/sekolah', 'order' => 1, 'is_active' => true],
            ['key' => 'site_tagline', 'type' => 'text', 'group' => 'general', 'label' => 'Tagline', 'value' => 'Pendidikan, Adab, dan Prestasi', 'description' => 'Tagline atau motto sekolah', 'order' => 2, 'is_active' => true],
            ['key' => 'site_description', 'type' => 'textarea', 'group' => 'general', 'label' => 'Deskripsi Situs', 'value' => 'Pondok pesantren dengan Aqidah Ahlussunnah wal Jama\'ah. Pembelajaran dan pengasuhan terarah untuk memahami Alquran dan As-Sunnah secara mendalam.', 'description' => 'Deskripsi singkat website', 'order' => 3, 'is_active' => true],
            ['key' => 'site_logo', 'type' => 'image', 'group' => 'general', 'label' => 'Logo Situs', 'value' => '/images/logo.png', 'description' => 'Logo website', 'order' => 4, 'is_active' => true],
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
