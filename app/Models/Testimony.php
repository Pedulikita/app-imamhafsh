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
        
        // If the avatar already starts with http:// or https://, return as is
        if (str_starts_with($this->avatar, 'http://') || str_starts_with($this->avatar, 'https://')) {
            return $this->avatar;
        }
        
        // If the avatar already starts with storage/, return as absolute URL
        if (str_starts_with($this->avatar, 'storage/')) {
            return url($this->avatar);
        }
        
        // If the avatar starts with testimonies/, prepend storage/ and make absolute
        if (str_starts_with($this->avatar, 'testimonies/')) {
            return url('storage/' . $this->avatar);
        }
        
        // If it starts with /, return as absolute URL
        if (str_starts_with($this->avatar, '/')) {
            return url($this->avatar);
        }
        
        // Otherwise, return as is
        return $this->avatar;
    }
}
