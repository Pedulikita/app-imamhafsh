<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    protected $fillable = [
        'teacher_class_id',
        'title',
        'description',
        'subject',
        'type',
        'duration_minutes',
        'total_questions',
        'total_points',
        'start_time',
        'end_time',
        'is_published',
        'show_results',
        'allow_retake',
        'max_attempts',
        'settings',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_published' => 'boolean',
        'show_results' => 'boolean',
        'allow_retake' => 'boolean',
        'total_points' => 'decimal:2',
        'settings' => 'json',
    ];

    // Relationships
    public function teacherClass(): BelongsTo
    {
        return $this->belongsTo(TeacherClass::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(ExamAttempt::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeActive($query)
    {
        $now = now();
        return $query->where('start_time', '<=', $now)
                    ->where('end_time', '>=', $now);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now());
    }

    public function scopePast($query)
    {
        return $query->where('end_time', '<', now());
    }

    // Methods
    public function isActive(): bool
    {
        $now = now();
        return $this->start_time <= $now && $this->end_time >= $now && $this->is_published;
    }

    public function isUpcoming(): bool
    {
        return $this->start_time > now();
    }

    public function isPast(): bool
    {
        return $this->end_time < now();
    }

    public function canStudentTakeExam(Student $student): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        $attempts = $this->attempts()->where('student_id', $student->id)->count();
        return $attempts < $this->max_attempts;
    }

    public function getStudentAttempts(Student $student)
    {
        return $this->attempts()->where('student_id', $student->id)->orderBy('attempt_number')->get();
    }

    public function calculateTotalPoints(): void
    {
        $this->total_points = $this->questions()->sum('points');
        $this->total_questions = $this->questions()->count();
        $this->save();
    }
}