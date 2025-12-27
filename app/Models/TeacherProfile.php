<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TeacherProfile extends Model
{
    protected $fillable = [
        'user_id',
        'nip',
        'employee_id',
        'phone',
        'address',
        'date_of_birth',
        'gender',
        'education_level',
        'major',
        'employment_status',
        'start_date',
        'certifications',
        'teaching_subjects',
        'grade_levels_taught',
        'max_classes_capacity',
        'is_active',
        'notes',
        'profile_photo',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'start_date' => 'date',
        'certifications' => 'array',
        'teaching_subjects' => 'array',
        'grade_levels_taught' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the teacher profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subjects this teacher can teach.
     */
    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'teacher_subject', 'teacher_profile_id', 'subject_id');
    }

    /**
     * Get the classes assigned to this teacher.
     */
    public function assignedClasses()
    {
        return $this->hasMany(TeacherClass::class, 'teacher_id', 'user_id');
    }

    /**
     * Check if teacher can teach a specific subject.
     */
    public function canTeachSubject($subjectId): bool
    {
        $teachingSubjects = $this->teaching_subjects ?? [];
        return in_array($subjectId, $teachingSubjects);
    }

    /**
     * Check if teacher can teach a specific grade level.
     */
    public function canTeachGradeLevel($gradeLevel): bool
    {
        $gradeLevels = $this->grade_levels_taught ?? [];
        return in_array($gradeLevel, $gradeLevels);
    }

    /**
     * Check if teacher has capacity for more classes.
     */
    public function hasCapacityForMoreClasses(): bool
    {
        $currentClassCount = $this->assignedClasses()->count();
        return $currentClassCount < $this->max_classes_capacity;
    }

    /**
     * Get teacher's full name with NIP.
     */
    public function getFullNameWithNipAttribute(): string
    {
        $name = $this->user->name ?? 'Unknown';
        $nip = $this->nip ? ' (NIP: ' . $this->nip . ')' : '';
        return $name . $nip;
    }

    /**
     * Get teaching experience in years.
     */
    public function getTeachingExperienceAttribute(): int
    {
        if (!$this->start_date) {
            return 0;
        }
        
        return $this->start_date->diffInYears(now());
    }
}
