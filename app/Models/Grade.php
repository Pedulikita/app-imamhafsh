<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    protected $fillable = [
        'student_id',
        'teacher_class_id',
        'subject',
        'assessment_type',
        'score',
        'notes',
        'assessment_date',
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'assessment_date' => 'date',
    ];

    // Relationships
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function teacherClass(): BelongsTo
    {
        return $this->belongsTo(TeacherClass::class);
    }

    // Scopes
    public function scopeByAssessmentType($query, $type)
    {
        return $query->where('assessment_type', $type);
    }

    public function scopeBySubject($query, $subject)
    {
        return $query->where('subject', $subject);
    }

    public function scopeByTeacherClass($query, $classId)
    {
        return $query->where('teacher_class_id', $classId);
    }

    // Accessors
    public function getGradeLetterAttribute($value)
    {
        if ($value) return $value;
        
        return $this->calculateGradeLetter($this->score);
    }

    private function calculateGradeLetter($score)
    {
        if ($score >= 85) return 'A';
        if ($score >= 75) return 'B';
        if ($score >= 65) return 'C';
        if ($score >= 55) return 'D';
        return 'E';
    }
}
