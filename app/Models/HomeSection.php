<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_key',
        'title',
        'subtitle',
        'content',
        'image',
        'image_alt',
        'badge_text',
        'button_text',
        'button_link',
        'meta',
        'order',
        'is_active',
    ];

    protected $casts = [
        'meta' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Scope a query to only include active sections.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order sections by order field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Get section by key.
     */
    public function scopeByKey($query, $key)
    {
        return $query->where('section_key', $key);
    }

    /**
     * Get the image URL attribute.
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        $baseUrl = config('app.url', 'https://imamhafsh.com');
        $image = $this->image;

        // If already has full URL, return as is
        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }
        
        // If already has /storage/ prefix (data lama), return dengan base URL tanpa menambah lagi
        if (str_starts_with($image, '/storage/')) {
            return $baseUrl . $image;
        }

        // Data baru: add /storage/ prefix
        return $baseUrl . '/storage/' . $image;
    }
}
