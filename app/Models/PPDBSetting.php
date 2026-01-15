<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PPDBSetting extends Model
{
    protected $table = 'ppdb_settings';
    
    protected $fillable = [
        'section_key',
        'content',
        'is_active',
        'order',
    ];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeBySection($query, $section)
    {
        return $query->where('section_key', $section);
    }
}
