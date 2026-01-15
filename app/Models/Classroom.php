<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classroom extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'capacity',
        'type',
        'facilities',
        'building',
        'floor',
        'is_active',
    ];

    protected $casts = [
        'facilities' => 'json',
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

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByBuilding($query, $building)
    {
        return $query->where('building', $building);
    }

    // Methods
    public function getFacilitiesList(): array
    {
        return $this->facilities ?? [];
    }

    public function hasFacility(string $facility): bool
    {
        return in_array($facility, $this->getFacilitiesList());
    }

    public function isAvailable(string $day, int $timeSlotId, ?string $date = null): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $query = $this->schedules()
            ->where('day_of_week', $day)
            ->where('time_slot_id', $timeSlotId)
            ->where('is_active', true);

        if ($date) {
            $query->where('effective_from', '<=', $date)
                  ->where(function($q) use ($date) {
                      $q->whereNull('effective_until')
                        ->orWhere('effective_until', '>=', $date);
                  });
        }

        return !$query->exists();
    }

    public function getCapacityStatus(): string
    {
        if ($this->capacity <= 20) return 'small';
        if ($this->capacity <= 35) return 'medium';
        return 'large';
    }
}