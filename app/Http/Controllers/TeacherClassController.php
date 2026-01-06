<?php

namespace App\Http\Controllers;

use App\Models\TeacherClass;
use App\Models\Student;
use App\Models\Grade;
use App\Models\GradeLevel;
use App\Models\Subject;
use App\Models\Attendance;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TeacherClassController extends Controller
{
    // Middleware will be applied in routes/web.php instead of constructor
    // This is the Laravel 11 recommended approach

    public function dashboard()
    {
        \Log::info('Teacher dashboard accessed', ['user_id' => auth()->id()]);
        
        try {
            $user = Auth::user();
            \Log::info('User loaded', ['user_id' => $user->id, 'roles' => $user->roles->pluck('name')]);
            
            // Get teacher's classes with safe fallbacks
            $query = TeacherClass::with(['teacher', 'grade', 'subject']);
            
            // If user is teacher, only show their classes
            if ($user->hasRole('teacher')) {
                $query->forTeacher($user->id);
            }

            $classes = $query->get();

            // Calculate statistics with safe fallbacks
            $totalClasses = $classes->count();
            $totalStudents = $classes->sum('total_students') ?? 0;
            $avgAttendanceRate = $classes->avg('attendance_rate') ?? 0;

            // Classes data for dashboard with safe access
            $classesData = $classes->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'grade_name' => optional($class->grade)->name ?? 'Unknown',
                    'subject_name' => optional($class->subject)->name ?? 'Unknown',
                    'total_students' => $class->total_students ?? 0,
                    'attendance_rate' => round($class->attendance_rate ?? 0, 2),
                    'status' => $class->status ?? 'active'
                ];
            });

            // Safe recent activities - simplified
            $recentActivities = collect();

            // Safe exam stats
            $examStats = [
                'total_exams' => 0,
                'active_exams' => 0,
                'upcoming_exams' => 0,
            ];

            // Safe schedule stats
            $scheduleStats = [
                'classes_today' => 0,
                'classes_this_week' => 0,
            ];

            // Safe permission check
            $canManageClasses = false;
            try {
                $canManageClasses = $user->hasPermission('manage_classes') || $user->hasRole('super_admin');
            } catch (\Exception $e) {
                \Log::warning('Permission check failed', ['error' => $e->getMessage()]);
            }

            return Inertia::render('Teacher/Dashboard', [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => optional($user->roles->first())->display_name ?? 'Teacher'
                ],
                'statistics' => [
                    'total_classes' => $totalClasses,
                    'total_students' => $totalStudents,
                    'average_attendance' => round($avgAttendanceRate, 2)
                ],
                'classes' => $classesData,
                'recent_activities' => $recentActivities,
                'exam_stats' => $examStats,
                'schedule_stats' => $scheduleStats,
                'canManageClasses' => $canManageClasses
            ]);
        } catch (\Exception $e) {
            \Log::error('Teacher dashboard error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => auth()->id()
            ]);
            throw $e;
        }
    }

    public function index()
    {
        $user = Auth::user();
        $query = TeacherClass::with(['teacher', 'grade', 'subject', 'students'])
                             ->active();

        // If user is teacher, only show their classes
        if ($user->hasRole('teacher')) {
            $query->forTeacher($user->id);
        }

        $classes = $query->get()->map(function ($class) {
            return [
                'id' => $class->id,
                'name' => $class->name,
                'teacher_name' => $class->teacher->name ?? 'Unknown',
                'grade_name' => $class->grade->name ?? 'Unknown',
                'subject_name' => $class->subject->name ?? 'Unknown',
                'academic_year' => $class->academic_year,
                'semester' => $class->semester,
                'total_students' => $class->total_students,
                'attendance_rate' => round($class->attendance_rate, 2),
                'status' => $class->status
            ];
        });

        return Inertia::render('Teacher/Classes/Index', [
            'classes' => $classes,
            'canManage' => $user->hasPermission('manage_classes') || $user->isSuperAdmin()
        ]);
    }

    public function show($id)
    {
        $user = Auth::user();
        $class = TeacherClass::with(['teacher', 'grade', 'subject', 'students'])->findOrFail($id);

        // Check if teacher can access this class
        if ($user->hasRole('teacher') && !$class->canBeAccessedByTeacher($user->id)) {
            abort(403, 'You can only access your assigned classes.');
        }

        $classData = [
            'id' => $class->id,
            'name' => $class->name,
            'teacher_name' => $class->teacher->name ?? 'Unknown',
            'grade_name' => $class->grade->name ?? 'Unknown',
            'subject_name' => $class->subject->name ?? 'Unknown',
            'academic_year' => $class->academic_year,
            'semester' => $class->semester,
            'description' => $class->description,
            'status' => $class->status,
            'students' => $class->students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'nisn' => $student->nisn,
                    'enrollment_date' => $student->pivot->enrollment_date,
                    'status' => $student->pivot->status
                ];
            }),
            'total_students' => $class->total_students,
            'attendance_rate' => round($class->attendance_rate, 2)
        ];

        // Recent activities
        $recentActivities = Activity::where('class_id', $class->id)
                                  ->with('student')
                                  ->orderBy('date', 'desc')
                                  ->limit(10)
                                  ->get()
                                  ->map(function ($activity) {
                                      return [
                                          'id' => $activity->id,
                                          'student_name' => $activity->student->name ?? 'Unknown',
                                          'type' => $activity->type,
                                          'description' => $activity->description,
                                          'date' => $activity->date,
                                          'status' => $activity->status
                                      ];
                                  });

        return Inertia::render('Teacher/Classes/Show', [
            'class' => $classData,
            'recent_activities' => $recentActivities,
            'canManage' => $user->hasPermission('manage_classes') || $user->isSuperAdmin(),
            'canManageStudents' => $user->hasPermission('manage_students') || $user->isSuperAdmin(),
            'canManageAttendance' => $user->hasPermission('manage_attendance') || $user->isSuperAdmin()
        ]);
    }

    public function create()
    {
        $grades = GradeLevel::active()->orderByLevel()->select('id', 'name')->get();
        $subjects = Subject::select('id', 'name')->get();
        $teachers = User::whereHas('roles', function ($query) {
                                $query->where('name', 'teacher');
                            })
                            ->select('id', 'name')
                            ->get();

        return Inertia::render('Teacher/Classes/Create', [
            'grades' => $grades,
            'subjects' => $subjects,
            'teachers' => $teachers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'grade_id' => 'required|exists:grade_levels,id',
            'teacher_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'academic_year' => 'required|string|max:9',
            'semester' => 'required|in:1,2',
            'description' => 'nullable|string'
        ]);

        TeacherClass::create([
            'name' => $request->name,
            'grade_id' => $request->grade_id,
            'teacher_id' => $request->teacher_id,
            'subject_id' => $request->subject_id,
            'academic_year' => $request->academic_year,
            'semester' => $request->semester,
            'description' => $request->description,
            'status' => 'active'
        ]);

        return redirect()->route('teacher.classes.index')
                        ->with('message', 'Class created successfully!');
    }

    public function attendance($id)
    {
        $user = Auth::user();
        $class = TeacherClass::with(['students'])->findOrFail($id);

        // Check access
        if ($user->hasRole('teacher') && !$class->canBeAccessedByTeacher($user->id)) {
            abort(403, 'You can only manage attendance for your assigned classes.');
        }

        $today = Carbon::today()->format('Y-m-d');
        
        // Get today's attendance records
        $attendanceRecords = Attendance::where('class_id', $class->id)
                                     ->where('date', $today)
                                     ->get()
                                     ->keyBy('student_id');

        $studentsWithAttendance = $class->students->map(function ($student) use ($attendanceRecords) {
            $attendance = $attendanceRecords->get($student->id);
            return [
                'id' => $student->id,
                'name' => $student->name,
                'nisn' => $student->nisn,
                'attendance_status' => $attendance ? $attendance->status : 'not_recorded',
                'notes' => $attendance ? $attendance->notes : ''
            ];
        });

        return Inertia::render('Teacher/Classes/Attendance', [
            'class' => [
                'id' => $class->id,
                'name' => $class->name,
                'grade_name' => $class->grade->name ?? 'Unknown',
                'subject_name' => $class->subject->name ?? 'Unknown'
            ],
            'students' => $studentsWithAttendance,
            'attendance_date' => $today
        ]);
    }

    public function storeAttendance(Request $request, $id)
    {
        $request->validate([
            'attendance_date' => 'required|date',
            'attendance_records' => 'required|array',
            'attendance_records.*.student_id' => 'required|exists:students,id',
            'attendance_records.*.status' => 'required|in:present,absent,late,sick,excused',
            'attendance_records.*.notes' => 'nullable|string'
        ]);

        $class = TeacherClass::findOrFail($id);
        
        // Check access
        $user = Auth::user();
        if ($user->hasRole('teacher') && !$class->canBeAccessedByTeacher($user->id)) {
            abort(403, 'You can only manage attendance for your assigned classes.');
        }

        DB::transaction(function () use ($request, $class) {
            foreach ($request->attendance_records as $record) {
                Attendance::updateOrCreate(
                    [
                        'class_id' => $class->id,
                        'student_id' => $record['student_id'],
                        'date' => $request->attendance_date
                    ],
                    [
                        'status' => $record['status'],
                        'notes' => $record['notes'] ?? null,
                        'subject_id' => $class->subject_id,
                        'semester' => $class->semester,
                        'academic_year' => explode('/', $class->academic_year)[0]
                    ]
                );
            }
        });

        return redirect()->back()->with('message', 'Attendance recorded successfully!');
    }

    public function classReport($id)
    {
        $user = Auth::user();
        $class = TeacherClass::with(['students', 'grade', 'subject', 'teacher'])->findOrFail($id);

        // Check access
        if ($user->hasRole('teacher') && !$class->canBeAccessedByTeacher($user->id)) {
            abort(403, 'You can only view reports for your assigned classes.');
        }

        // Calculate statistics
        $totalStudents = $class->students->count();
        $totalAttendanceRecords = Attendance::where('class_id', $class->id)->count();
        $presentRecords = Attendance::where('class_id', $class->id)->where('status', 'present')->count();
        $attendanceRate = $totalAttendanceRecords > 0 ? ($presentRecords / $totalAttendanceRecords) * 100 : 0;

        // Student performance data
        $studentsData = $class->students->map(function ($student) use ($class) {
            $attendanceCount = Attendance::where('class_id', $class->id)
                                        ->where('student_id', $student->id)
                                        ->count();
            $presentCount = Attendance::where('class_id', $class->id)
                                     ->where('student_id', $student->id)
                                     ->where('status', 'present')
                                     ->count();
            $studentAttendanceRate = $attendanceCount > 0 ? ($presentCount / $attendanceCount) * 100 : 0;

            return [
                'id' => $student->id,
                'name' => $student->name,
                'nisn' => $student->nisn,
                'attendance_rate' => round($studentAttendanceRate, 2),
                'total_days' => $attendanceCount,
                'present_days' => $presentCount
            ];
        });

        return Inertia::render('Teacher/Classes/Report', [
            'class' => [
                'id' => $class->id,
                'name' => $class->name,
                'teacher_name' => $class->teacher->name,
                'grade_name' => $class->grade->name,
                'subject_name' => $class->subject->name,
                'academic_year' => $class->academic_year,
                'semester' => $class->semester
            ],
            'statistics' => [
                'total_students' => $totalStudents,
                'overall_attendance_rate' => round($attendanceRate, 2),
                'total_attendance_records' => $totalAttendanceRecords
            ],
            'students_data' => $studentsData
        ]);
    }

    // Teacher-wide overview methods
    public function attendanceOverview()
    {
        $user = Auth::user();
        
        // Get all classes for this teacher
        $classes = TeacherClass::with(['grade', 'subject', 'students'])
                    ->where('teacher_id', $user->id)
                    ->where('status', 'active')
                    ->get();

        return Inertia::render('Teacher/Attendance/Index', [
            'classes' => $classes,
            'message' => 'Attendance management overview - Coming Soon!'
        ]);
    }

    public function gradesOverview()
    {
        $user = Auth::user();
        
        // Get all classes for this teacher with students and grades
        $classes = TeacherClass::with(['grade', 'subject', 'students' => function($query) {
            $query->select('students.*');
        }])
        ->where('teacher_id', $user->id)
        ->where('status', 'active')
        ->get();

        // Get all grades for these classes
        $classIds = $classes->pluck('id');
        $grades = Grade::with(['student', 'teacherClass'])
                    ->whereIn('teacher_class_id', $classIds)
                    ->orderBy('assessment_date', 'desc')
                    ->get();

        // Get unique subjects from classes
        $subjects = $classes->pluck('subject.name')->unique()->values()->filter();

        // Get all students from teacher's classes
        $students = collect();
        foreach ($classes as $class) {
            $students = $students->merge($class->students);
        }
        $students = $students->unique('id')->values();

        // Calculate statistics
        $stats = [
            'total_students' => $students->count(),
            'graded_students' => $grades->pluck('student_id')->unique()->count(),
            'average_score' => $grades->count() > 0 ? round($grades->avg('score'), 1) : 0,
            'highest_score' => $grades->count() > 0 ? $grades->max('score') : 0,
            'lowest_score' => $grades->count() > 0 ? $grades->min('score') : 0,
            'total_classes' => $classes->count(),
            'total_subjects' => $subjects->count(),
        ];

        return Inertia::render('Teacher/GradeManagement', [
            'classes' => $classes,
            'grades' => $grades,
            'subjects' => $subjects,
            'students' => $students,
            'stats' => $stats,
        ]);
    }

    public function storeGrade(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'teacher_class_id' => 'required|exists:teacher_classes,id',
            'subject' => 'required|string|max:255',
            'assessment_type' => 'required|in:quiz,uts,uas',
            'score' => 'required|numeric|between:0,100',
            'notes' => 'nullable|string|max:1000',
            'assessment_date' => 'required|date',
        ]);

        $grade = Grade::create($request->all());

        return response()->json([
            'message' => 'Grade added successfully!',
            'grade' => $grade->load(['student', 'teacherClass'])
        ]);
    }

    public function updateGrade(Request $request, $gradeId)
    {
        $request->validate([
            'score' => 'required|numeric|between:0,100',
            'notes' => 'nullable|string|max:1000',
            'assessment_date' => 'required|date',
        ]);

        $grade = Grade::findOrFail($gradeId);
        
        // Ensure the grade belongs to the authenticated teacher's class
        $user = Auth::user();
        if (!$grade->teacherClass || $grade->teacherClass->teacher_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $grade->update($request->only(['score', 'notes', 'assessment_date']));

        return response()->json([
            'message' => 'Grade updated successfully!',
            'grade' => $grade->load(['student', 'teacherClass'])
        ]);
    }

    public function deleteGrade($gradeId)
    {
        $grade = Grade::findOrFail($gradeId);
        
        // Ensure the grade belongs to the authenticated teacher's class
        $user = Auth::user();
        if (!$grade->teacherClass || $grade->teacherClass->teacher_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $grade->delete();

        return response()->json(['message' => 'Grade deleted successfully!']);
    }

    public function exportGrades(Request $request)
    {
        $user = Auth::user();
        $format = $request->get('format', 'excel'); // excel or pdf
        $classId = $request->get('class_id');
        $subject = $request->get('subject');

        $query = Grade::with(['student', 'teacherClass'])
                    ->whereHas('teacherClass', function($q) use ($user) {
                        $q->where('teacher_id', $user->id);
                    });

        if ($classId) {
            $query->where('teacher_class_id', $classId);
        }

        if ($subject) {
            $query->where('subject', $subject);
        }

        $grades = $query->orderBy('assessment_date', 'desc')->get();

        if ($format === 'pdf') {
            // PDF export logic would go here
            return response()->json(['message' => 'PDF export - Coming Soon!']);
        }

        // Excel export logic would go here
        return response()->json(['message' => 'Excel export - Coming Soon!']);
    }

    public function reportsOverview()
    {
        $user = Auth::user();
        
        // Get all classes for this teacher
        $classes = TeacherClass::with(['grade', 'subject', 'students'])
                    ->where('teacher_id', $user->id)
                    ->where('status', 'active')
                    ->get();

        return Inertia::render('Teacher/Reports/Index', [
            'classes' => $classes,
            'message' => 'Reports overview - Coming Soon!'
        ]);
    }
}