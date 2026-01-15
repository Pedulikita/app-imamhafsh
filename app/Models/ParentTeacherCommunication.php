<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParentTeacherCommunication extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_profile_id',
        'teacher_id',
        'student_id',
        'subject',
        'message',
        'teacher_reply',
        'status',
        'priority',
        'category',
        'replied_at'
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    /**
     * Get the parent profile that owns this communication.
     */
    public function parentProfile(): BelongsTo
    {
        return $this->belongsTo(ParentProfile::class);
    }

    /**
     * Get the teacher that owns this communication.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the student that this communication is about.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Scope for unread communications
     */
    public function scopeUnread($query)
    {
        return $query->where('status', 'sent');
    }

    /**
     * Scope for replied communications
     */
    public function scopeReplied($query)
    {
        return $query->where('status', 'replied');
    }

    /**
     * Scope for urgent communications
     */
    public function scopeUrgent($query)
    {
        return $query->where('priority', 'urgent');
    }

    /**
     * Scope for high priority communications
     */
    public function scopeHighPriority($query)
    {
        return $query->whereIn('priority', ['high', 'urgent']);
    }

    /**
     * Mark communication as read
     */
    public function markAsRead()
    {
        if ($this->status === 'sent') {
            $this->update(['status' => 'read']);
        }
    }

    /**
     * Mark communication as replied
     */
    public function markAsReplied($reply)
    {
        $this->update([
            'status' => 'replied',
            'teacher_reply' => $reply,
            'replied_at' => now()
        ]);
    }
}