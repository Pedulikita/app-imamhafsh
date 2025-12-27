<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAnswer extends Model
{
    protected $fillable = [
        'exam_attempt_id',
        'question_id',
        'answer_text',
        'selected_options',
        'points_earned',
        'is_correct',
        'teacher_feedback',
        'answered_at',
    ];

    protected $casts = [
        'selected_options' => 'json',
        'points_earned' => 'decimal:2',
        'is_correct' => 'boolean',
        'answered_at' => 'datetime',
    ];

    // Relationships
    public function examAttempt(): BelongsTo
    {
        return $this->belongsTo(ExamAttempt::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    // Methods
    public function getFormattedAnswer(): string
    {
        switch ($this->question->type) {
            case 'multiple_choice':
                if ($this->selected_options && is_array($this->selected_options)) {
                    $options = $this->question->getFormattedOptions();
                    return implode(', ', array_map(function($key) use ($options) {
                        return "$key: " . ($options[$key] ?? 'Unknown');
                    }, $this->selected_options));
                }
                return $this->answer_text ?? 'No answer';
            
            case 'true_false':
                return $this->answer_text ? 'True' : 'False';
            
            default:
                return $this->answer_text ?? 'No answer';
        }
    }

    public function isAnswered(): bool
    {
        return !empty($this->answer_text) || !empty($this->selected_options);
    }
}