<?php

namespace App\Http\Controllers;

use App\Models\ParentProfile;
use App\Models\Student;
use App\Models\Grade;
use App\Models\Attendance;
use App\Models\Announcement;
use App\Models\ParentTeacherCommunication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ParentController extends Controller
{
    /**
     * Show parent dashboard with children overview
     */
    public function dashboard()
    {
        $user = Auth::user();
        $parent = $user->parentProfile;

        if (!$parent) {
            return redirect()->route('home')->with('error', 'Parent profile not found');
        }

        // Get children with related data
        $children = $parent->students()
            ->with([
                'class',
                'grades' => fn($q) => $q->latest()->limit(5),
                'attendances' => fn($q) => $q->latest()->limit(30)
            ])
            ->get()
            ->map(fn($student) => [
                'id' => $student->id,
                'name' => $student->name,
                'class' => $student->class?->name,
                'gender' => $student->gender,
                'photo' => $student->photo,
                'relation' => $student->pivot->relation,
                'is_primary' => $student->pivot->is_primary_contact,
                'status' => $student->status,
            ]);

        // Get summary stats
        $stats = [
            'total_children' => $children->count(),
            'active_children' => $children->where('status', 'active')->count(),
            'unread_messages' => $parent->notifications()->where('is_read', false)->count(),
            'recent_announcements' => Announcement::latest()->limit(3)->get()->count(),
        ];

        // Get recent communications
        $recent_communications = $parent->getRecentCommunications(5);

        return Inertia::render('Parent/Dashboard', [
            'children' => $children,
            'stats' => $stats,
            'recent_communications' => $recent_communications,
            'parent_info' => [
                'father_name' => $parent->father_name,
                'mother_name' => $parent->mother_name,
                'father_phone' => $parent->father_phone,
                'mother_phone' => $parent->mother_phone,
            ]
        ]);
    }

    /**
     * Show specific child details
     */
    public function showChild(Student $student)
    {
        // Verify this is the parent's child
        $user = Auth::user();
        $parent = $user->parentProfile;

        if (!$parent->students()->where('student_id', $student->id)->exists()) {
            abort(403, 'Unauthorized');
        }

        // Get child details with grades and attendance
        $child = $student->load([
            'class',
            'grades' => fn($q) => $q->with('subject')->latest()->limit(20),
            'attendances' => fn($q) => $q->with('schedule')->latest()->limit(30)
        ]);

        $grades = $child->grades->map(fn($grade) => [
            'id' => $grade->id,
            'subject' => $grade->subject?->name,
            'score' => $grade->score,
            'grade' => $grade->grade,
            'date' => $grade->created_at->format('Y-m-d'),
            'assessment_type' => $grade->assessment_type,
        ]);

        $attendances = $child->attendances->map(fn($att) => [
            'id' => $att->id,
            'date' => $att->attendance_date->format('Y-m-d'),
            'status' => $att->status,
            'time_in' => $att->time_in,
            'time_out' => $att->time_out,
        ]);

        $attendance_percentage = $child->attendances()
            ->where('status', 'present')
            ->count() / max($child->attendances()->count(), 1) * 100;

        $relation = $parent->students()
            ->where('student_id', $student->id)
            ->first()
            ->pivot->relation;

        return Inertia::render('Parent/ChildDetails', [
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'email' => $child->email,
                'gender' => $child->gender,
                'class' => $child->class?->name,
                'photo' => $child->photo,
                'birth_date' => $child->birth_date,
                'status' => $child->status,
                'enrollment_date' => $child->enrollment_date,
                'address' => $child->address,
                'phone' => $child->phone,
            ],
            'relation' => $relation,
            'grades' => $grades,
            'attendances' => $attendances,
            'attendance_percentage' => round($attendance_percentage, 2),
            'average_grade' => $grades->avg('score'),
        ]);
    }

    /**
     * Show child's grades
     */
    public function childGrades(Student $student)
    {
        $user = Auth::user();
        $parent = $user->parentProfile;

        if (!$parent->students()->where('student_id', $student->id)->exists()) {
            abort(403, 'Unauthorized');
        }

        $grades = $student->grades()
            ->with('subject')
            ->latest()
            ->paginate(15);

        $grades_data = $grades->map(fn($grade) => [
            'id' => $grade->id,
            'subject' => $grade->subject?->name,
            'score' => $grade->score,
            'grade' => $grade->grade,
            'assessment_type' => $grade->assessment_type,
            'date' => $grade->created_at->format('Y-m-d'),
            'teacher' => $grade->teacher?->name,
        ])->toArray();

        return Inertia::render('Parent/ChildGrades', [
            'child' => [
                'id' => $student->id,
                'name' => $student->name,
                'class' => $student->class?->name,
            ],
            'grades' => $grades_data,
            'pagination' => [
                'current_page' => $grades->currentPage(),
                'last_page' => $grades->lastPage(),
                'total' => $grades->total(),
                'per_page' => $grades->perPage(),
            ]
        ]);
    }

    /**
     * Show child's attendance
     */
    public function childAttendance(Student $student)
    {
        $user = Auth::user();
        $parent = $user->parentProfile;

        if (!$parent->students()->where('student_id', $student->id)->exists()) {
            abort(403, 'Unauthorized');
        }

        $attendances = $student->attendances()
            ->latest()
            ->paginate(20);

        $attendance_data = $attendances->map(fn($att) => [
            'id' => $att->id,
            'date' => $att->attendance_date->format('Y-m-d'),
            'status' => $att->status,
            'time_in' => $att->time_in,
            'time_out' => $att->time_out,
            'notes' => $att->notes,
        ])->toArray();

        // Calculate statistics
        $total_attendance = $student->attendances()->count();
        $present_count = $student->attendances()->where('status', 'present')->count();
        $absent_count = $student->attendances()->where('status', 'absent')->count();
        $late_count = $student->attendances()->where('status', 'late')->count();

        $attendance_percentage = $total_attendance > 0 ? ($present_count / $total_attendance * 100) : 0;

        return Inertia::render('Parent/ChildAttendance', [
            'child' => [
                'id' => $student->id,
                'name' => $student->name,
                'class' => $student->class?->name,
            ],
            'attendances' => $attendance_data,
            'statistics' => [
                'total' => $total_attendance,
                'present' => $present_count,
                'absent' => $absent_count,
                'late' => $late_count,
                'percentage' => round($attendance_percentage, 2),
            ],
            'pagination' => [
                'current_page' => $attendances->currentPage(),
                'last_page' => $attendances->lastPage(),
                'total' => $attendances->total(),
                'per_page' => $attendances->perPage(),
            ]
        ]);
    }

    /**
     * Show communications/messages
     */
    public function communications()
    {
        $user = Auth::user();
        $parent = $user->parentProfile;

        if (!$parent) {
            abort(403, 'Unauthorized');
        }

        $communications = $parent->communications()
            ->with(['teacher', 'student'])
            ->latest()
            ->paginate(10);

        $communications_data = $communications->map(fn($comm) => [
            'id' => $comm->id,
            'teacher_name' => $comm->teacher?->name,
            'student_name' => $comm->student?->name,
            'subject' => $comm->subject,
            'message' => $comm->message,
            'date' => $comm->created_at->format('Y-m-d H:i'),
            'is_read' => $comm->is_read,
            'status' => $comm->status,
        ])->toArray();

        return Inertia::render('Parent/Communications', [
            'communications' => $communications_data,
            'pagination' => [
                'current_page' => $communications->currentPage(),
                'last_page' => $communications->lastPage(),
                'total' => $communications->total(),
                'per_page' => $communications->perPage(),
            ]
        ]);
    }

    /**
     * Show announcements
     */
    public function announcements()
    {
        $announcements = Announcement::latest()->paginate(15);

        $announcements_data = $announcements->map(fn($ann) => [
            'id' => $ann->id,
            'title' => $ann->title,
            'content' => $ann->content,
            'date' => $ann->created_at->format('Y-m-d'),
            'author' => $ann->author?->name,
            'category' => $ann->category,
        ])->toArray();

        return Inertia::render('Parent/Announcements', [
            'announcements' => $announcements_data,
            'pagination' => [
                'current_page' => $announcements->currentPage(),
                'last_page' => $announcements->lastPage(),
                'total' => $announcements->total(),
                'per_page' => $announcements->perPage(),
            ]
        ]);
    }

    /**
     * Show profile settings
     */
    public function profileSettings()
    {
        $user = Auth::user();
        $parent = $user->parentProfile;

        return Inertia::render('Parent/ProfileSettings', [
            'parent' => [
                'father_name' => $parent->father_name,
                'mother_name' => $parent->mother_name,
                'father_phone' => $parent->father_phone,
                'mother_phone' => $parent->mother_phone,
                'father_email' => $parent->father_email,
                'mother_email' => $parent->mother_email,
                'father_occupation' => $parent->father_occupation,
                'mother_occupation' => $parent->mother_occupation,
                'address' => $parent->address,
                'emergency_contact_name' => $parent->emergency_contact_name,
                'emergency_contact_phone' => $parent->emergency_contact_phone,
                'emergency_contact_relation' => $parent->emergency_contact_relation,
            ],
            'notification_preferences' => [
                'receive_grade_notifications' => $parent->receive_grade_notifications,
                'receive_attendance_notifications' => $parent->receive_attendance_notifications,
                'receive_behavior_notifications' => $parent->receive_behavior_notifications,
                'receive_announcement_notifications' => $parent->receive_announcement_notifications,
            ]
        ]);
    }

    /**
     * Update profile settings
     */
    public function updateProfileSettings(Request $request)
    {
        $user = Auth::user();
        $parent = $user->parentProfile;

        $validated = $request->validate([
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'father_phone' => 'nullable|string|max:20',
            'mother_phone' => 'nullable|string|max:20',
            'father_email' => 'nullable|email',
            'mother_email' => 'nullable|email',
            'father_occupation' => 'nullable|string|max:255',
            'mother_occupation' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relation' => 'nullable|string|max:255',
            'receive_grade_notifications' => 'boolean',
            'receive_attendance_notifications' => 'boolean',
            'receive_behavior_notifications' => 'boolean',
            'receive_announcement_notifications' => 'boolean',
        ]);

        $parent->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}
