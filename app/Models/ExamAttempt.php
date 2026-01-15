<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamAttempt extends Model
{
    protected $fillable = [
        'exam_id',
        'student_id',
        'attempt_number',
        'started_at',
        'submitted_at',
        'expires_at',
        'score',
        'percentage',
        'status',
        'time_spent_minutes',
        'metadata',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'expires_at' => 'datetime',
        'score' => 'decimal:2',
        'percentage' => 'decimal:2',
        'metadata' => 'json',
    ];

    // Relationships
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function studentAnswers(): HasMany
    {
        return $this->hasMany(StudentAnswer::class);
    }

    // Scopes
    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    public function scopeGraded($query)
    {
        return $query->where('status', 'graded');
    }

    // Methods
    public function isExpired(): bool
    {
        return now() > $this->expires_at;
    }

    public function getRemainingTimeMinutes(): int
    {
        if ($this->isExpired()) {
            return 0;
        }

        return max(0, now()->diffInMinutes($this->expires_at, false));
    }

    public function canSubmit(): bool
    {
        return $this->status === 'in_progress' && !$this->isExpired();
    }

    public function submit(): void
    {
        if (!$this->canSubmit()) {
            return;
        }

        $this->submitted_at = now();
        $this->time_spent_minutes = $this->started_at->diffInMinutes($this->submitted_at);
        $this->status = 'submitted';
        
        // Auto-grade non-essay questions
        $this->autoGrade();
        
        $this->save();
    }

    public function autoGrade(): void
    {
        $totalScore = 0;
        $totalPoints = $this->exam->total_points;

        foreach ($this->studentAnswers as $answer) {
            $question = $answer->question;
            
            if ($question->type !== 'essay') {
                $points = $question->calculatePoints($answer->answer_text ?? $answer->selected_options);
                $answer->points_earned = $points;
                $answer->is_correct = $points > 0;
                $answer->save();
                
                $totalScore += $points;
            }
        }

        $this->score = $totalScore;
        $this->percentage = $totalPoints > 0 ? ($totalScore / $totalPoints) * 100 : 0;
        
        // Check if there are essay questions that need manual grading
        $hasEssays = $this->studentAnswers()
            ->whereHas('question', function($q) {
                $q->where('type', 'essay');
            })
            ->exists();
            
        $this->status = $hasEssays ? 'submitted' : 'graded';
    }

    public function getGrade(): string
    {
        if (!$this->percentage) {
            return 'N/A';
        }

        if ($this->percentage >= 90) return 'A';
        if ($this->percentage >= 80) return 'B';
        if ($this->percentage >= 70) return 'C';
        if ($this->percentage >= 60) return 'D';
        return 'F';
    }
}