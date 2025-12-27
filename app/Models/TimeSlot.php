<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimeSlot extends Model
{
    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'order',
        'type',
        'is_active',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeLessons($query)
    {
        return $query->where('type', 'lesson');
    }

    public function scopeBreaks($query)
    {
        return $query->where('type', 'break');
    }

    // Methods
    public function getDurationMinutes(): int
    {
        return $this->start_time->diffInMinutes($this->end_time);
    }

    public function getFormattedTime(): string
    {
        return $this->start_time->format('H:i') . ' - ' . $this->end_time->format('H:i');
    }

    public function isAvailable(): bool
    {
        return $this->is_active && $this->type === 'lesson';
    }
}