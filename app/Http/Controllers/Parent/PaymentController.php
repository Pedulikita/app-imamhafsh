<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\StudentPayment;
use App\Models\PaymentInstallment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function index()
    {
        $parent = Auth::user();
        
        // Get all children for this parent
        $children = User::where('role', 'student')
            ->whereHas('parentProfile', function($q) use ($parent) {
                $q->where('parent_id', $parent->id);
            })
            ->with('grade')
            ->get();

        // Get payments for all children
        $payments = StudentPayment::whereIn('student_id', $children->pluck('id'))
            ->with(['student.grade', 'feeType', 'installments'])
            ->orderBy('due_date', 'desc')
            ->paginate(15);

        // Get payment statistics
        $stats = [
            'total_payments' => StudentPayment::whereIn('student_id', $children->pluck('id'))->count(),
            'pending_amount' => StudentPayment::whereIn('student_id', $children->pluck('id'))
                ->where('status', '!=', 'paid')
                ->sum('remaining_amount'),
            'overdue_count' => StudentPayment::whereIn('student_id', $children->pluck('id'))
                ->overdue()
                ->count(),
            'paid_this_year' => StudentPayment::whereIn('student_id', $children->pluck('id'))
                ->where('academic_year', date('Y') . '/' . (date('Y') + 1))
                ->sum('paid_amount')
        ];

        return Inertia::render('Parent/Payments/Index', [
            'payments' => $payments,
            'children' => $children,
            'stats' => $stats
        ]);
    }

    public function show(StudentPayment $payment)
    {
        $parent = Auth::user();
        
        // Verify parent has access to this payment
        $hasAccess = User::where('id', $payment->student_id)
            ->whereHas('parentProfile', function($q) use ($parent) {
                $q->where('parent_id', $parent->id);
            })
            ->exists();
            
        if (!$hasAccess) {
            abort(403, 'Unauthorized access to payment information.');
        }

        $payment->load(['student.grade', 'feeType', 'installments']);

        return Inertia::render('Parent/Payments/Show', [
            'payment' => $payment
        ]);
    }

    public function child($childId)
    {
        $parent = Auth::user();
        
        // Verify parent has access to this child
        $child = User::where('id', $childId)
            ->where('role', 'student')
            ->whereHas('parentProfile', function($q) use ($parent) {
                $q->where('parent_id', $parent->id);
            })
            ->with('grade')
            ->firstOrFail();

        // Get child's payments
        $payments = StudentPayment::where('student_id', $child->id)
            ->with(['feeType', 'installments'])
            ->orderBy('due_date', 'desc')
            ->paginate(15);

        // Get child's payment statistics
        $stats = [
            'total_payments' => StudentPayment::where('student_id', $child->id)->count(),
            'pending_amount' => StudentPayment::where('student_id', $child->id)
                ->where('status', '!=', 'paid')
                ->sum('remaining_amount'),
            'overdue_count' => StudentPayment::where('student_id', $child->id)
                ->overdue()
                ->count(),
            'paid_this_year' => StudentPayment::where('student_id', $child->id)
                ->where('academic_year', date('Y') . '/' . (date('Y') + 1))
                ->sum('paid_amount'),
            'payment_progress' => $this->getPaymentProgress($child->id)
        ];

        return Inertia::render('Parent/Payments/Child', [
            'child' => $child,
            'payments' => $payments,
            'stats' => $stats
        ]);
    }

    public function receipt($installmentId)
    {
        $parent = Auth::user();
        
        $installment = PaymentInstallment::where('id', $installmentId)
            ->where('status', 'paid')
            ->with(['studentPayment.student.grade', 'studentPayment.feeType', 'recordedBy'])
            ->firstOrFail();

        // Verify parent has access to this payment
        $hasAccess = User::where('id', $installment->studentPayment->student_id)
            ->whereHas('parentProfile', function($q) use ($parent) {
                $q->where('parent_id', $parent->id);
            })
            ->exists();
            
        if (!$hasAccess) {
            abort(403, 'Unauthorized access to payment receipt.');
        }

        return Inertia::render('Parent/Payments/Receipt', [
            'installment' => $installment,
            'payment' => $installment->studentPayment
        ]);
    }

    public function history()
    {
        $parent = Auth::user();
        
        // Get all children for this parent
        $children = User::where('role', 'student')
            ->whereHas('parentProfile', function($q) use ($parent) {
                $q->where('parent_id', $parent->id);
            })
            ->with('grade')
            ->get();

        // Get payment history (paid installments)
        $paymentHistory = PaymentInstallment::where('status', 'paid')
            ->whereHas('studentPayment', function($q) use ($children) {
                $q->whereIn('student_id', $children->pluck('id'));
            })
            ->with(['studentPayment.student.grade', 'studentPayment.feeType', 'recordedBy'])
            ->orderBy('paid_date', 'desc')
            ->paginate(20);

        // Annual payment summary
        $currentYear = date('Y');
        $annualSummary = [];
        for ($i = 0; $i < 3; $i++) {
            $year = $currentYear - $i;
            $academicYear = $year . '/' . ($year + 1);
            
            $annualSummary[] = [
                'academic_year' => $academicYear,
                'total_paid' => PaymentInstallment::where('status', 'paid')
                    ->whereHas('studentPayment', function($q) use ($children, $academicYear) {
                        $q->whereIn('student_id', $children->pluck('id'))
                          ->where('academic_year', $academicYear);
                    })
                    ->sum('amount'),
                'payment_count' => PaymentInstallment::where('status', 'paid')
                    ->whereHas('studentPayment', function($q) use ($children, $academicYear) {
                        $q->whereIn('student_id', $children->pluck('id'))
                          ->where('academic_year', $academicYear);
                    })
                    ->count()
            ];
        }

        return Inertia::render('Parent/Payments/History', [
            'paymentHistory' => $paymentHistory,
            'children' => $children,
            'annualSummary' => $annualSummary
        ]);
    }

    private function getPaymentProgress($studentId)
    {
        $currentAcademicYear = date('Y') . '/' . (date('Y') + 1);
        
        $totalAmount = StudentPayment::where('student_id', $studentId)
            ->where('academic_year', $currentAcademicYear)
            ->sum('total_amount');
            
        $paidAmount = StudentPayment::where('student_id', $studentId)
            ->where('academic_year', $currentAcademicYear)
            ->sum('paid_amount');
            
        if ($totalAmount == 0) return 0;
        
        return round(($paidAmount / $totalAmount) * 100, 2);
    }
}
