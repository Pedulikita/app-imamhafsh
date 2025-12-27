<?php

namespace App\Http\Controllers;

use App\Models\ParentProfile;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Schedule;
use App\Models\ParentNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ParentDashboardController extends Controller
{
    public function dashboard()
    {
        $parent = auth()->user()->parentProfile;
        
        if (!$parent) {
            return redirect()->route('parent.profile.create');
        }

        $students = $parent->students;
        $dashboardData = [];

        foreach ($students as $student) {
            $dashboardData[] = [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'class' => $student->current_class,
                    'photo' => $student->photo,
                ],
                'attendance' => $this->getAttendanceSummary($student),
                'grades' => $this->getGradesSummary($student),
                'recent_exams' => $this->getRecentExams($student),
                'upcoming_schedule' => $this->getUpcomingSchedule($student),
            ];
        }

        return Inertia::render('parent/dashboard', [
            'students' => $dashboardData,
            'notifications' => $parent->notifications()
                ->where('is_read', false)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'unread_count' => $parent->getUnreadNotificationsCount(),
            'recent_communications' => $parent->getRecentCommunications(3),
        ]);
    }

    public function studentDetail(Student $student)
    {
        $parent = auth()->user()->parentProfile;
        
        // Verify parent has access to this student
        if (!$parent->students->contains($student->id)) {
            abort(403, 'Unauthorized access to student data.');
        }

        return Inertia::render('parent/student-detail', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'nis' => $student->nis,
                'nisn' => $student->nisn,
                'class' => $student->current_class,
                'photo' => $student->photo,
                'birth_date' => $student->birth_date,
                'address' => $student->address,
            ],
            'attendance_monthly' => $this->getMonthlyAttendance($student),
            'grades_by_subject' => $this->getGradesBySubject($student),
            'exam_history' => $this->getExamHistory($student),
            'weekly_schedule' => $this->getWeeklySchedule($student),
            'behavior_reports' => $this->getBehaviorReports($student),
        ]);
    }

    public function attendanceDetail(Student $student)
    {
        $parent = auth()->user()->parentProfile;
        
        if (!$parent->students->contains($student->id)) {
            abort(403);
        }

        $attendanceData = Attendance::where('student_id', $student->id)
            ->with(['teacherClass.subject'])
            ->orderBy('attendance_date', 'desc')
            ->paginate(50);

        return Inertia::render('parent/attendance-detail', [
            'student' => $student->only(['id', 'name', 'class']),
            'attendance' => $attendanceData,
            'summary' => [
                'total_days' => $attendanceData->total(),
                'present_days' => $attendanceData->where('status', 'present')->count(),
                'absent_days' => $attendanceData->where('status', 'absent')->count(),
                'late_days' => $attendanceData->where('status', 'late')->count(),
                'percentage' => $this->calculateAttendancePercentage($student),
            ]
        ]);
    }

    public function gradesDetail(Student $student)
    {
        $parent = auth()->user()->parentProfile;
        
        if (!$parent->students->contains($student->id)) {
            abort(403);
        }

        $grades = Grade::where('student_id', $student->id)
            ->with(['teacherClass.subject'])
            ->orderBy('assessment_date', 'desc')
            ->paginate(20);

        return Inertia::render('parent/grades-detail', [
            'student' => $student->only(['id', 'name', 'class']),
            'grades' => $grades,
            'grade_summary' => $this->getGradeSummaryBySubject($student),
        ]);
    }

    public function examResults(Student $student)
    {
        $parent = auth()->user()->parentProfile;
        
        if (!$parent->students->contains($student->id)) {
            abort(403);
        }

        $examAttempts = ExamAttempt::where('student_id', $student->id)
            ->with(['exam.subject', 'exam.teacherClass'])
            ->where('status', 'graded')
            ->orderBy('submitted_at', 'desc')
            ->paginate(20);

        return Inertia::render('parent/exam-results', [
            'student' => $student->only(['id', 'name', 'class']),
            'exam_attempts' => $examAttempts,
        ]);
    }

    public function schedule(Student $student)
    {
        $parent = auth()->user()->parentProfile;
        
        if (!$parent->students->contains($student->id)) {
            abort(403);
        }

        $schedule = $this->getWeeklySchedule($student, true);

        return Inertia::render('parent/schedule', [
            'student' => $student->only(['id', 'name', 'class']),
            'schedule' => $schedule,
        ]);
    }

    public function communications()
    {
        $parent = auth()->user()->parentProfile;
        
        $communications = $parent->communications()
            ->with(['teacher', 'student'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('parent/communications', [
            'communications' => $communications,
        ]);
    }

    public function notifications()
    {
        $parent = auth()->user()->parentProfile;
        
        $notifications = $parent->notifications()
            ->with('student')
            ->orderBy('created_at', 'desc')
            ->paginate(30);

        return Inertia::render('parent/notifications', [
            'notifications' => $notifications,
        ]);
    }

    // Helper methods
    private function getAttendanceSummary(Student $student): array
    {
        $last30Days = Carbon::now()->subDays(30);
        
        $attendance = Attendance::where('student_id', $student->id)
            ->where('attendance_date', '>=', $last30Days)
            ->get();

        $total = $attendance->count();
        $present = $attendance->where('status', 'present')->count();
        $absent = $attendance->where('status', 'absent')->count();
        $late = $attendance->where('status', 'late')->count();

        return [
            'total' => $total,
            'present' => $present,
            'absent' => $absent,
            'late' => $late,
            'percentage' => $total > 0 ? round(($present / $total) * 100, 1) : 0,
        ];
    }

    private function getGradesSummary(Student $student): array
    {
        $recentGrades = Grade::where('student_id', $student->id)
            ->orderBy('assessment_date', 'desc')
            ->limit(5)
            ->get();

        return [
            'recent' => $recentGrades->map(function($grade) {
                return [
                    'subject' => $grade->subject,
                    'score' => $grade->score,
                    'assessment_type' => $grade->assessment_type,
                    'date' => $grade->assessment_date->format('d/m/Y'),
                ];
            }),
            'average' => $recentGrades->avg('score') ?? 0,
        ];
    }

    private function getRecentExams(Student $student): \Illuminate\Database\Eloquent\Collection
    {
        return ExamAttempt::where('student_id', $student->id)
            ->with('exam')
            ->whereIn('status', ['graded', 'submitted'])
            ->orderBy('submitted_at', 'desc')
            ->limit(3)
            ->get();
    }

    private function getUpcomingSchedule(Student $student): array
    {
        // This would need to be implemented based on student's class schedules
        // For now, returning empty array
        return [];
    }

    private function getMonthlyAttendance(Student $student): array
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $attendance = Attendance::where('student_id', $student->id)
                ->whereYear('attendance_date', $date->year)
                ->whereMonth('attendance_date', $date->month)
                ->get();

            $months[] = [
                'month' => $date->format('M Y'),
                'total' => $attendance->count(),
                'present' => $attendance->where('status', 'present')->count(),
                'absent' => $attendance->where('status', 'absent')->count(),
                'late' => $attendance->where('status', 'late')->count(),
            ];
        }

        return $months;
    }

    private function getGradesBySubject(Student $student): array
    {
        return Grade::where('student_id', $student->id)
            ->selectRaw('subject, AVG(score) as average, COUNT(*) as count')
            ->groupBy('subject')
            ->get()
            ->toArray();
    }

    private function getExamHistory(Student $student): \Illuminate\Database\Eloquent\Collection
    {
        return ExamAttempt::where('student_id', $student->id)
            ->with(['exam'])
            ->where('status', 'graded')
            ->orderBy('submitted_at', 'desc')
            ->limit(10)
            ->get();
    }

    private function getWeeklySchedule(Student $student, bool $detailed = false): array
    {
        // Implementation depends on how student schedules are structured
        // This is a placeholder
        return [];
    }

    private function getBehaviorReports(Student $student): array
    {
        // Placeholder for behavior reports
        return [];
    }

    private function calculateAttendancePercentage(Student $student): float
    {
        $total = Attendance::where('student_id', $student->id)->count();
        $present = Attendance::where('student_id', $student->id)
            ->where('status', 'present')
            ->count();

        return $total > 0 ? round(($present / $total) * 100, 1) : 0;
    }

    private function getGradeSummaryBySubject(Student $student): array
    {
        return Grade::where('student_id', $student->id)
            ->selectRaw('subject, AVG(score) as average, MIN(score) as minimum, MAX(score) as maximum, COUNT(*) as count')
            ->groupBy('subject')
            ->get()
            ->toArray();
    }
}