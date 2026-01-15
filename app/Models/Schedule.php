<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Schedule extends Model
{
    protected $fillable = [
        'teacher_class_id',
        'subject_id',
        'time_slot_id',
        'classroom_id',
        'day_of_week',
        'effective_from',
        'effective_until',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_until' => 'date',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function teacherClass(): BelongsTo
    {
        return $this->belongsTo(TeacherClass::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TimeSlot::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByDay($query, $day)
    {
        return $query->where('day_of_week', $day);
    }

    public function scopeCurrentWeek($query)
    {
        $today = now()->toDateString();
        return $query->where('effective_from', '<=', $today)
                    ->where(function($q) use ($today) {
                        $q->whereNull('effective_until')
                          ->orWhere('effective_until', '>=', $today);
                    });
    }

    public function scopeByTeacher($query, $teacherId)
    {
        return $query->whereHas('teacherClass', function($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId);
        });
    }

    public function scopeByClass($query, $classId)
    {
        return $query->where('teacher_class_id', $classId);
    }

    public function scopeByClassroom($query, $classroomId)
    {
        return $query->where('classroom_id', $classroomId);
    }

    // Methods
    public function isEffective(?string $date = null): bool
    {
        $checkDate = $date ? Carbon::parse($date) : now();
        
        return $checkDate->greaterThanOrEqualTo($this->effective_from) &&
               ($this->effective_until === null || $checkDate->lessThanOrEqualTo($this->effective_until));
    }

    public function getTeacherName(): string
    {
        return $this->teacherClass?->teacher?->name ?? 'Unknown';
    }

    public function getClassName(): string
    {
        return $this->teacherClass?->class_name ?? 'Unknown Class';
    }

    public function getSubjectName(): string
    {
        return $this->subject?->name ?? 'Unknown Subject';
    }

    public function getClassroomName(): string
    {
        return $this->classroom?->name ?? 'TBA';
    }

    public function getTimeRange(): string
    {
        return $this->timeSlot?->getFormattedTime() ?? 'TBA';
    }

    public function getDayName(): string
    {
        $days = [
            'monday' => 'Senin',
            'tuesday' => 'Selasa', 
            'wednesday' => 'Rabu',
            'thursday' => 'Kamis',
            'friday' => 'Jumat',
            'saturday' => 'Sabtu',
            'sunday' => 'Minggu'
        ];

        return $days[$this->day_of_week] ?? $this->day_of_week;
    }

    public function hasConflict(): bool
    {
        // Check classroom conflict
        $classroomConflict = self::where('id', '!=', $this->id)
            ->where('classroom_id', $this->classroom_id)
            ->where('day_of_week', $this->day_of_week)
            ->where('time_slot_id', $this->time_slot_id)
            ->where('is_active', true)
            ->where('effective_from', '<=', $this->effective_until ?? '9999-12-31')
            ->where(function($q) {
                $q->whereNull('effective_until')
                  ->orWhere('effective_until', '>=', $this->effective_from);
            })
            ->exists();

        // Check teacher conflict
        $teacherConflict = self::where('id', '!=', $this->id)
            ->whereHas('teacherClass', function($q) {
                $q->where('teacher_id', $this->teacherClass->teacher_id);
            })
            ->where('day_of_week', $this->day_of_week)
            ->where('time_slot_id', $this->time_slot_id)
            ->where('is_active', true)
            ->where('effective_from', '<=', $this->effective_until ?? '9999-12-31')
            ->where(function($q) {
                $q->whereNull('effective_until')
                  ->orWhere('effective_until', '>=', $this->effective_from);
            })
            ->exists();

        return $classroomConflict || $teacherConflict;
    }
}