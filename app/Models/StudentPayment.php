<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class StudentPayment extends Model
{
    protected $fillable = [
        'student_id',
        'fee_type_id',
        'payment_code',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'status',
        'due_date',
        'paid_date',
        'academic_year',
        'semester',
        'month',
        'notes',
        'metadata'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_date' => 'date',
        'metadata' => 'array'
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function feeType(): BelongsTo
    {
        return $this->belongsTo(FeeType::class);
    }

    public function installments(): HasMany
    {
        return $this->hasMany(PaymentInstallment::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue')
                    ->orWhere(function($q) {
                        $q->where('status', 'pending')
                          ->where('due_date', '<', Carbon::now());
                    });
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeForAcademicYear($query, $year)
    {
        return $query->where('academic_year', $year);
    }

    public function getFormattedTotalAmountAttribute()
    {
        return 'Rp ' . number_format($this->total_amount, 0, ',', '.');
    }

    public function getFormattedPaidAmountAttribute()
    {
        return 'Rp ' . number_format($this->paid_amount, 0, ',', '.');
    }

    public function getFormattedRemainingAmountAttribute()
    {
        return 'Rp ' . number_format($this->remaining_amount, 0, ',', '.');
    }

    public function getPaymentProgressAttribute()
    {
        if ($this->total_amount == 0) return 0;
        return round(($this->paid_amount / $this->total_amount) * 100, 2);
    }

    public function updatePaymentStatus()
    {
        $paidInstallments = $this->installments()->where('status', 'paid')->sum('amount');
        $this->paid_amount = $paidInstallments;
        $this->remaining_amount = $this->total_amount - $paidInstallments;
        
        if ($this->remaining_amount <= 0) {
            $this->status = 'paid';
            $this->paid_date = Carbon::now();
        } elseif ($this->paid_amount > 0) {
            $this->status = 'partial';
        } elseif ($this->due_date < Carbon::now()) {
            $this->status = 'overdue';
        } else {
            $this->status = 'pending';
        }
        
        $this->save();
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($payment) {
            if (!$payment->payment_code) {
                $payment->payment_code = 'PAY' . date('Ymd') . str_pad(static::count() + 1, 4, '0', STR_PAD_LEFT);
            }
            $payment->remaining_amount = $payment->total_amount - $payment->paid_amount;
        });
    }
}
