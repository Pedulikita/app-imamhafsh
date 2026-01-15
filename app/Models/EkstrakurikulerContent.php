<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EkstrakurikulerContent extends Model
{
    protected $table = 'ekstrakurikuler_content';

    protected $fillable = [
        'key',
        'value',
    ];

    public static function getValue($key, $default = '')
    {
        $content = static::where('key', $key)->first();
        return $content ? $content->value : $default;
    }

    public static function getAllContent()
    {
        return static::pluck('value', 'key')->toArray();
    }
}
