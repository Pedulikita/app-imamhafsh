<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentClass;
use App\Models\StudentEnrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class StudentEnrollmentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:super_admin,admin']);
    }

    public function index(Request $request): Response
    {
        $query = StudentEnrollment::with(['student', 'class'])
                                 ->latest();

        // Apply filters
        if ($request->filled('search')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('student_id', 'like', "%{$request->search}%");
            })->orWhereHas('class', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('class_id')) {
            $query->byClass($request->class_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->paginate(20)->withQueryString();
        $students = Student::whereDoesntHave('enrollments', function ($q) {
            $q->where('status', 'enrolled');
        })->get();
        $classes = StudentClass::active()->get();
        $stats = StudentEnrollment::getStatistics();

        return Inertia::render('Students/Enrollment', [
            'enrollments' => $enrollments,
            'students' => $students,
            'classes' => $classes,
            'stats' => $stats
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:student_classes,id',
            'enrollment_date' => 'required|date'
        ]);

        $student = Student::findOrFail($request->student_id);
        $class = StudentClass::findOrFail($request->class_id);

        // Check if student is already enrolled in this class
        if ($student->isEnrolledInClass($class->id)) {
            return Redirect::back()
                          ->with('error', 'Student is already enrolled in this class.');
        }

        // Check if class has available slots
        if (!$class->canEnrollStudent()) {
            return Redirect::back()
                          ->with('error', 'Class is full. Cannot enroll student.');
        }

        // Create enrollment
        StudentEnrollment::create([
            'student_id' => $student->id,
            'class_id' => $class->id,
            'enrollment_date' => $request->enrollment_date,
            'status' => 'enrolled'
        ]);

        // Update student's class
        $student->update(['class_id' => $class->id]);

        // Update class student count
        $class->increment('current_students');

        return Redirect::back()
                      ->with('success', 'Student enrolled successfully.');
    }

    public function updateStatus(StudentEnrollment $enrollment, Request $request): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:enrolled,completed,dropped'
        ]);

        $oldStatus = $enrollment->status;
        $newStatus = $request->status;

        if ($oldStatus === $newStatus) {
            return Redirect::back();
        }

        $enrollment->update(['status' => $newStatus]);

        // Handle status changes
        if ($oldStatus === 'enrolled' && in_array($newStatus, ['completed', 'dropped'])) {
            // Student leaving class
            $enrollment->class->decrement('current_students');
            $enrollment->student->update(['class_id' => null]);
        } elseif (in_array($oldStatus, ['completed', 'dropped']) && $newStatus === 'enrolled') {
            // Student returning to class
            if ($enrollment->class->canEnrollStudent()) {
                $enrollment->class->increment('current_students');
                $enrollment->student->update(['class_id' => $enrollment->class_id]);
            } else {
                // Revert if class is full
                $enrollment->update(['status' => $oldStatus]);
                return Redirect::back()
                              ->with('error', 'Cannot re-enroll student. Class is full.');
            }
        }

        return Redirect::back()
                      ->with('success', 'Enrollment status updated successfully.');
    }
}