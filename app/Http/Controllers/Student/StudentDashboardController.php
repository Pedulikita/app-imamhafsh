<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\Exam;
// use App\Models\Assignment; // Commented out until implemented
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class StudentDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:student']);
    }

    public function dashboard(): Response
    {
        $user = auth()->user();
        $student = $user->student; // Assuming User model has student relationship

        if (!$student) {
            // If user doesn't have a student profile, show basic dashboard
            return $this->basicDashboard($user);
        }

        // Get student statistics
        $stats = [
            'total_assignments' => 0, // Assignment::where('student_id', $student->id)->count(),
            'completed_assignments' => 0, // Assignment::where('student_id', $student->id)->whereNotNull('submitted_at')->count(),
            'attendance_rate' => $this->calculateAttendanceRate($student->id),
            'current_grades' => Grade::where('student_id', $student->id)
                ->whereNotNull('score')->count(),
            'upcoming_exams' => Exam::whereDate('start_time', '>=', today())
                ->whereDate('start_time', '<=', today()->addWeek())
                ->count(),
        ];

        // Get recent assignments (placeholder)
        $recent_assignments = []; // Will implement when Assignment model is ready

        // Get upcoming exams
        $upcoming_exams = Exam::whereDate('start_time', '>=', today())
            ->whereDate('start_time', '<=', today()->addWeek())
            ->orderBy('start_time', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'subject' => $exam->subject ?? 'Unknown',
                    'date' => $exam->start_time ? $exam->start_time->format('Y-m-d') : null,
                    'time' => $exam->start_time ? $exam->start_time->format('H:i') : null,
                    'duration' => $exam->duration_minutes,
                ];
            });

        return Inertia::render('Student/Dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student' => [
                    'id' => $student->id,
                    'student_id' => $student->student_id,
                    'class' => $student->class,
                    'academic_year' => $student->academic_year,
                ],
            ],
            'stats' => $stats,
            'recent_assignments' => $recent_assignments,
            'upcoming_exams' => $upcoming_exams,
        ]);
    }

    private function basicDashboard($user): Response
    {
        // Basic dashboard for users without student profile
        $stats = [
            'total_assignments' => 0,
            'completed_assignments' => 0,
            'attendance_rate' => 0,
            'current_grades' => 0,
            'upcoming_exams' => 0,
        ];

        return Inertia::render('Student/Dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student' => null,
            ],
            'stats' => $stats,
            'recent_assignments' => [],
            'upcoming_exams' => [],
        ]);
    }

    private function calculateAttendanceRate($studentId): float
    {
        $totalSessions = Attendance::where('student_id', $studentId)
            ->whereMonth('date', Carbon::now()->month)
            ->count();

        if ($totalSessions === 0) {
            return 0;
        }

        $presentSessions = Attendance::where('student_id', $studentId)
            ->where('status', 'present')
            ->whereMonth('date', Carbon::now()->month)
            ->count();

        return round(($presentSessions / $totalSessions) * 100, 1);
    }

    private function getAssignmentStatus($assignment): string
    {
        if ($assignment->grade !== null) {
            return 'graded';
        }
        
        if ($assignment->submitted_at !== null) {
            return 'submitted';
        }
        
        return 'pending';
    }
}
