<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class StudentClass extends Model
{
    protected $fillable = [
        'name',
        'grade',
        'academic_year',
        'capacity',
        'current_students',
        'homeroom_teacher_id',
        'status',
        'description'
    ];

    protected $casts = [
        'academic_year' => 'integer',
        'capacity' => 'integer',
        'current_students' => 'integer',
    ];

    // Relationships
    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(StudentEnrollment::class, 'class_id');
    }

    public function homeroomTeacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'homeroom_teacher_id');
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(StudentSubject::class, 'class_subjects', 'class_id', 'subject_id')
                   ->withPivot('teacher_id', 'schedule')
                   ->withTimestamps();
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeByAcademicYear(Builder $query, int $year): Builder
    {
        return $query->where('academic_year', $year);
    }

    public function scopeByGrade(Builder $query, string $grade): Builder
    {
        return $query->where('grade', $grade);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->whereColumn('current_students', '<', 'capacity')
                     ->where('status', 'active');
    }

    // Accessors
    public function getAvailableSlotsAttribute(): int
    {
        return $this->capacity - $this->current_students;
    }

    public function getIsFullAttribute(): bool
    {
        return $this->current_students >= $this->capacity;
    }

    public function getOccupancyRateAttribute(): float
    {
        if ($this->capacity === 0) {
            return 0;
        }
        
        return ($this->current_students / $this->capacity) * 100;
    }

    // Helper methods
    public function canEnrollStudent(): bool
    {
        return $this->status === 'active' && $this->current_students < $this->capacity;
    }

    public function enrollStudent(Student $student): bool
    {
        if (!$this->canEnrollStudent()) {
            return false;
        }

        // Update student's class
        $student->update(['class_id' => $this->id]);

        // Create enrollment record
        StudentEnrollment::create([
            'student_id' => $student->id,
            'class_id' => $this->id,
            'enrollment_date' => now()->toDateString(),
            'status' => 'enrolled'
        ]);

        // Update current students count
        $this->increment('current_students');

        return true;
    }

    public function removeStudent(Student $student): bool
    {
        $enrollment = $this->enrollments()
                          ->where('student_id', $student->id)
                          ->where('status', 'enrolled')
                          ->first();

        if ($enrollment) {
            $enrollment->update(['status' => 'dropped']);
            $student->update(['class_id' => null]);
            $this->decrement('current_students');
            return true;
        }

        return false;
    }

    public function updateStudentCount(): void
    {
        $count = $this->students()->count();
        $this->update(['current_students' => $count]);
    }

    public function getActiveEnrollments()
    {
        return $this->enrollments()->where('status', 'enrolled')->with('student');
    }
}