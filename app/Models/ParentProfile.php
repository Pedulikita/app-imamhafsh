<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'father_name',
        'mother_name',
        'father_phone',
        'mother_phone',
        'father_email',
        'mother_email',
        'father_occupation',
        'mother_occupation',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
        'notification_preferences',
        'receive_grade_notifications',
        'receive_attendance_notifications',
        'receive_behavior_notifications',
        'receive_announcement_notifications',
    ];

    protected $casts = [
        'notification_preferences' => 'json',
        'receive_grade_notifications' => 'boolean',
        'receive_attendance_notifications' => 'boolean',
        'receive_behavior_notifications' => 'boolean',
        'receive_announcement_notifications' => 'boolean',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'parent_student')
                    ->withPivot(['relation', 'is_primary_contact', 'can_pickup', 'emergency_contact'])
                    ->withTimestamps();
    }

    public function communications(): HasMany
    {
        return $this->hasMany(ParentTeacherCommunication::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(ParentNotification::class);
    }

    // Methods
    public function getPrimaryContact(): array
    {
        $contacts = [];
        
        if ($this->father_name && $this->father_phone) {
            $contacts[] = [
                'name' => $this->father_name,
                'phone' => $this->father_phone,
                'email' => $this->father_email,
                'type' => 'father'
            ];
        }
        
        if ($this->mother_name && $this->mother_phone) {
            $contacts[] = [
                'name' => $this->mother_name,
                'phone' => $this->mother_phone,
                'email' => $this->mother_email,
                'type' => 'mother'
            ];
        }

        return $contacts;
    }

    public function getNotificationPreferences(): array
    {
        return $this->notification_preferences ?? [
            'sms' => true,
            'email' => true,
            'whatsapp' => false,
            'push' => true
        ];
    }

    public function shouldReceiveNotification(string $type): bool
    {
        switch ($type) {
            case 'grade_update':
                return $this->receive_grade_notifications;
            case 'attendance_alert':
                return $this->receive_attendance_notifications;
            case 'behavior_report':
                return $this->receive_behavior_notifications;
            case 'announcement':
                return $this->receive_announcement_notifications;
            default:
                return true;
        }
    }

    public function getChildrenSummary(): array
    {
        return $this->students->map(function($student) {
            return [
                'id' => $student->id,
                'name' => $student->name,
                'class' => $student->current_class,
                'relation' => $student->pivot->relation,
                'is_primary' => $student->pivot->is_primary_contact,
                'recent_attendance' => $student->getAttendancePercentage(30), // Last 30 days
                'recent_grades' => $student->getRecentGrades(5), // Last 5 grades
            ];
        })->toArray();
    }

    public function getUnreadNotificationsCount(): int
    {
        return $this->notifications()->where('is_read', false)->count();
    }

    public function getRecentCommunications(int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return $this->communications()
                    ->with(['teacher', 'student'])
                    ->orderBy('created_at', 'desc')
                    ->limit($limit)
                    ->get();
    }
}