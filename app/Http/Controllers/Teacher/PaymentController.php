<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\StudentPayment;
use App\Models\PaymentInstallment;
use App\Models\FeeType;
use App\Models\User;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentPayment::with(['student.grade', 'feeType', 'installments'])
            ->whereHas('student', function($q) {
                $teacherUser = Auth::user();
                if ($teacherUser->role === 'teacher') {
                    // Only show payments for students in teacher's classes
                    $q->whereHas('studentClasses.teacherClass', function($subQ) use ($teacherUser) {
                        $subQ->where('teacher_id', $teacherUser->id);
                    });
                }
            });

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('fee_type')) {
            $query->where('fee_type_id', $request->fee_type);
        }

        if ($request->filled('grade')) {
            $query->whereHas('student.grade', function($q) use ($request) {
                $q->where('id', $request->grade);
            });
        }

        if ($request->filled('search')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $payments = $query->orderBy('due_date', 'desc')
                         ->paginate(20)
                         ->appends($request->query());

        $stats = [
            'total_payments' => StudentPayment::count(),
            'pending_payments' => StudentPayment::pending()->count(),
            'overdue_payments' => StudentPayment::overdue()->count(),
            'total_amount_pending' => StudentPayment::pending()->sum('remaining_amount'),
        ];

        $feeTypes = FeeType::active()->get();
        $grades = Grade::all();

        return Inertia::render('Teacher/Payments/Index', [
            'payments' => $payments,
            'stats' => $stats,
            'feeTypes' => $feeTypes,
            'grades' => $grades,
            'filters' => $request->only(['status', 'fee_type', 'grade', 'search'])
        ]);
    }

    public function show(StudentPayment $studentPayment)
    {
        $studentPayment->load(['student.grade', 'feeType', 'installments.recordedBy']);
        
        return Inertia::render('Teacher/Payments/Show', [
            'payment' => $studentPayment
        ]);
    }

    public function recordPayment(Request $request, StudentPayment $studentPayment)
    {
        $validated = $request->validate([
            'installment_id' => 'required|exists:payment_installments,id',
            'payment_method' => 'required|string|max:255',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'amount' => 'required|numeric|min:0'
        ]);

        $installment = PaymentInstallment::findOrFail($validated['installment_id']);
        
        // Verify the installment belongs to this payment
        if ($installment->student_payment_id !== $studentPayment->id) {
            return back()->withErrors(['installment_id' => 'Invalid installment.']);
        }

        // Verify amount matches installment amount
        if ($validated['amount'] != $installment->amount) {
            return back()->withErrors(['amount' => 'Amount must match installment amount.']);
        }

        $installment->markAsPaid(
            $validated['payment_method'],
            $validated['reference_number'],
            Auth::id(),
            $validated['notes']
        );

        return back()->with('success', 'Payment recorded successfully.');
    }

    public function generatePayments()
    {
        return Inertia::render('Teacher/Payments/Generate', [
            'feeTypes' => FeeType::active()->get(),
            'grades' => Grade::with('students')->get()
        ]);
    }

    public function storeGeneratedPayments(Request $request)
    {
        $validated = $request->validate([
            'fee_type_id' => 'required|exists:fee_types,id',
            'academic_year' => 'required|string|max:9',
            'semester' => 'nullable|in:1,2',
            'month' => 'nullable|integer|min:1|max:12',
            'due_date' => 'required|date',
            'grade_ids' => 'required|array',
            'grade_ids.*' => 'exists:grades,id',
            'installments' => 'required|integer|min:1|max:12'
        ]);

        $feeType = FeeType::findOrFail($validated['fee_type_id']);
        
        // Get students from selected grades
        $students = User::whereIn('role', ['student'])
                       ->whereHas('grade', function($q) use ($validated) {
                           $q->whereIn('id', $validated['grade_ids']);
                       })
                       ->get();

        $generatedCount = 0;

        foreach ($students as $student) {
            // Check if payment already exists
            $existingPayment = StudentPayment::where('student_id', $student->id)
                ->where('fee_type_id', $feeType->id)
                ->where('academic_year', $validated['academic_year'])
                ->where('semester', $validated['semester'])
                ->where('month', $validated['month'])
                ->first();

            if ($existingPayment) {
                continue; // Skip if already exists
            }

            // Create payment
            $payment = StudentPayment::create([
                'student_id' => $student->id,
                'fee_type_id' => $feeType->id,
                'total_amount' => $feeType->amount,
                'remaining_amount' => $feeType->amount,
                'due_date' => $validated['due_date'],
                'academic_year' => $validated['academic_year'],
                'semester' => $validated['semester'],
                'month' => $validated['month']
            ]);

            // Create installments
            $installmentAmount = $feeType->amount / $validated['installments'];
            $dueDate = Carbon::parse($validated['due_date']);

            for ($i = 1; $i <= $validated['installments']; $i++) {
                PaymentInstallment::create([
                    'student_payment_id' => $payment->id,
                    'installment_number' => $i,
                    'amount' => $installmentAmount,
                    'due_date' => $dueDate->copy()->addMonths($i - 1)
                ]);
            }

            $generatedCount++;
        }

        return redirect()->route('teacher.payments.index')
                        ->with('success', "Generated payments for {$generatedCount} students.");
    }

    public function reports()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $monthlyStats = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthlyStats[] = [
                'month' => $month,
                'month_name' => Carbon::create()->month($month)->format('F'),
                'total_amount' => StudentPayment::whereMonth('due_date', $month)
                    ->whereYear('due_date', $currentYear)
                    ->sum('total_amount'),
                'paid_amount' => StudentPayment::whereMonth('due_date', $month)
                    ->whereYear('due_date', $currentYear)
                    ->sum('paid_amount'),
                'pending_count' => StudentPayment::whereMonth('due_date', $month)
                    ->whereYear('due_date', $currentYear)
                    ->pending()
                    ->count()
            ];
        }

        $feeTypeStats = FeeType::withCount(['studentPayments'])
            ->with(['studentPayments' => function($q) {
                $q->selectRaw('fee_type_id, SUM(total_amount) as total, SUM(paid_amount) as paid')
                  ->groupBy('fee_type_id');
            }])
            ->get()
            ->map(function($feeType) {
                return [
                    'name' => $feeType->name,
                    'total_payments' => $feeType->student_payments_count,
                    'total_amount' => $feeType->studentPayments->sum('total'),
                    'paid_amount' => $feeType->studentPayments->sum('paid'),
                    'collection_rate' => $feeType->studentPayments->sum('total') > 0 
                        ? round(($feeType->studentPayments->sum('paid') / $feeType->studentPayments->sum('total')) * 100, 2)
                        : 0
                ];
            });

        return Inertia::render('Teacher/Payments/Reports', [
            'monthlyStats' => $monthlyStats,
            'feeTypeStats' => $feeTypeStats,
            'currentMonth' => $currentMonth,
            'currentYear' => $currentYear
        ]);
    }
}
