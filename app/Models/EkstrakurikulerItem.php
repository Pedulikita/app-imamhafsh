<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EkstrakurikulerItem extends Model
{
    protected $fillable = [
        'name',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
