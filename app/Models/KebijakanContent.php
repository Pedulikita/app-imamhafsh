<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KebijakanContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'hero_badge',
        'hero_title',
        'hero_subtitle',
        'hero_image',
        'intro_title',
        'intro_content',
        'bullying_title',
        'bullying_content',
        'bullying_points',
        'bullying_image',
        'lgbt_title',
        'lgbt_content',
        'lgbt_points',
        'lgbt_image',
        'environment_title',
        'environment_content',
        'environment_features',
        'environment_image',
        'commitment_title',
        'commitment_content',
        'commitment_items',
        'is_active',
        'order',
    ];

    protected $casts = [
        'bullying_points' => 'array',
        'lgbt_points' => 'array',
        'environment_features' => 'array',
        'commitment_items' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    // Scope untuk mendapatkan konten aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk ordering
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('id', 'desc');
    }

    // Accessor untuk hero image URL
    public function getHeroImageUrlAttribute()
    {
        if (!$this->hero_image) {
            return null;
        }
        
        if (filter_var($this->hero_image, FILTER_VALIDATE_URL)) {
            return $this->hero_image;
        }
        
        if (str_starts_with($this->hero_image, '/')) {
            return $this->hero_image;
        }
        
        return '/storage/' . $this->hero_image;
    }

    // Accessor untuk bullying image URL
    public function getBullyingImageUrlAttribute()
    {
        if (!$this->bullying_image) {
            return null;
        }
        
        if (filter_var($this->bullying_image, FILTER_VALIDATE_URL)) {
            return $this->bullying_image;
        }
        
        if (str_starts_with($this->bullying_image, '/')) {
            return $this->bullying_image;
        }
        
        return '/storage/' . $this->bullying_image;
    }

    // Accessor untuk LGBT image URL
    public function getLgbtImageUrlAttribute()
    {
        if (!$this->lgbt_image) {
            return null;
        }
        
        if (filter_var($this->lgbt_image, FILTER_VALIDATE_URL)) {
            return $this->lgbt_image;
        }
        
        if (str_starts_with($this->lgbt_image, '/')) {
            return $this->lgbt_image;
        }
        
        return '/storage/' . $this->lgbt_image;
    }

    // Accessor untuk environment image URL
    public function getEnvironmentImageUrlAttribute()
    {
        if (!$this->environment_image) {
            return null;
        }
        
        if (filter_var($this->environment_image, FILTER_VALIDATE_URL)) {
            return $this->environment_image;
        }
        
        if (str_starts_with($this->environment_image, '/')) {
            return $this->environment_image;
        }
        
        return '/storage/' . $this->environment_image;
    }
}
