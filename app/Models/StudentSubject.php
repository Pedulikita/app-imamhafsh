<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class StudentSubject extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'credits',
        'teacher_id',
        'status'
    ];

    protected $casts = [
        'credits' => 'integer',
    ];

    // Relationships
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(StudentClass::class, 'class_subjects', 'subject_id', 'class_id')
                   ->withPivot('teacher_id', 'schedule')
                   ->withTimestamps();
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeByTeacher(Builder $query, int $teacherId): Builder
    {
        return $query->where('teacher_id', $teacherId);
    }
}