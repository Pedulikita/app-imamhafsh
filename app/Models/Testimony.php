<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimony extends Model
{
    protected $fillable = [
        'name',
        'role',
        'text',
        'rating',
        'avatar',
        'is_featured',
        'platform',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'rating' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return null;
        }
        
        // If the avatar already starts with storage/, return it as is
        if (str_starts_with($this->avatar, 'storage/')) {
            return '/' . $this->avatar;
        }
        
        // If the avatar starts with testimonies/, prepend storage/
        if (str_starts_with($this->avatar, 'testimonies/')) {
            return '/storage/' . $this->avatar;
        }
        
        // Otherwise, return as is
        return $this->avatar;
    }
}
