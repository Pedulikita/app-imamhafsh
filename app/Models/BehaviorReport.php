<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class BehaviorReport extends Model
{
    protected $fillable = [
        'student_id',
        'teacher_id',
        'behavior_category_id',
        'title',
        'description',
        'severity',
        'type',
        'incident_date',
        'incident_time',
        'location',
        'witnesses',
        'context',
        'immediate_action',
        'follow_up_required',
        'parent_notified',
        'parent_notification_date',
        'status',
        'attachments',
        'points',
        'student_response',
        'parent_response',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
    ];

    protected $casts = [
        'incident_date' => 'date',
        'incident_time' => 'datetime:H:i',
        'witnesses' => 'array',
        'attachments' => 'array',
        'parent_notified' => 'boolean',
        'parent_notification_date' => 'datetime',
        'reviewed_at' => 'datetime',
        'points' => 'integer',
    ];

    /**
     * Get the student associated with the behavior report.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the teacher who created the report.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the behavior category.
     */
    public function behaviorCategory(): BelongsTo
    {
        return $this->belongsTo(BehaviorCategory::class);
    }

    /**
     * Get the reviewer (if reviewed).
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Get the actions for this behavior report.
     */
    public function actions(): HasMany
    {
        return $this->hasMany(BehaviorReportAction::class);
    }

    /**
     * Scope for specific student.
     */
    public function scopeForStudent(Builder $query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    /**
     * Scope for specific teacher.
     */
    public function scopeByTeacher(Builder $query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    /**
     * Scope by status.
     */
    public function scopeWithStatus(Builder $query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope by type.
     */
    public function scopeOfType(Builder $query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope by severity.
     */
    public function scopeBySeverity(Builder $query, $severity)
    {
        return $query->where('severity', $severity);
    }

    /**
     * Scope for date range.
     */
    public function scopeInDateRange(Builder $query, $startDate, $endDate)
    {
        return $query->whereBetween('incident_date', [$startDate, $endDate]);
    }

    /**
     * Get severity color.
     */
    public function getSeverityColorAttribute()
    {
        return match($this->severity) {
            'low' => '#10B981',
            'medium' => '#F59E0B',
            'high' => '#EF4444',
            'critical' => '#DC2626',
            default => '#6B7280'
        };
    }

    /**
     * Get type color.
     */
    public function getTypeColorAttribute()
    {
        return match($this->type) {
            'positive' => '#10B981',
            'negative' => '#EF4444',
            'neutral' => '#6B7280',
            default => '#6B7280'
        };
    }

    /**
     * Get status color.
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'draft' => '#6B7280',
            'submitted' => '#3B82F6',
            'reviewed' => '#10B981',
            'closed' => '#6B7280',
            default => '#6B7280'
        };
    }
}
