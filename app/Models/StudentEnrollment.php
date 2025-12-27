<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class StudentEnrollment extends Model
{
    protected $fillable = [
        'student_id',
        'class_id',
        'enrollment_date',
        'status',
        'notes'
    ];

    protected $casts = [
        'enrollment_date' => 'date',
    ];

    // Relationships
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(StudentClass::class);
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'enrolled');
    }

    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', 'completed');
    }

    public function scopeDropped(Builder $query): Builder
    {
        return $query->where('status', 'dropped');
    }

    public function scopeByClass(Builder $query, int $classId): Builder
    {
        return $query->where('class_id', $classId);
    }

    public function scopeByStudent(Builder $query, int $studentId): Builder
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeCurrentAcademicYear(Builder $query): Builder
    {
        $currentYear = now()->year;
        return $query->whereHas('class', function ($q) use ($currentYear) {
            $q->where('academic_year', $currentYear);
        });
    }

    // Helper methods
    public function complete(): bool
    {
        if ($this->status !== 'enrolled') {
            return false;
        }

        $this->update(['status' => 'completed']);
        return true;
    }

    public function drop(string $reason = null): bool
    {
        if ($this->status !== 'enrolled') {
            return false;
        }

        $this->update([
            'status' => 'dropped',
            'notes' => $reason
        ]);

        // Update class student count
        $this->class->decrement('current_students');

        // Remove student from class
        $this->student->update(['class_id' => null]);

        return true;
    }

    public function reactivate(): bool
    {
        if ($this->status === 'enrolled') {
            return false;
        }

        if (!$this->class->canEnrollStudent()) {
            return false;
        }

        $this->update(['status' => 'enrolled']);
        $this->student->update(['class_id' => $this->class_id]);
        $this->class->increment('current_students');

        return true;
    }

    // Static methods
    public static function getStatistics(): array
    {
        return [
            'total_enrollments' => static::count(),
            'active_enrollments' => static::where('status', 'enrolled')->count(),
            'completed_enrollments' => static::where('status', 'completed')->count(),
            'dropped_enrollments' => static::where('status', 'dropped')->count(),
        ];
    }
}