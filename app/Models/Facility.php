<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image',
        'category',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('category')->orderBy('created_at');
    }

    // Methods
    public static function getCategories()
    {
        return [
            'Eksterior',
            'Asrama',
            'Kelas & Office',
            'BQ Mart & Resto',
            'BQ Arena',
            'Masjid',
            'Fasilitas Lainnya',
        ];
    }
}
