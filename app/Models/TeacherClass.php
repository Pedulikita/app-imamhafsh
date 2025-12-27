<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TeacherClass extends Model
{
    use HasFactory;

    protected $table = 'teacher_classes';

    protected $fillable = [
        'name',
        'grade_id',
        'teacher_id',
        'subject_id',
        'academic_year',
        'semester',
        'status',
        'description'
    ];

    protected $casts = [
        'status' => 'string'
    ];

    // Relationship with User (Teacher)
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    // Relationship with Grade Level
    public function grade(): BelongsTo
    {
        return $this->belongsTo(GradeLevel::class);
    }

    // Relationship with Subject
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    // Students in this class (many-to-many)
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'class_students', 'class_id', 'student_id')
                    ->withPivot(['enrollment_date', 'status'])
                    ->withTimestamps();
    }

    // Attendance records for this class
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    // Activities in this class
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'class_id');
    }

    // Grades for this class
    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    // Get total students count
    public function getTotalStudentsAttribute(): int
    {
        return $this->students()->where('class_students.status', 'active')->count();
    }

    // Get attendance rate for the class
    public function getAttendanceRateAttribute(): float
    {
        $totalRecords = $this->attendanceRecords()->count();
        if ($totalRecords === 0) return 0;

        $presentRecords = $this->attendanceRecords()
            ->where('status', 'present')
            ->count();

        return ($presentRecords / $totalRecords) * 100;
    }

    // Scope for active classes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Scope for teacher's classes
    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    // Check if teacher can access this class
    public function canBeAccessedByTeacher($teacherId): bool
    {
        return $this->teacher_id === $teacherId;
    }
}