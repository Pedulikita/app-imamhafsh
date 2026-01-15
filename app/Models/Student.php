<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Student extends Model
{
    protected $fillable = [
        'student_id',
        'name',
        'email',
        'birth_date',
        'birth_place',
        'gender',
        'address',
        'phone',
        'parent_name',
        'parent_phone',
        'parent_email',
        'class',
        'academic_year',
        'enrollment_date',
        'status',
        'photo',
        'emergency_contacts',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'enrollment_date' => 'date',
        'academic_year' => 'integer',
        'emergency_contacts' => 'array',
        // Kolom monitoring yang sudah ditambah:
        'average_grade' => 'decimal:2',
        'attendance_rate' => 'decimal:2', 
        'total_grades' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'email', 'email');
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(StudentClass::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(StudentEnrollment::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
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

    public function scopeByGender(Builder $query, string $gender): Builder
    {
        return $query->where('gender', $gender);
    }

    public function scopeByClass(Builder $query, string $className): Builder
    {
        return $query->where('class', $className);
    }

    public function scopeByPerformance(Builder $query, string $performance): Builder
    {
        return $query->where('performance_status', $performance);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('student_id', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('nis', 'like', "%{$search}%")
              ->orWhere('nisn', 'like', "%{$search}%");
        });
    }

    // Accessors
    public function getAgeAttribute(): ?int
    {
        if (!$this->birth_date) {
            return null;
        }
        
        return Carbon::parse($this->birth_date)->age;
    }

    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->photo) {
            return Storage::url($this->photo);
        }
        
        // Generate avatar with initials
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=3B82F6&color=FFFFFF';
    }

    // Helper methods
    public function getCurrentEnrollment(): ?StudentEnrollment
    {
        return $this->enrollments()->where('status', 'enrolled')->latest()->first();
    }

    public function isEnrolledInClass(int $classId): bool
    {
        return $this->enrollments()
                   ->where('class_id', $classId)
                   ->where('status', 'enrolled')
                   ->exists();
    }

    public function calculateAverageGrade(): float
    {
        return $this->grades()->avg('score') ?? 0;
    }

    public function calculateAttendanceRate(): float
    {
        $totalAttendance = $this->attendances()->count();
        if ($totalAttendance === 0) {
            return 0;
        }
        
        $presentCount = $this->attendances()->where('status', 'present')->count();
        return ($presentCount / $totalAttendance) * 100;
    }

    public function updatePerformanceStatus(): void
    {
        $average = $this->calculateAverageGrade();
        $attendance = $this->calculateAttendanceRate();
        
        if ($average >= 85 && $attendance >= 90) {
            $status = 'excellent';
        } elseif ($average >= 75 && $attendance >= 85) {
            $status = 'good';
        } elseif ($average >= 65 && $attendance >= 75) {
            $status = 'satisfactory';
        } else {
            $status = 'needs_attention';
        }
        
        $this->update([
            'average_grade' => $average,
            'attendance_rate' => $attendance,
            'performance_status' => $status,
            'total_grades' => $this->grades()->count()
        ]);
    }

    // Static methods
    public static function generateStudentId(int $academicYear): string
    {
        $year = substr($academicYear, -2);
        $lastStudent = static::where('academic_year', $academicYear)
                           ->orderBy('id', 'desc')
                           ->first();
        
        $sequence = $lastStudent ? 
            intval(substr($lastStudent->student_id, -4)) + 1 : 1;
        
        return $year . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    public static function getStatistics(): array
    {
        $total = static::count();
        $active = static::where('status', 'active')->count();
        
        $byGender = [
            'male' => static::where('gender', 'male')->count(),
            'female' => static::where('gender', 'female')->count(),
        ];
        
        $byPerformance = [
            'excellent' => static::where('performance_status', 'excellent')->count(),
            'good' => static::where('performance_status', 'good')->count(),
            'satisfactory' => static::where('performance_status', 'satisfactory')->count(),
            'needs_attention' => static::where('performance_status', 'needs_attention')->count(),
        ];
        
        $byClass = static::select('class', \DB::raw('count(*) as count'))
                         ->groupBy('class')
                         ->get()
                         ->pluck('count', 'class')
                         ->toArray();
        
        return [
            'total_students' => $total,
            'active_students' => $active,
            'by_gender' => $byGender,
            'by_performance' => $byPerformance,
            'by_class' => $byClass,
        ];
    }
}
