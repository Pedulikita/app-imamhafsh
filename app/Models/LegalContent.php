<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LegalContent extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get a specific content value by key
     */
    public static function getValue(string $key, string $default = ''): string
    {
        $content = static::where('key', $key)->first();
        return $content ? $content->value : $default;
    }

    /**
     * Get all content as key-value array
     */
    public static function getAllContent(): array
    {
        return static::pluck('value', 'key')->toArray();
    }
}
