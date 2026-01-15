<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeType extends Model
{
    protected $fillable = [
        'name',
        'description',
        'amount',
        'frequency',
        'payment_type',
        'applicable_grades',
        'is_active',
        'valid_from',
        'valid_until',
        'allow_installments',
        'max_installments'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'applicable_grades' => 'array',
        'is_active' => 'boolean',
        'allow_installments' => 'boolean',
        'valid_from' => 'date',
        'valid_until' => 'date'
    ];

    public function studentPayments(): HasMany
    {
        return $this->hasMany(StudentPayment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForGrade($query, $gradeId)
    {
        return $query->whereJsonContains('applicable_grades', $gradeId)
                    ->orWhereNull('applicable_grades');
    }

    public function scopeMandatory($query)
    {
        return $query->where('payment_type', 'mandatory');
    }

    public function getFormattedAmountAttribute()
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }

    public function isApplicableToGrade($gradeId): bool
    {
        if (is_null($this->applicable_grades)) {
            return true; // Applies to all grades
        }
        
        return in_array($gradeId, $this->applicable_grades);
    }
}
