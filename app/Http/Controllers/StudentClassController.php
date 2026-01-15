<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StudentClassController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentClass::query()
            ->with(['teacher', 'students'])
            ->withCount('students');

        // Search functionality
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        // Filter by academic year
        if ($request->academic_year) {
            $query->where('academic_year', $request->academic_year);
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $classes = $query->orderBy('academic_year', 'desc')
                        ->orderBy('name')
                        ->paginate(15)
                        ->withQueryString()
                        ->through(function ($class) {
                            return [
                                'id' => $class->id,
                                'name' => $class->name,
                                'description' => $class->description,
                                'teacher_name' => $class->teacher?->name,
                                'academic_year' => $class->academic_year,
                                'max_students' => $class->max_students,
                                'students_count' => $class->students_count,
                                'status' => $class->status,
                                'created_at' => $class->created_at,
                                'capacity_percentage' => $class->max_students > 0 ? ($class->students_count / $class->max_students) * 100 : 0,
                                'can_enroll' => $class->canEnrollStudent(),
                            ];
                        });

        // Get unique academic years for filter
        $academicYears = StudentClass::distinct('academic_year')
                                    ->orderBy('academic_year', 'desc')
                                    ->pluck('academic_year');

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
            'filters' => $request->only(['search', 'academic_year', 'status']),
            'academicYears' => $academicYears,
        ]);
    }

    public function create()
    {
        return Inertia::render('Classes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'teacher_id' => 'nullable|exists:users,id',
            'academic_year' => 'required|integer|min:2020|max:' . (date('Y') + 5),
            'max_students' => 'required|integer|min:1|max:100',
            'status' => 'required|in:active,inactive',
        ]);

        StudentClass::create($validated);

        return redirect()
            ->route('classes.index')
            ->with('message', [
                'type' => 'success',
                'text' => 'Class created successfully!'
            ]);
    }

    public function show(StudentClass $class)
    {
        $class->load(['teacher', 'students' => function ($query) {
            $query->with('class');
        }]);

        return Inertia::render('Classes/Show', [
            'class' => [
                'id' => $class->id,
                'name' => $class->name,
                'description' => $class->description,
                'teacher' => $class->teacher ? [
                    'id' => $class->teacher->id,
                    'name' => $class->teacher->name,
                    'email' => $class->teacher->email,
                ] : null,
                'academic_year' => $class->academic_year,
                'max_students' => $class->max_students,
                'status' => $class->status,
                'created_at' => $class->created_at,
                'updated_at' => $class->updated_at,
                'students' => $class->students->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'student_id' => $student->student_id,
                        'email' => $student->email,
                        'phone' => $student->phone,
                        'status' => $student->status,
                        'enrollment_date' => $student->pivot?->enrollment_date,
                        'enrollment_status' => $student->pivot?->status,
                    ];
                }),
                'students_count' => $class->students->count(),
                'capacity_percentage' => $class->max_students > 0 ? ($class->students->count() / $class->max_students) * 100 : 0,
                'can_enroll' => $class->canEnrollStudent(),
            ]
        ]);
    }

    public function edit(StudentClass $class)
    {
        return Inertia::render('Classes/Edit', [
            'class' => [
                'id' => $class->id,
                'name' => $class->name,
                'description' => $class->description,
                'teacher_id' => $class->teacher_id,
                'academic_year' => $class->academic_year,
                'max_students' => $class->max_students,
                'status' => $class->status,
            ]
        ]);
    }

    public function update(Request $request, StudentClass $class)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'teacher_id' => 'nullable|exists:users,id',
            'academic_year' => 'required|integer|min:2020|max:' . (date('Y') + 5),
            'max_students' => 'required|integer|min:1|max:100',
            'status' => 'required|in:active,inactive',
        ]);

        $class->update($validated);

        return redirect()
            ->route('classes.index')
            ->with('message', [
                'type' => 'success',
                'text' => 'Class updated successfully!'
            ]);
    }

    public function destroy(StudentClass $class)
    {
        // Check if class has enrolled students
        if ($class->students()->count() > 0) {
            return back()->with('message', [
                'type' => 'error',
                'text' => 'Cannot delete class with enrolled students. Please remove all students first.'
            ]);
        }

        $class->delete();

        return redirect()
            ->route('classes.index')
            ->with('message', [
                'type' => 'success',
                'text' => 'Class deleted successfully!'
            ]);
    }

    public function showStudents(StudentClass $class)
    {
        $class->load(['students' => function ($query) {
            $query->with('class')->orderBy('name');
        }]);

        return Inertia::render('Classes/Students', [
            'class' => [
                'id' => $class->id,
                'name' => $class->name,
                'academic_year' => $class->academic_year,
                'max_students' => $class->max_students,
                'students_count' => $class->students->count(),
                'can_enroll' => $class->canEnrollStudent(),
            ],
            'students' => $class->students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'student_id' => $student->student_id,
                    'email' => $student->email,
                    'phone' => $student->phone,
                    'gender' => $student->gender,
                    'status' => $student->status,
                    'enrollment_date' => $student->pivot?->enrollment_date,
                    'enrollment_status' => $student->pivot?->status,
                ];
            }),
        ]);
    }

    public function enrollStudent(Request $request, StudentClass $class)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'enrollment_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $student = Student::findOrFail($validated['student_id']);

        // Check if student is already enrolled in this class
        if ($class->students()->where('student_id', $student->id)->exists()) {
            return back()->with('message', [
                'type' => 'error',
                'text' => 'Student is already enrolled in this class.'
            ]);
        }

        // Check class capacity
        if (!$class->canEnrollStudent()) {
            return back()->with('message', [
                'type' => 'error',
                'text' => 'Class is at full capacity.'
            ]);
        }

        // Enroll student
        $class->enrollStudent($student, $validated['enrollment_date'] ?? now()->toDateString(), $validated['notes'] ?? null);

        return back()->with('message', [
            'type' => 'success',
            'text' => 'Student enrolled successfully!'
        ]);
    }

    public function removeStudent(StudentClass $class, Student $student)
    {
        if (!$class->students()->where('student_id', $student->id)->exists()) {
            return back()->with('message', [
                'type' => 'error',
                'text' => 'Student is not enrolled in this class.'
            ]);
        }

        $class->students()->detach($student->id);

        return back()->with('message', [
            'type' => 'success',
            'text' => 'Student removed from class successfully!'
        ]);
    }
}