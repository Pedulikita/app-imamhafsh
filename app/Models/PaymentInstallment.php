<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class PaymentInstallment extends Model
{
    protected $fillable = [
        'student_payment_id',
        'installment_number',
        'amount',
        'due_date',
        'paid_date',
        'status',
        'payment_method',
        'reference_number',
        'recorded_by',
        'notes'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'paid_date' => 'date'
    ];

    public function studentPayment(): BelongsTo
    {
        return $this->belongsTo(StudentPayment::class);
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
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

    public function getFormattedAmountAttribute()
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }

    public function markAsPaid($paymentMethod = null, $referenceNumber = null, $recordedBy = null, $notes = null)
    {
        $this->update([
            'status' => 'paid',
            'paid_date' => Carbon::now(),
            'payment_method' => $paymentMethod,
            'reference_number' => $referenceNumber,
            'recorded_by' => $recordedBy,
            'notes' => $notes
        ]);

        // Update parent payment status
        $this->studentPayment->updatePaymentStatus();
    }

    protected static function boot()
    {
        parent::boot();
        
        static::updated(function ($installment) {
            if ($installment->isDirty('status') && $installment->status === 'paid') {
                $installment->studentPayment->updatePaymentStatus();
            }
        });
    }
}
