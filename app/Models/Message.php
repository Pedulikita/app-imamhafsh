<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'message',
        'message_type',
        'file_path',
        'file_name',
        'read_at',
        'is_edited',
        'edited_at',
        'metadata'
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'edited_at' => 'datetime',
        'is_edited' => 'boolean',
        'metadata' => 'array'
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function markAsRead(): void
    {
        if (!$this->read_at) {
            $this->update(['read_at' => now()]);
        }
    }

    public function isUnread(): bool
    {
        return $this->read_at === null;
    }

    public function isFromUser(User $user): bool
    {
        return $this->sender_id === $user->id;
    }
}
