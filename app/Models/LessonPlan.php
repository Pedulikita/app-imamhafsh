<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class LessonPlan extends Model
{
    protected $fillable = [
        'teacher_class_id',
        'teacher_id',
        'subject_id',
        'title',
        'description',
        'lesson_date',
        'start_time',
        'end_time',
        'duration_minutes',
        'learning_objectives',
        'materials_needed',
        'learning_activities',
        'assessment_methods',
        'homework_assignment',
        'notes',
        'status',
        'attachments',
        'reflection',
        'attendance_count',
        'is_template',
    ];

    protected $casts = [
        'lesson_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'learning_activities' => 'array',
        'attachments' => 'array',
        'is_template' => 'boolean',
    ];

    // Relationships
    public function teacherClass(): BelongsTo
    {
        return $this->belongsTo(TeacherClass::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    // Scopes
    public function scopeForTeacher(Builder $query, $teacherId): Builder
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeByStatus(Builder $query, $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('lesson_date', '>=', Carbon::today());
    }

    public function scopePast(Builder $query): Builder
    {
        return $query->where('lesson_date', '<', Carbon::today());
    }

    public function scopeThisWeek(Builder $query): Builder
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        
        return $query->whereBetween('lesson_date', [$startOfWeek, $endOfWeek]);
    }

    public function scopeTemplates(Builder $query): Builder
    {
        return $query->where('is_template', true);
    }

    // Helper methods
    public function isToday(): bool
    {
        return $this->lesson_date->isToday();
    }

    public function isPast(): bool
    {
        return $this->lesson_date->isPast();
    }

    public function isUpcoming(): bool
    {
        return $this->lesson_date->isFuture();
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            'draft' => 'gray',
            'published' => 'blue',
            'completed' => 'green',
            'cancelled' => 'red',
            default => 'gray'
        };
    }

    public function getFormattedDuration(): string
    {
        $hours = intval($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;
        
        if ($hours > 0) {
            return $minutes > 0 ? "{$hours}h {$minutes}m" : "{$hours}h";
        }
        
        return "{$minutes}m";
    }
}
