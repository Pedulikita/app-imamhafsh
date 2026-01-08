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
