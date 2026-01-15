<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationEmbed extends Model
{
    protected $fillable = [
        'title',
        'description',
        'embed_url',
        'direct_url',
        'collected_amount',
        'target_amount',
        'currency',
        'donors_count',
        'image_url',
        'additional_info',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'collected_amount' => 'decimal:2',
        'target_amount' => 'decimal:2',
        'is_active' => 'boolean',
        'donors_count' => 'integer',
        'sort_order' => 'integer'
    ];

    // Scope untuk embed yang aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk mengurutkan berdasarkan sort_order
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }

    // Accessor untuk persentase progress
    public function getProgressPercentageAttribute()
    {
        if ($this->target_amount <= 0) {
            return 0;
        }
        return round(($this->collected_amount / $this->target_amount) * 100, 1);
    }

    // Accessor untuk format amount
    public function getFormattedCollectedAmountAttribute()
    {
        return 'Rp ' . number_format($this->collected_amount, 0, ',', '.');
    }

    public function getFormattedTargetAmountAttribute()
    {
        return 'Rp ' . number_format($this->target_amount, 0, ',', '.');
    }

    // Accessor untuk image URL
    public function getImageUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }
        
        // Jika sudah berupa URL lengkap, return as is
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }
        
        // Jika path dimulai dengan /storage/, return as is (sudah lengkap)
        if (str_starts_with($value, '/storage/')) {
            return asset($value);
        }
        
        // Jika berupa path file relatif, buat URL storage
        return asset('storage/' . $value);
    }
}
