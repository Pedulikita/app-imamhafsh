<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeeType;
use App\Models\StudentPayment;
use App\Models\PaymentInstallment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index()
    {
        // Statistik pembayaran
        $stats = [
            'total_students' => User::count(), // Changed from role filter
            'total_revenue' => StudentPayment::sum('total_amount'),
            'pending_payments' => StudentPayment::where('status', 'pending')->count(),
            'overdue_payments' => StudentPayment::where('status', 'overdue')->count()
        ];

        // Data pembayaran terbaru dengan relasi
        $payments = StudentPayment::with(['student', 'feeType'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Payments/Index', [
            'stats' => $stats,
            'payments' => $payments
        ]);
    }

    public function students()
    {
        $students = User::with(['payments.feeType'])
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Admin/Payments/Students', [
            'students' => $students
        ]);
    }

    public function feeTypes()
    {
        $feeTypes = FeeType::orderBy('name')->paginate(10);

        return Inertia::render('Admin/Payments/FeeTypes', [
            'feeTypes' => $feeTypes
        ]);
    }

    public function storeFeeType(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:monthly,semester,yearly,one_time',
            'payment_type' => 'required|in:mandatory,optional',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date',
            'is_active' => 'boolean',
            'allow_installments' => 'boolean',
            'max_installments' => 'integer|min:1',
        ]);

        FeeType::create($request->all());

        return redirect()->back()->with('success', 'Fee type created successfully');
    }

    public function updateFeeType(Request $request, FeeType $feeType)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:monthly,semester,yearly,one_time',
            'payment_type' => 'required|in:mandatory,optional',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date',
            'is_active' => 'boolean',
            'allow_installments' => 'boolean',
            'max_installments' => 'integer|min:1',
        ]);

        $feeType->update($request->all());

        return redirect()->back()->with('success', 'Fee type updated successfully');
    }

    public function destroyFeeType(FeeType $feeType)
    {
        $feeType->delete();
        return redirect()->back()->with('success', 'Fee type deleted successfully');
    }

    public function createPayment(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'fee_type_id' => 'required|exists:fee_types,id',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date'
        ]);

        StudentPayment::create([
            'student_id' => $request->student_id,
            'fee_type_id' => $request->fee_type_id,
            'total_amount' => $request->amount,
            'due_date' => $request->due_date,
            'status' => 'pending',
            'academic_year' => '2025/2026' // You might want to make this dynamic
        ]);

        return redirect()->back()->with('success', 'Payment created successfully');
    }

    public function updatePayment(Request $request, StudentPayment $payment)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'status' => 'required|in:pending,paid,overdue,partial,cancelled'
        ]);

        $updateData = [
            'total_amount' => $request->amount,
            'due_date' => $request->due_date,
            'status' => $request->status
        ];
        
        $payment->update($updateData);

        // Jika status berubah ke paid, update paid_date
        if ($request->status === 'paid' && $payment->status !== 'paid') {
            $payment->update(['paid_date' => now()]);
        }

        return redirect()->back()->with('success', 'Payment updated successfully');
    }

    public function reports()
    {
        $currentMonth = now()->format('Y-m');
        $currentYear = now()->format('Y');

        // Monthly revenue report
        $monthlyRevenue = StudentPayment::where('status', 'paid')
            ->whereMonth('paid_date', now()->month)
            ->whereYear('paid_date', now()->year)
            ->sum('total_amount');

        // Yearly revenue report
        $yearlyRevenue = StudentPayment::where('status', 'paid')
            ->whereYear('paid_date', now()->year)
            ->sum('total_amount');

        // Fee type breakdown
        $feeTypeStats = FeeType::with(['studentPayments' => function($query) {
            $query->where('status', 'paid');
        }])->get()->map(function($feeType) {
            return [
                'name' => $feeType->name,
                'total_revenue' => $feeType->studentPayments->sum('total_amount'),
                'payment_count' => $feeType->studentPayments->count()
            ];
        });

        // Payment status distribution
        $statusStats = StudentPayment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        return Inertia::render('Admin/Payments/Reports', [
            'monthlyRevenue' => $monthlyRevenue,
            'yearlyRevenue' => $yearlyRevenue,
            'feeTypeStats' => $feeTypeStats,
            'statusStats' => $statusStats
        ]);
    }

    public function show(StudentPayment $payment)
    {
        $payment->load(['student', 'feeType', 'installments']);
        
        return Inertia::render('Admin/Payments/Show', [
            'payment' => $payment
        ]);
    }

    public function edit(StudentPayment $payment)
    {
        $payment->load(['student', 'feeType', 'installments']);
        
        $feeTypes = FeeType::where('is_active', true)->get();
        $students = User::orderBy('name')->get(['id', 'name', 'email']);
        
        return Inertia::render('Admin/Payments/Edit', [
            'payment' => $payment,
            'feeTypes' => $feeTypes,
            'students' => $students
        ]);
    }

    public function update(Request $request, StudentPayment $payment)
    {
        $request->validate([
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,overdue,partial,cancelled',
            'due_date' => 'required|date',
            'paid_date' => 'nullable|date',
            'notes' => 'nullable|string'
        ]);

        $payment->update($request->all());

        return redirect()->route('admin.payments.show', $payment)
            ->with('success', 'Payment updated successfully');
    }
}
