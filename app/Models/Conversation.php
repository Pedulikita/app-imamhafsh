<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    protected $fillable = [
        'title',
        'teacher_id',
        'parent_id',
        'student_id',
        'status',
        'last_message_at'
    ];

    protected $casts = [
        'last_message_at' => 'datetime'
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function unreadMessagesFor(User $user): HasMany
    {
        return $this->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at');
    }

    public function markAsReadFor(User $user): void
    {
        $this->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function getOtherParticipant(User $user): User
    {
        if ($user->id === $this->teacher_id) {
            return $this->parent;
        }
        return $this->teacher;
    }
}
