<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Requests\BulkImportStudentRequest;
use App\Models\Student;
use App\Models\StudentClass;
use App\Services\StudentImportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:super_admin,admin,teacher']);
    }

    public function index(Request $request): Response
    {
        $user = auth()->user();
        $query = Student::latest(); // Remove with(['class']) karena relasi tidak ada

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('class')) {
            $query->byClass($request->class);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('gender')) {
            $query->byGender($request->gender);
        }

        if ($request->filled('performance_status')) {
            $query->byPerformance($request->performance_status);
        }

        if ($request->filled('academic_year')) {
            $query->byAcademicYear($request->academic_year);
        }

        $students = $query->paginate(20)->withQueryString();
        $classes = StudentClass::active()->get();
        $stats = Student::getStatistics();

        // Determine permissions based on user role
        $canManage = $user && ($user->hasRole('super_admin') || $user->hasRole('admin'));
        $canView = true; // All authenticated users can view
        $canEdit = $canManage;
        $canDelete = $canManage;
        $canCreate = $canManage;

        return Inertia::render('Students/Index', [
            'students' => $students,
            'classes' => $classes,
            'stats' => $stats,
            'filters' => $request->only(['search', 'class', 'status', 'gender', 'performance_status', 'academic_year']),
            'permissions' => [
                'canManage' => $canManage,
                'canView' => $canView,
                'canEdit' => $canEdit,
                'canDelete' => $canDelete,
                'canCreate' => $canCreate,
            ]
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();
        if (!($user->hasRole('super_admin') || $user->hasRole('admin'))) {
            abort(403, 'Unauthorized action.');
        }

        $classes = StudentClass::active()->get();
        $currentAcademicYear = now()->year;
        $nextStudentSequence = $this->getNextStudentSequence($currentAcademicYear);

        return Inertia::render('Students/Create', [
            'classes' => $classes,
            'nextStudentSequence' => $nextStudentSequence,
            'currentAcademicYear' => $currentAcademicYear
        ]);
    }

    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $user = auth()->user();
        if (!($user->hasRole('super_admin') || $user->hasRole('admin'))) {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validated();
        
        // Generate student ID if not provided
        if (empty($data['student_id'])) {
            $data['student_id'] = Student::generateStudentId($data['academic_year']);
        }

        // Handle class_id to class conversion
        if (!empty($data['class_id'])) {
            $class = StudentClass::find($data['class_id']);
            if ($class) {
                $data['class'] = $class->name;
            }
            unset($data['class_id']); // Remove class_id as it's not in the database
        } else {
            $data['class'] = 'Unassigned'; // Default class value
        }

        $student = Student::create($data);

        // If class is assigned, create enrollment
        if (!empty($data['class_id'] ?? ($class->id ?? null))) {
            $classObj = $class ?? StudentClass::find($data['class_id']);
            if ($classObj && $classObj->canEnrollStudent()) {
                $classObj->enrollStudent($student);
            }
        }

        return Redirect::route('monitoring.student-management.index')
                      ->with('success', 'Student created successfully.');
    }

    public function show(Student $student): Response
    {
        $student->load([
            'class',
            'enrollments.class',
            'grades' => function ($query) {
                $query->latest()->limit(10);
            },
            'attendances' => function ($query) {
                $query->latest()->limit(20);
            }
        ]);

        return Inertia::render('Students/Show', [
            'student' => $student
        ]);
    }

    public function edit(Student $student): Response
    {
        $user = auth()->user();
        if (!($user->hasRole('super_admin') || $user->hasRole('admin'))) {
            abort(403, 'Unauthorized action.');
        }


        $classes = StudentClass::active()->get();
        
        return Inertia::render('Students/Edit', [
            'student' => $student,
            'classes' => $classes
        ]);
    }

    public function update(UpdateStudentRequest $request, Student $student): RedirectResponse
    {
        $user = auth()->user();
        if (!($user->hasRole('super_admin') || $user->hasRole('admin'))) {
            abort(403, 'Unauthorized action.');
        }


        $data = $request->validated();
        $oldClassId = $student->class_id;
        
        $student->update($data);

        // Handle class change
        if ($oldClassId !== $data['class_id']) {
            // Remove from old class
            if ($oldClassId) {
                $oldClass = StudentClass::find($oldClassId);
                $oldClass?->removeStudent($student);
            }
            
            // Add to new class
            if ($data['class_id']) {
                $newClass = StudentClass::find($data['class_id']);
                if ($newClass && $newClass->canEnrollStudent()) {
                    $newClass->enrollStudent($student);
                }
            }
        }

        return Redirect::route('monitoring.student-management.show', $student)
                      ->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $user = auth()->user();
        if (!($user->hasRole('super_admin') || $user->hasRole('admin'))) {
            abort(403, 'Unauthorized action.');
        }


        // Remove from class first
        if ($student->class_id) {
            $class = StudentClass::find($student->class_id);
            $class?->removeStudent($student);
        }

        $student->delete();

        return Redirect::route('monitoring.student-management.index')
                      ->with('success', 'Student deleted successfully.');
    }

    public function import(): Response
    {
        $classes = StudentClass::active()->get();
        
        return Inertia::render('Students/Import', [
            'classes' => $classes
        ]);
    }

    public function bulkImport(BulkImportStudentRequest $request, StudentImportService $importService): RedirectResponse
    {
        try {
            $result = $importService->importStudents($request->validated()['students']);
            
            return Redirect::route('monitoring.student-management.index')
                          ->with('success', "Successfully imported {$result['imported']} students. {$result['skipped']} skipped.");
        } catch (\Exception $e) {
            return Redirect::back()
                          ->with('error', 'Import failed: ' . $e->getMessage());
        }
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id'
        ]);

        $students = Student::whereIn('id', $request->student_ids)->get();
        
        foreach ($students as $student) {
            // Remove from class first
            if ($student->class_id) {
                $class = StudentClass::find($student->class_id);
                $class?->removeStudent($student);
            }
        }

        Student::whereIn('id', $request->student_ids)->delete();

        return Redirect::route('monitoring.student-management.index')
                      ->with('success', count($request->student_ids) . ' students deleted successfully.');
    }

    private function getNextStudentSequence(int $academicYear): int
    {
        $lastStudent = Student::where('academic_year', $academicYear)
                             ->orderBy('id', 'desc')
                             ->first();
        
        return $lastStudent ? 
            intval(substr($lastStudent->student_id, -4)) + 1 : 1;
    }
}