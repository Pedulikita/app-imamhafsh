<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'status',
        'published_at',
        'teacher_id',
        'priority',
        'target_audience'
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * Get the teacher that owns the announcement.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the author (teacher) of the announcement.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Scope for published announcements
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope for draft announcements
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }
}