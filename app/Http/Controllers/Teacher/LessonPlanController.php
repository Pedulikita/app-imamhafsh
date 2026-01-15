<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\LessonPlan;
use App\Models\TeacherClass;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class LessonPlanController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $lessonPlans = LessonPlan::forTeacher($user->id)
            ->with(['teacherClass.grade', 'subject'])
            ->orderBy('lesson_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->paginate(15);

        $stats = [
            'total_plans' => LessonPlan::forTeacher($user->id)->count(),
            'this_week' => LessonPlan::forTeacher($user->id)->thisWeek()->count(),
            'upcoming' => LessonPlan::forTeacher($user->id)->upcoming()->count(),
            'templates' => LessonPlan::forTeacher($user->id)->templates()->count(),
        ];

        return Inertia::render('Teacher/LessonPlans/Index', [
            'lessonPlans' => $lessonPlans,
            'stats' => $stats,
        ]);
    }

    public function calendar()
    {
        $user = Auth::user();
        $date = request('date', Carbon::now()->format('Y-m'));
        $startOfMonth = Carbon::createFromFormat('Y-m', $date)->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        $lessonPlans = LessonPlan::forTeacher($user->id)
            ->with(['teacherClass.grade', 'subject'])
            ->whereBetween('lesson_date', [$startOfMonth, $endOfMonth])
            ->get()
            ->map(function($plan) {
                return [
                    'id' => $plan->id,
                    'title' => $plan->title,
                    'start' => $plan->lesson_date->format('Y-m-d') . 'T' . $plan->start_time->format('H:i:s'),
                    'end' => $plan->lesson_date->format('Y-m-d') . 'T' . $plan->end_time->format('H:i:s'),
                    'color' => $this->getStatusColor($plan->status),
                    'extendedProps' => [
                        'status' => $plan->status,
                        'class_name' => $plan->teacherClass->class_name,
                        'subject_name' => $plan->subject->name,
                        'description' => $plan->description,
                    ]
                ];
            });

        return Inertia::render('Teacher/LessonPlans/Calendar', [
            'lessonPlans' => $lessonPlans,
            'currentDate' => $date,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        
        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
            ->with(['grade', 'subject'])
            ->get();

        $subjects = Subject::all();
        $templates = LessonPlan::forTeacher($user->id)->templates()->get();

        return Inertia::render('Teacher/LessonPlans/Create', [
            'teacherClasses' => $teacherClasses,
            'subjects' => $subjects,
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_class_id' => 'required|exists:teacher_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'lesson_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'learning_objectives' => 'required|string',
            'materials_needed' => 'nullable|string',
            'learning_activities' => 'required|array',
            'learning_activities.*.activity' => 'required|string',
            'learning_activities.*.duration' => 'required|integer|min:1',
            'assessment_methods' => 'nullable|string',
            'homework_assignment' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|in:draft,published',
            'is_template' => 'boolean',
        ]);

        $startTime = Carbon::createFromFormat('H:i', $validated['start_time']);
        $endTime = Carbon::createFromFormat('H:i', $validated['end_time']);
        $durationMinutes = $endTime->diffInMinutes($startTime);

        $lessonPlan = LessonPlan::create([
            ...$validated,
            'teacher_id' => Auth::id(),
            'duration_minutes' => $durationMinutes,
        ]);

        return redirect()->route('teacher.lesson-plans.show', $lessonPlan)
            ->with('success', 'Lesson plan created successfully.');
    }

    public function show(LessonPlan $lessonPlan)
    {
        $this->authorize('view', $lessonPlan);
        
        $lessonPlan->load(['teacherClass.grade', 'subject', 'teacher']);

        return Inertia::render('Teacher/LessonPlans/Show', [
            'lessonPlan' => $lessonPlan,
        ]);
    }

    public function edit(LessonPlan $lessonPlan)
    {
        $this->authorize('update', $lessonPlan);
        
        $user = Auth::user();
        
        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
            ->with(['grade', 'subject'])
            ->get();

        $subjects = Subject::all();
        $lessonPlan->load(['teacherClass.grade', 'subject']);

        return Inertia::render('Teacher/LessonPlans/Edit', [
            'lessonPlan' => $lessonPlan,
            'teacherClasses' => $teacherClasses,
            'subjects' => $subjects,
        ]);
    }

    public function update(Request $request, LessonPlan $lessonPlan)
    {
        $this->authorize('update', $lessonPlan);
        
        $validated = $request->validate([
            'teacher_class_id' => 'required|exists:teacher_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'lesson_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'learning_objectives' => 'required|string',
            'materials_needed' => 'nullable|string',
            'learning_activities' => 'required|array',
            'learning_activities.*.activity' => 'required|string',
            'learning_activities.*.duration' => 'required|integer|min:1',
            'assessment_methods' => 'nullable|string',
            'homework_assignment' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|in:draft,published,completed,cancelled',
            'reflection' => 'nullable|string',
            'attendance_count' => 'nullable|integer|min:0',
        ]);

        $startTime = Carbon::createFromFormat('H:i', $validated['start_time']);
        $endTime = Carbon::createFromFormat('H:i', $validated['end_time']);
        $durationMinutes = $endTime->diffInMinutes($startTime);

        $lessonPlan->update([
            ...$validated,
            'duration_minutes' => $durationMinutes,
        ]);

        return redirect()->route('teacher.lesson-plans.show', $lessonPlan)
            ->with('success', 'Lesson plan updated successfully.');
    }

    public function destroy(LessonPlan $lessonPlan)
    {
        $this->authorize('delete', $lessonPlan);
        
        $lessonPlan->delete();

        return redirect()->route('teacher.lesson-plans.index')
            ->with('success', 'Lesson plan deleted successfully.');
    }

    public function duplicate(LessonPlan $lessonPlan)
    {
        $this->authorize('view', $lessonPlan);
        
        $newPlan = $lessonPlan->replicate();
        $newPlan->title = $lessonPlan->title . ' (Copy)';
        $newPlan->status = 'draft';
        $newPlan->lesson_date = Carbon::today()->addDay();
        $newPlan->reflection = null;
        $newPlan->attendance_count = null;
        $newPlan->save();

        return redirect()->route('teacher.lesson-plans.edit', $newPlan)
            ->with('success', 'Lesson plan duplicated successfully.');
    }

    public function makeTemplate(LessonPlan $lessonPlan)
    {
        $this->authorize('update', $lessonPlan);
        
        $template = $lessonPlan->replicate();
        $template->title = $lessonPlan->title . ' (Template)';
        $template->is_template = true;
        $template->status = 'draft';
        $template->lesson_date = Carbon::today();
        $template->reflection = null;
        $template->attendance_count = null;
        $template->save();

        return redirect()->route('teacher.lesson-plans.index')
            ->with('success', 'Template created successfully.');
    }

    private function getStatusColor($status)
    {
        return match($status) {
            'draft' => '#6b7280',
            'published' => '#3b82f6',
            'completed' => '#10b981',
            'cancelled' => '#ef4444',
            default => '#6b7280'
        };
    }
}
