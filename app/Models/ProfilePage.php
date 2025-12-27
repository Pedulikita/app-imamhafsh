<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProfilePage extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'image',
        'hero_image',
        'content_image',
        'content_thumbnail',
        'sidebar_image',
        'sidebar_bg_color',
        'sidebar_header_color',
        'sidebar_title',
        'meta_description',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($page) {
            if (empty($page->slug)) {
                $baseSlug = Str::slug($page->title);
                $slug = $baseSlug;
                $counter = 2;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                $page->slug = $slug;
            }
        });

        static::updating(function ($page) {
            // Auto-generate slug if empty OR if title changed
            if (empty($page->slug) || $page->isDirty('title')) {
                $baseSlug = Str::slug($page->title);
                $slug = $baseSlug;
                $counter = 2;
                while (static::where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
                $page->slug = $slug;
            }
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('id', 'desc');
    }
}
