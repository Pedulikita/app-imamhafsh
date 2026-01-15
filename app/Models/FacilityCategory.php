<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class FacilityCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer'
    ];

    // Auto-generate slug dari name
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    // Relationship dengan facilities
    public function facilities()
    {
        return $this->hasMany(Facility::class, 'category', 'name');
    }

    // Scope untuk kategori aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk urutan
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('name');
    }
}
