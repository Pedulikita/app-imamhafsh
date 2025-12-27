<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'student_id',
        'subject_id',
        'date',
        'status',
        'time_in',
        'time_out',
        'notes',
        'semester',
        'academic_year',
    ];

    protected $casts = [
        'date' => 'date',
        'time_in' => 'datetime:H:i',
        'time_out' => 'datetime:H:i',
        'academic_year' => 'integer',
    ];

    // Relationships
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    // Scopes
    public function scopeByDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByAcademicYear($query, $year)
    {
        return $query->where('academic_year', $year);
    }

    public function scopeBySemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }

    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }

    public function scopeAbsent($query)
    {
        return $query->whereIn('status', ['absent', 'sick']);
    }
}
