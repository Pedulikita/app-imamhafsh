<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BehaviorCategory extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'color',
        'icon',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * Get the behavior reports for this category.
     */
    public function behaviorReports(): HasMany
    {
        return $this->hasMany(BehaviorReport::class);
    }

    /**
     * Scope active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope ordered categories.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('display_name');
    }
}
