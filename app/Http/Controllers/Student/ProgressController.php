<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ProgressController extends Controller
{
    public function dashboard(): Response
    {
        $currentYear = Carbon::now()->year;
        $stats = [
            'total_students' => Student::active()->count(),
            'total_subjects' => Subject::active()->count(),
            'attendance_today' => Attendance::whereDate('date', today())->where('status', 'present')->count(),
            'grades_this_month' => Grade::whereMonth('created_at', Carbon::now()->month)->count(),
        ];

        return Inertia::render('Monitoring/Dashboard', [
            'stats' => $stats,
        ]);
    }

    public function studentProgress(Student $student, Request $request): Response
    {
        $academicYear = $request->academic_year ?? Carbon::now()->year;
        $semester = $request->semester ?? 'ganjil';

        $grades = $student->grades()
            ->with('subject')
            ->byAcademicYear($academicYear)
            ->bySemester($semester)
            ->get()
            ->groupBy('subject.name');

        $attendances = $student->attendances()
            ->with('subject')
            ->whereYear('date', $academicYear)
            ->get()
            ->groupBy('subject.name');

        // Calculate statistics
        $stats = [
            'total_grades' => $student->grades()->count(),
            'average_grade' => $student->grades()->avg('score') ?? 0,
            'attendance_rate' => $student->attendances()->where('status', 'present')->count() / max($student->attendances()->count(), 1) * 100,
            'subjects_count' => $grades->count(),
        ];

        return Inertia::render('Monitoring/Students/Progress', [
            'student' => $student,
            'grades' => $grades,
            'attendances' => $attendances,
            'stats' => $stats,
            'filters' => [
                'academic_year' => $academicYear,
                'semester' => $semester,
            ],
        ]);
    }

    public function progressOverview(): Response
    {
        $currentYear = Carbon::now()->year;
        
        // Get all active students with their progress data
        $students = Student::active()
            ->with(['grades', 'attendances'])
            ->get()
            ->map(function ($student) use ($currentYear) {
                $totalGrades = $student->grades->count();
                $averageGrade = $totalGrades > 0 ? $student->grades->avg('score') : 0;
                
                $totalAttendances = $student->attendances->count();
                $presentCount = $student->attendances->where('status', 'present')->count();
                $attendanceRate = $totalAttendances > 0 ? ($presentCount / $totalAttendances) * 100 : 0;
                
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'student_id' => $student->student_id,
                    'class' => $student->class,
                    'academic_year' => $student->academic_year,
                    'average_grade' => round($averageGrade, 1),
                    'attendance_rate' => round($attendanceRate, 1),
                    'total_grades' => $totalGrades,
                    'status' => $this->getProgressStatus($averageGrade, $attendanceRate),
                ];
            });

        // Overall statistics
        $stats = [
            'total_students' => $students->count(),
            'excellent_performance' => $students->filter(function ($student) {
                return $student['average_grade'] >= 85 && $student['attendance_rate'] >= 90;
            })->count(),
            'needs_attention' => $students->filter(function ($student) {
                return $student['average_grade'] < 70 || $student['attendance_rate'] < 80;
            })->count(),
            'overall_average_grade' => round($students->avg('average_grade'), 1),
            'overall_attendance_rate' => round($students->avg('attendance_rate'), 1),
        ];

        return Inertia::render('Monitoring/ProgressOverview', [
            'students' => $students,
            'stats' => $stats,
        ]);
    }

    private function getProgressStatus($averageGrade, $attendanceRate): string
    {
        if ($averageGrade >= 85 && $attendanceRate >= 90) {
            return 'excellent';
        } elseif ($averageGrade >= 75 && $attendanceRate >= 85) {
            return 'good';
        } elseif ($averageGrade >= 65 && $attendanceRate >= 75) {
            return 'satisfactory';
        } else {
            return 'needs_attention';
        }
    }
}
