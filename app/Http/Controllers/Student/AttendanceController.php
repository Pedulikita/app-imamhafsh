<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentClass;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function recording(): Response
    {
        $today = Carbon::today();
        
        // Get all students with their classes
        $students = Student::with('class')
            ->active()
            ->orderBy('name')
            ->get();

        // Get today's attendance records
        $attendance_records = Attendance::with(['student', 'subject'])
            ->whereDate('date', $today)
            ->orderBy('created_at', 'desc')
            ->get();

        // Get all classes for filter
        $classes = StudentClass::active()->orderBy('name')->get();

        // Calculate stats for today
        $total_students = $students->count();
        $present_today = $attendance_records->where('status', 'present')->count();
        $late_today = $attendance_records->where('status', 'late')->count();
        $absent_today = $attendance_records->where('status', 'absent')->count();
        $attendance_rate = $total_students > 0 ? round(($present_today + $late_today) / $total_students * 100, 1) : 0;

        $stats = [
            'total_students' => $total_students,
            'present_today' => $present_today,
            'absent_today' => $absent_today,
            'late_today' => $late_today,
            'attendance_rate' => $attendance_rate,
        ];

        return Inertia::render('Monitoring/Students/AttendanceRecording', [
            'students' => $students,
            'attendance_records' => $attendance_records,
            'stats' => $stats,
            'selected_date' => $today->toDateString(),
            'classes' => $classes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*' => 'in:present,late,sick,permission,absent',
        ]);

        $date = Carbon::parse($request->date);

        foreach ($request->attendances as $student_id => $status) {
            // Check if attendance already exists for this student and date
            $attendance = Attendance::where('student_id', $student_id)
                ->whereDate('date', $date)
                ->first();

            if ($attendance) {
                // Update existing attendance
                $attendance->update([
                    'status' => $status,
                    'time_in' => $status === 'present' ? now()->format('H:i:s') : null,
                ]);
            } else {
                // Create new attendance record
                Attendance::create([
                    'student_id' => $student_id,
                    'date' => $date,
                    'status' => $status,
                    'time_in' => $status === 'present' ? now()->format('H:i:s') : null,
                    'subject_id' => null, // For daily attendance, no specific subject
                ]);
            }
        }

        return Redirect::route('monitoring.attendance.recording')
                      ->with('success', 'Kehadiran berhasil disimpan untuk tanggal ' . $date->format('d/m/Y'));
    }

    public function reports(): Response
    {
        // Method untuk laporan kehadiran
        $currentMonth = Carbon::now();
        
        $reports = [
            'daily' => $this->getDailyReport($currentMonth),
            'weekly' => $this->getWeeklyReport($currentMonth),
            'monthly' => $this->getMonthlyReport($currentMonth),
        ];

        return Inertia::render('Monitoring/Students/AttendanceReports', [
            'reports' => $reports,
        ]);
    }

    private function getDailyReport($date)
    {
        return Attendance::with('student')
            ->whereDate('date', $date)
            ->get()
            ->groupBy('status')
            ->map(function ($group) {
                return $group->count();
            });
    }

    private function getWeeklyReport($date)
    {
        $startOfWeek = $date->copy()->startOfWeek();
        $endOfWeek = $date->copy()->endOfWeek();

        return Attendance::with('student')
            ->whereBetween('date', [$startOfWeek, $endOfWeek])
            ->get()
            ->groupBy(function($attendance) {
                return $attendance->date->format('Y-m-d');
            })
            ->map(function ($dayAttendances) {
                return $dayAttendances->groupBy('status')
                    ->map(function ($statusGroup) {
                        return $statusGroup->count();
                    });
            });
    }

    private function getMonthlyReport($date)
    {
        $startOfMonth = $date->copy()->startOfMonth();
        $endOfMonth = $date->copy()->endOfMonth();

        return Attendance::with('student')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get()
            ->groupBy('student_id')
            ->map(function ($studentAttendances) {
                $total = $studentAttendances->count();
                $present = $studentAttendances->where('status', 'present')->count();
                $late = $studentAttendances->where('status', 'late')->count();
                
                return [
                    'total' => $total,
                    'present' => $present,
                    'late' => $late,
                    'absent' => $total - $present - $late,
                    'attendance_rate' => $total > 0 ? round(($present + $late) / $total * 100, 1) : 0,
                ];
            });
    }
}