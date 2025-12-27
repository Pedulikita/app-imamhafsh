<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\TimeSlot;
use App\Models\Classroom;
use App\Models\TeacherClass;
use App\Models\Subject;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get current week schedules for this teacher
        $schedules = Schedule::whereHas('teacherClass', function($query) use ($user) {
                                $query->where('teacher_id', $user->id);
                            })
                            ->with(['teacherClass.grade', 'subject', 'timeSlot', 'classroom'])
                            ->currentWeek()
                            ->active()
                            ->orderBy('day_of_week')
                            ->orderByRaw("
                                CASE day_of_week 
                                    WHEN 'monday' THEN 1
                                    WHEN 'tuesday' THEN 2
                                    WHEN 'wednesday' THEN 3
                                    WHEN 'thursday' THEN 4
                                    WHEN 'friday' THEN 5
                                    WHEN 'saturday' THEN 6
                                    WHEN 'sunday' THEN 7
                                END
                            ")
                            ->get()
                            ->groupBy('day_of_week');

        // Format for calendar view
        $weeklySchedule = [];
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        foreach ($days as $day) {
            $daySchedules = $schedules->get($day, collect())->map(function($schedule) {
                return [
                    'id' => $schedule->id,
                    'subject' => $schedule->subject->name,
                    'class' => $schedule->teacherClass->class_name,
                    'classroom' => $schedule->classroom->name ?? 'TBA',
                    'time_range' => $schedule->getTimeRange(),
                    'start_time' => $schedule->timeSlot->start_time,
                    'end_time' => $schedule->timeSlot->end_time,
                    'notes' => $schedule->notes,
                ];
            });
            
            $weeklySchedule[$day] = $daySchedules;
        }

        // Get today's schedule
        $today = strtolower(now()->format('l'));
        $todaySchedule = $weeklySchedule[$today] ?? [];

        // Get next class
        $nextClass = null;
        $currentTime = now()->format('H:i:s');
        
        foreach ($todaySchedule as $schedule) {
            if ($schedule['start_time'] > $currentTime) {
                $nextClass = $schedule;
                break;
            }
        }

        return Inertia::render('Teacher/Schedules/Index', [
            'weekly_schedule' => $weeklySchedule,
            'today_schedule' => $todaySchedule,
            'next_class' => $nextClass,
            'current_day' => $today,
            'statistics' => [
                'total_classes_this_week' => collect($weeklySchedule)->flatten(1)->count(),
                'classes_today' => count($todaySchedule),
                'unique_subjects' => collect($weeklySchedule)->flatten(1)->unique('subject')->count(),
                'unique_classrooms' => collect($weeklySchedule)->flatten(1)->unique('classroom')->count(),
            ]
        ]);
    }

    public function weekly(Request $request)
    {
        $user = Auth::user();
        $weekStart = $request->get('week', now()->startOfWeek());
        $weekEnd = Carbon::parse($weekStart)->endOfWeek();

        $schedules = Schedule::whereHas('teacherClass', function($query) use ($user) {
                                $query->where('teacher_id', $user->id);
                            })
                            ->with(['teacherClass.grade', 'subject', 'timeSlot', 'classroom'])
                            ->where('effective_from', '<=', $weekEnd)
                            ->where(function($query) use ($weekStart) {
                                $query->whereNull('effective_until')
                                      ->orWhere('effective_until', '>=', $weekStart);
                            })
                            ->active()
                            ->get();

        // Get all time slots for the grid
        $timeSlots = TimeSlot::active()->lessons()->ordered()->get();

        // Create schedule grid
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $scheduleGrid = [];

        foreach ($timeSlots as $timeSlot) {
            $row = [
                'time_slot' => [
                    'id' => $timeSlot->id,
                    'name' => $timeSlot->name,
                    'time_range' => $timeSlot->getFormattedTime(),
                ]
            ];

            foreach ($days as $day) {
                $daySchedule = $schedules->where('day_of_week', $day)
                                       ->where('time_slot_id', $timeSlot->id)
                                       ->first();

                if ($daySchedule) {
                    $row[$day] = [
                        'id' => $daySchedule->id,
                        'subject' => $daySchedule->subject->name,
                        'class' => $daySchedule->teacherClass->class_name,
                        'classroom' => $daySchedule->classroom->name ?? 'TBA',
                        'has_conflict' => $daySchedule->hasConflict(),
                    ];
                } else {
                    $row[$day] = null;
                }
            }

            $scheduleGrid[] = $row;
        }

        return Inertia::render('Teacher/Schedules/Weekly', [
            'schedule_grid' => $scheduleGrid,
            'week_start' => $weekStart,
            'week_end' => $weekEnd,
            'time_slots' => $timeSlots->map(function($slot) {
                return [
                    'id' => $slot->id,
                    'name' => $slot->name,
                    'time_range' => $slot->getFormattedTime(),
                ];
            }),
            'days' => [
                'monday' => 'Senin',
                'tuesday' => 'Selasa',
                'wednesday' => 'Rabu',
                'thursday' => 'Kamis',
                'friday' => 'Jumat',
                'saturday' => 'Sabtu',
            ]
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
                                     ->with(['grade', 'subject'])
                                     ->get()
                                     ->map(function($class) {
                                         return [
                                             'id' => $class->id,
                                             'name' => $class->class_name,
                                             'subject' => $class->subject->name ?? 'Unknown',
                                             'grade' => $class->grade->name ?? 'Unknown',
                                         ];
                                     });

        $timeSlots = TimeSlot::active()->lessons()->ordered()->get()->map(function($slot) {
            return [
                'id' => $slot->id,
                'name' => $slot->name,
                'time_range' => $slot->getFormattedTime(),
                'start_time' => $slot->start_time,
                'end_time' => $slot->end_time,
            ];
        });

        $classrooms = Classroom::active()->orderBy('name')->get()->map(function($classroom) {
            return [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'code' => $classroom->code,
                'type' => $classroom->type,
                'capacity' => $classroom->capacity,
                'facilities' => $classroom->getFacilitiesList(),
            ];
        });

        $subjects = Subject::active()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Teacher/Schedules/Create', [
            'teacher_classes' => $teacherClasses,
            'time_slots' => $timeSlots,
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'days' => [
                'monday' => 'Senin',
                'tuesday' => 'Selasa',
                'wednesday' => 'Rabu',
                'thursday' => 'Kamis',
                'friday' => 'Jumat',
                'saturday' => 'Sabtu',
                'sunday' => 'Minggu',
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'teacher_class_id' => 'required|exists:teacher_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'classroom_id' => 'nullable|exists:classrooms,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'effective_from' => 'required|date',
            'effective_until' => 'nullable|date|after:effective_from',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if teacher owns this class
        $teacherClass = TeacherClass::findOrFail($request->teacher_class_id);
        if ($teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        // Check for conflicts before creating
        $conflicts = $this->checkConflicts($request->all());
        if (!empty($conflicts)) {
            return back()->withErrors(['conflict' => 'Ada konflik jadwal: ' . implode(', ', $conflicts)]);
        }

        Schedule::create([
            'teacher_class_id' => $request->teacher_class_id,
            'subject_id' => $request->subject_id,
            'time_slot_id' => $request->time_slot_id,
            'classroom_id' => $request->classroom_id,
            'day_of_week' => $request->day_of_week,
            'effective_from' => $request->effective_from,
            'effective_until' => $request->effective_until,
            'notes' => $request->notes,
        ]);

        return redirect()->route('teacher.schedules.index')
                        ->with('success', 'Jadwal berhasil dibuat.');
    }

    public function show(Schedule $schedule)
    {
        // Ensure teacher owns this schedule
        if ($schedule->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Teacher/Schedules/Show', [
            'schedule' => [
                'id' => $schedule->id,
                'class_name' => $schedule->teacherClass->class_name,
                'subject' => $schedule->subject->name,
                'day_name' => $schedule->getDayName(),
                'time_range' => $schedule->getTimeRange(),
                'classroom' => $schedule->classroom->name ?? 'TBA',
                'effective_from' => $schedule->effective_from,
                'effective_until' => $schedule->effective_until,
                'notes' => $schedule->notes,
                'is_effective' => $schedule->isEffective(),
                'has_conflict' => $schedule->hasConflict(),
            ]
        ]);
    }

    public function edit(Schedule $schedule)
    {
        // Ensure teacher owns this schedule
        if ($schedule->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $user = Auth::user();

        $teacherClasses = TeacherClass::where('teacher_id', $user->id)
                                     ->with(['grade', 'subject'])
                                     ->get()
                                     ->map(function($class) {
                                         return [
                                             'id' => $class->id,
                                             'name' => $class->class_name,
                                             'subject' => $class->subject->name ?? 'Unknown',
                                         ];
                                     });

        $timeSlots = TimeSlot::active()->lessons()->ordered()->get()->map(function($slot) {
            return [
                'id' => $slot->id,
                'name' => $slot->name,
                'time_range' => $slot->getFormattedTime(),
            ];
        });

        $classrooms = Classroom::active()->orderBy('name')->get()->map(function($classroom) {
            return [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'type' => $classroom->type,
                'capacity' => $classroom->capacity,
            ];
        });

        $subjects = Subject::active()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Teacher/Schedules/Edit', [
            'schedule' => [
                'id' => $schedule->id,
                'teacher_class_id' => $schedule->teacher_class_id,
                'subject_id' => $schedule->subject_id,
                'time_slot_id' => $schedule->time_slot_id,
                'classroom_id' => $schedule->classroom_id,
                'day_of_week' => $schedule->day_of_week,
                'effective_from' => $schedule->effective_from->format('Y-m-d'),
                'effective_until' => $schedule->effective_until?->format('Y-m-d'),
                'notes' => $schedule->notes,
            ],
            'teacher_classes' => $teacherClasses,
            'time_slots' => $timeSlots,
            'classrooms' => $classrooms,
            'subjects' => $subjects,
            'days' => [
                'monday' => 'Senin',
                'tuesday' => 'Selasa',
                'wednesday' => 'Rabu',
                'thursday' => 'Kamis',
                'friday' => 'Jumat',
                'saturday' => 'Sabtu',
                'sunday' => 'Minggu',
            ]
        ]);
    }

    public function update(Request $request, Schedule $schedule)
    {
        // Ensure teacher owns this schedule
        if ($schedule->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'teacher_class_id' => 'required|exists:teacher_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'classroom_id' => 'nullable|exists:classrooms,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'effective_from' => 'required|date',
            'effective_until' => 'nullable|date|after:effective_from',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if teacher owns the new class
        $teacherClass = TeacherClass::findOrFail($request->teacher_class_id);
        if ($teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        // Check for conflicts (excluding current schedule)
        $conflicts = $this->checkConflicts($request->all(), $schedule->id);
        if (!empty($conflicts)) {
            return back()->withErrors(['conflict' => 'Ada konflik jadwal: ' . implode(', ', $conflicts)]);
        }

        $schedule->update([
            'teacher_class_id' => $request->teacher_class_id,
            'subject_id' => $request->subject_id,
            'time_slot_id' => $request->time_slot_id,
            'classroom_id' => $request->classroom_id,
            'day_of_week' => $request->day_of_week,
            'effective_from' => $request->effective_from,
            'effective_until' => $request->effective_until,
            'notes' => $request->notes,
        ]);

        return redirect()->route('teacher.schedules.index')
                        ->with('success', 'Jadwal berhasil diupdate.');
    }

    public function destroy(Schedule $schedule)
    {
        // Ensure teacher owns this schedule
        if ($schedule->teacherClass->teacher_id !== Auth::id()) {
            abort(403);
        }

        $schedule->delete();

        return back()->with('success', 'Jadwal berhasil dihapus.');
    }

    public function checkConflict(Request $request)
    {
        $conflicts = $this->checkConflicts($request->all(), $request->get('exclude_id'));

        return response()->json([
            'has_conflicts' => !empty($conflicts),
            'conflicts' => $conflicts
        ]);
    }

    private function checkConflicts(array $data, ?int $excludeId = null)
    {
        $conflicts = [];

        // Check classroom conflict
        if (!empty($data['classroom_id'])) {
            $classroomConflict = Schedule::where('classroom_id', $data['classroom_id'])
                                        ->where('day_of_week', $data['day_of_week'])
                                        ->where('time_slot_id', $data['time_slot_id'])
                                        ->where('is_active', true)
                                        ->where('effective_from', '<=', $data['effective_until'] ?? '9999-12-31')
                                        ->where(function($q) use ($data) {
                                            $q->whereNull('effective_until')
                                              ->orWhere('effective_until', '>=', $data['effective_from']);
                                        });

            if ($excludeId) {
                $classroomConflict->where('id', '!=', $excludeId);
            }

            if ($classroomConflict->exists()) {
                $classroom = Classroom::find($data['classroom_id']);
                $conflicts[] = "Ruangan {$classroom->name} sudah terpakai";
            }
        }

        // Check teacher conflict
        $teacherClass = TeacherClass::find($data['teacher_class_id']);
        if ($teacherClass) {
            $teacherConflict = Schedule::whereHas('teacherClass', function($q) use ($teacherClass) {
                                          $q->where('teacher_id', $teacherClass->teacher_id);
                                      })
                                      ->where('day_of_week', $data['day_of_week'])
                                      ->where('time_slot_id', $data['time_slot_id'])
                                      ->where('is_active', true)
                                      ->where('effective_from', '<=', $data['effective_until'] ?? '9999-12-31')
                                      ->where(function($q) use ($data) {
                                          $q->whereNull('effective_until')
                                            ->orWhere('effective_until', '>=', $data['effective_from']);
                                      });

            if ($excludeId) {
                $teacherConflict->where('id', '!=', $excludeId);
            }

            if ($teacherConflict->exists()) {
                $conflicts[] = "Guru sudah memiliki jadwal di waktu yang sama";
            }
        }

        return $conflicts;
    }
}