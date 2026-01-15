<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'credits',
        'category',
        'class_level',
        'semester',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credits' => 'integer',
    ];

    // Relationships
    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByClassLevel($query, $level)
    {
        return $query->where('class_level', $level);
    }

    public function scopeBySemester($query, $semester)
    {
        return $query->where('semester', $semester)
                    ->orWhere('semester', 'both');
    }
}
