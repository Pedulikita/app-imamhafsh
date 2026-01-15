<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiterasiContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'main_content',
        'features',
        'statistics',
        'image_path',
        'gallery_images',
        'meta_title',
        'meta_description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'statistics' => 'array',
        'gallery_images' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }

    /**
     * Get the image URL attribute.
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        $baseUrl = config('app.url', 'https://imamhafsh.com');
        $image = $this->image_path;

        // If already has full URL, return as is
        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }
        
        // If already has /storage/ prefix (old data), return with base URL
        if (str_starts_with($image, '/storage/')) {
            return $baseUrl . $image;
        }

        // New data: add /storage/ prefix
        return $baseUrl . '/storage/' . $image;
    }
}