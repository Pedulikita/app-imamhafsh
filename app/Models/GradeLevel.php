<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GradeLevel extends Model
{
    protected $fillable = [
        'name',
        'level',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationship with TeacherClass
    public function teacherClasses(): HasMany
    {
        return $this->hasMany(TeacherClass::class, 'grade_id');
    }

    // Relationship with Student
    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'grade_id');
    }

    // Scope for active grade levels
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope to order by level
    public function scopeOrderByLevel($query)
    {
        return $query->orderBy('level');
    }
}
