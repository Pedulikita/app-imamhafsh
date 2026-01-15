<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    protected $fillable = [
        'exam_id',
        'question_text',
        'type',
        'options',
        'correct_answer',
        'points',
        'explanation',
        'image',
        'order',
    ];

    protected $casts = [
        'options' => 'json',
        'points' => 'decimal:2',
    ];

    // Relationships
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function studentAnswers(): HasMany
    {
        return $this->hasMany(StudentAnswer::class);
    }

    // Scopes
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Methods
    public function isCorrectAnswer($answer): bool
    {
        switch ($this->type) {
            case 'multiple_choice':
                return $answer === $this->correct_answer;
            
            case 'true_false':
                return (bool)$answer === (bool)$this->correct_answer;
            
            case 'fill_blank':
                // Case insensitive comparison
                return strtolower(trim($answer)) === strtolower(trim($this->correct_answer));
            
            case 'essay':
                // Essays need manual grading
                return null;
            
            default:
                return false;
        }
    }

    public function getFormattedOptions(): array
    {
        if ($this->type !== 'multiple_choice' || !$this->options) {
            return [];
        }

        return $this->options;
    }

    public function calculatePoints($studentAnswer): float
    {
        if ($this->type === 'essay') {
            // Essays are graded manually
            return 0;
        }

        return $this->isCorrectAnswer($studentAnswer) ? $this->points : 0;
    }
}