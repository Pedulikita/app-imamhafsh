<?php

namespace App\Http\Controllers;

use App\Models\BehaviorReport;
use App\Models\BehaviorCategory;
use App\Models\BehaviorReportAction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class BehaviorReportController extends Controller
{
    /**
     * Display behavior reports dashboard
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = BehaviorReport::with(['student', 'teacher', 'behaviorCategory', 'reviewer']);

        // Filter by user role
        if ($user->hasRole('teacher')) {
            $query->byTeacher($user->id);
        } elseif ($user->hasRole('parent')) {
            // Get parent's children
            $childrenIds = $user->parentProfile?->children->pluck('id') ?? [];
            $query->whereIn('student_id', $childrenIds);
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->withStatus($request->status);
        }
        
        if ($request->filled('type')) {
            $query->ofType($request->type);
        }
        
        if ($request->filled('severity')) {
            $query->bySeverity($request->severity);
        }
        
        if ($request->filled('student_id')) {
            $query->forStudent($request->student_id);
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->inDateRange($request->date_from, $request->date_to);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('student', function($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $reports = $query->orderBy('incident_date', 'desc')
                        ->orderBy('created_at', 'desc')
                        ->paginate(15);

        // Get statistics
        $stats = $this->getReportsStatistics($user);
        
        // Get filter options
        $categories = BehaviorCategory::active()->ordered()->get();
        $students = $this->getAccessibleStudents($user);

        return Inertia::render('Teacher/BehaviorReports/Index', [
            'behavior_reports' => $reports,
            'behavior_categories' => $categories,
            'students' => $students,
            'stats' => $stats,
            'filters' => $request->only(['status', 'type', 'severity', 'student_id', 'date_from', 'date_to', 'search']),
        ]);
    }

    /**
     * Show form for creating new behavior report
     */
    public function create(Request $request)
    {
        $user = Auth::user();
        
        // Only teachers can create behavior reports
        if (!$user->hasRole('teacher')) {
            abort(403, 'Only teachers can create behavior reports');
        }

        $categories = BehaviorCategory::active()->ordered()->get();
        $students = $this->getAccessibleStudents($user);
        
        // Pre-fill student if provided
        $selectedStudent = $request->filled('student_id') 
            ? User::find($request->student_id) 
            : null;

        return Inertia::render('Teacher/BehaviorReports/Create', [
            'categories' => $categories,
            'students' => $students,
            'selectedStudent' => $selectedStudent,
        ]);
    }

    /**
     * Store new behavior report
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->hasRole('teacher')) {
            abort(403, 'Only teachers can create behavior reports');
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'behavior_category_id' => 'required|exists:behavior_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'severity' => 'required|in:low,medium,high,critical',
            'type' => 'required|in:positive,negative,neutral',
            'incident_date' => 'required|date',
            'incident_time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'witnesses' => 'nullable|array',
            'context' => 'nullable|string',
            'immediate_action' => 'nullable|string',
            'follow_up_required' => 'nullable|string',
            'points' => 'nullable|integer',
            'status' => 'in:draft,submitted',
        ]);

        DB::beginTransaction();
        try {
            // Create behavior report
            $report = BehaviorReport::create([
                ...$validated,
                'teacher_id' => $user->id,
            ]);

            // Log the creation action
            BehaviorReportAction::create([
                'behavior_report_id' => $report->id,
                'user_id' => $user->id,
                'action_type' => 'created',
                'action_description' => 'Laporan perilaku dibuat',
            ]);

            // If submitted, log that too
            if ($validated['status'] === 'submitted') {
                BehaviorReportAction::create([
                    'behavior_report_id' => $report->id,
                    'user_id' => $user->id,
                    'action_type' => 'submitted',
                    'action_description' => 'Laporan perilaku diajukan untuk ditinjau',
                ]);
            }

            DB::commit();

            return redirect()->route('behavior-reports.show', $report)
                           ->with('success', 'Laporan perilaku berhasil dibuat.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Gagal membuat laporan perilaku.']);
        }
    }

    /**
     * Show specific behavior report
     */
    public function show(BehaviorReport $behaviorReport)
    {
        $user = Auth::user();
        
        // Check access permissions
        if (!$this->canAccessReport($user, $behaviorReport)) {
            abort(403, 'You do not have permission to view this report');
        }

        $behaviorReport->load([
            'student', 
            'teacher', 
            'behaviorCategory', 
            'reviewer',
            'actions' => function($query) {
                $query->with('user')->orderBy('created_at', 'desc');
            }
        ]);

        return Inertia::render('Teacher/BehaviorReports/Show', [
            'report' => $behaviorReport,
            'canEdit' => $this->canEditReport($user, $behaviorReport),
            'canReview' => $this->canReviewReport($user, $behaviorReport),
        ]);
    }

    /**
     * Show form for editing behavior report
     */
    public function edit(BehaviorReport $behaviorReport)
    {
        $user = Auth::user();
        
        if (!$this->canEditReport($user, $behaviorReport)) {
            abort(403, 'You cannot edit this behavior report');
        }

        $behaviorReport->load(['student', 'behaviorCategory']);
        $categories = BehaviorCategory::active()->ordered()->get();
        $students = $this->getAccessibleStudents($user);

        return Inertia::render('Teacher/BehaviorReports/Edit', [
            'report' => $behaviorReport,
            'categories' => $categories,
            'students' => $students,
        ]);
    }

    /**
     * Update behavior report
     */
    public function update(Request $request, BehaviorReport $behaviorReport)
    {
        $user = Auth::user();
        
        if (!$this->canEditReport($user, $behaviorReport)) {
            abort(403, 'You cannot edit this behavior report');
        }

        $validated = $request->validate([
            'behavior_category_id' => 'required|exists:behavior_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'severity' => 'required|in:low,medium,high,critical',
            'type' => 'required|in:positive,negative,neutral',
            'incident_date' => 'required|date',
            'incident_time' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'witnesses' => 'nullable|array',
            'context' => 'nullable|string',
            'immediate_action' => 'nullable|string',
            'follow_up_required' => 'nullable|string',
            'points' => 'nullable|integer',
            'status' => 'in:draft,submitted',
            'student_response' => 'nullable|string',
            'parent_response' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $oldValues = $behaviorReport->toArray();
            $behaviorReport->update($validated);

            // Log the update action
            BehaviorReportAction::create([
                'behavior_report_id' => $behaviorReport->id,
                'user_id' => $user->id,
                'action_type' => 'updated',
                'action_description' => 'Laporan perilaku diperbarui',
                'old_values' => $oldValues,
                'new_values' => $validated,
            ]);

            DB::commit();

            return redirect()->route('behavior-reports.show', $behaviorReport)
                           ->with('success', 'Laporan perilaku berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Gagal memperbarui laporan perilaku.']);
        }
    }

    /**
     * Update report status
     */
    public function updateStatus(Request $request, BehaviorReport $behaviorReport)
    {
        $request->validate([
            'status' => 'required|string|in:pending,reviewed,resolved'
        ]);

        $user = Auth::user();
        $oldStatus = $behaviorReport->status;
        
        DB::beginTransaction();
        try {
            $behaviorReport->update([
                'status' => $request->status,
                'reviewed_at' => $request->status === 'reviewed' ? now() : $behaviorReport->reviewed_at,
                'reviewed_by' => $request->status === 'reviewed' ? $user->id : $behaviorReport->reviewed_by,
            ]);

            // Log the status change
            BehaviorReportAction::create([
                'behavior_report_id' => $behaviorReport->id,
                'user_id' => $user->id,
                'action_type' => 'status_updated',
                'action_description' => "Status changed from {$oldStatus} to {$request->status}",
                'old_values' => ['status' => $oldStatus],
                'new_values' => ['status' => $request->status],
            ]);

            DB::commit();

            return back()->with('success', 'Status laporan berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Gagal memperbarui status laporan.']);
        }
    }

    /**
     * Submit report for review
     */
    public function submit(BehaviorReport $behaviorReport)
    {
        $user = Auth::user();
        
        if ($behaviorReport->teacher_id !== $user->id || $behaviorReport->status !== 'draft') {
            abort(403, 'Cannot submit this report');
        }

        DB::beginTransaction();
        try {
            $behaviorReport->update(['status' => 'submitted']);

            BehaviorReportAction::create([
                'behavior_report_id' => $behaviorReport->id,
                'user_id' => $user->id,
                'action_type' => 'submitted',
                'action_description' => 'Laporan perilaku diajukan untuk ditinjau',
            ]);

            DB::commit();

            return back()->with('success', 'Laporan berhasil diajukan untuk ditinjau.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Gagal mengajukan laporan.']);
        }
    }

    /**
     * Review report (admin/supervisor only)
     */
    public function review(Request $request, BehaviorReport $behaviorReport)
    {
        $user = Auth::user();
        
        if (!$this->canReviewReport($user, $behaviorReport)) {
            abort(403, 'You cannot review this report');
        }

        $validated = $request->validate([
            'review_notes' => 'required|string',
            'status' => 'required|in:reviewed,closed',
        ]);

        DB::beginTransaction();
        try {
            $behaviorReport->update([
                ...$validated,
                'reviewed_by' => $user->id,
                'reviewed_at' => now(),
            ]);

            BehaviorReportAction::create([
                'behavior_report_id' => $behaviorReport->id,
                'user_id' => $user->id,
                'action_type' => 'reviewed',
                'action_description' => 'Laporan perilaku ditinjau',
                'notes' => $validated['review_notes'],
            ]);

            DB::commit();

            return back()->with('success', 'Laporan berhasil ditinjau.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Gagal meninjau laporan.']);
        }
    }

    /**
     * Generate behavior reports analytics
     */
    public function analytics(Request $request)
    {
        $user = Auth::user();
        $startDate = $request->get('start_date', now()->subDays(30));
        $endDate = $request->get('end_date', now());

        $query = BehaviorReport::query();
        
        // Filter by user role
        if ($user->hasRole('teacher')) {
            $query->byTeacher($user->id);
        } elseif ($user->hasRole('parent')) {
            $childrenIds = $user->parentProfile?->children->pluck('id') ?? [];
            $query->whereIn('student_id', $childrenIds);
        }

        $analytics = [
            'total_reports' => $query->clone()->inDateRange($startDate, $endDate)->count(),
            'by_type' => $query->clone()->inDateRange($startDate, $endDate)
                              ->select('type', DB::raw('count(*) as count'))
                              ->groupBy('type')
                              ->pluck('count', 'type'),
            'by_severity' => $query->clone()->inDateRange($startDate, $endDate)
                                  ->select('severity', DB::raw('count(*) as count'))
                                  ->groupBy('severity')
                                  ->pluck('count', 'severity'),
            'by_category' => $query->clone()->inDateRange($startDate, $endDate)
                                  ->with('behaviorCategory')
                                  ->get()
                                  ->groupBy('behaviorCategory.display_name')
                                  ->map->count(),
            'by_month' => $query->clone()->inDateRange($startDate, $endDate)
                               ->select(DB::raw('YEAR(incident_date) as year'), 
                                       DB::raw('MONTH(incident_date) as month'), 
                                       DB::raw('count(*) as count'))
                               ->groupBy('year', 'month')
                               ->orderBy('year')
                               ->orderBy('month')
                               ->get(),
            'top_students' => $query->clone()->inDateRange($startDate, $endDate)
                                   ->with('student')
                                   ->get()
                                   ->groupBy('student.name')
                                   ->map->count()
                                   ->sortDesc()
                                   ->take(10),
        ];

        return Inertia::render('Teacher/BehaviorReports/Analytics', [
            'analytics' => $analytics,
            'dateRange' => [$startDate, $endDate],
        ]);
    }

    /**
     * Get behavior reports statistics
     */
    private function getReportsStatistics($user)
    {
        $query = BehaviorReport::query();
        
        // Filter by user role
        if ($user->hasRole('teacher')) {
            $query->byTeacher($user->id);
        } elseif ($user->hasRole('parent')) {
            $childrenIds = $user->parentProfile?->children->pluck('id') ?? [];
            $query->whereIn('student_id', $childrenIds);
        }

        return [
            'total_reports' => $query->clone()->count(),
            'pending_review' => $query->clone()->withStatus('submitted')->count(),
            'positive_reports' => $query->clone()->ofType('positive')->count(),
            'negative_reports' => $query->clone()->ofType('negative')->count(),
            'critical_reports' => $query->clone()->bySeverity('critical')->count(),
            'this_week' => $query->clone()->where('created_at', '>=', now()->startOfWeek())->count(),
            'this_month' => $query->clone()->where('created_at', '>=', now()->startOfMonth())->count(),
        ];
    }

    /**
     * Get students accessible by current user
     */
    private function getAccessibleStudents($user)
    {
        if ($user->hasRole('teacher')) {
            // Teachers can access all students or their assigned students
            return User::whereHas('roles', function($q) {
                $q->where('name', 'student');
            })->select('id', 'name', 'email')->get();
        } elseif ($user->hasRole('parent')) {
            // Parents can only access their children
            return $user->parentProfile?->children ?? collect();
        } else {
            // Admins can access all students
            return User::whereHas('roles', function($q) {
                $q->where('name', 'student');
            })->select('id', 'name', 'email')->get();
        }
    }

    /**
     * Check if user can access the report
     */
    private function canAccessReport($user, $report)
    {
        if ($user->hasRole('admin') || $user->hasRole('supervisor')) {
            return true;
        }
        
        if ($user->hasRole('teacher') && $report->teacher_id === $user->id) {
            return true;
        }
        
        if ($user->hasRole('parent')) {
            $childrenIds = $user->parentProfile?->children->pluck('id') ?? [];
            return in_array($report->student_id, $childrenIds->toArray());
        }
        
        return false;
    }

    /**
     * Check if user can edit the report
     */
    private function canEditReport($user, $report)
    {
        if ($user->hasRole('admin')) {
            return true;
        }
        
        if ($user->hasRole('teacher') && $report->teacher_id === $user->id && in_array($report->status, ['draft', 'submitted'])) {
            return true;
        }
        
        return false;
    }

    /**
     * Check if user can review the report
     */
    private function canReviewReport($user, $report)
    {
        if ($user->hasRole('admin') || $user->hasRole('supervisor')) {
            return $report->status === 'submitted';
        }
        
        return false;
    }
}
