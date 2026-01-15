<?php

namespace App\Http\Controllers;

use App\Models\TeacherProfile;
use App\Models\User;
use App\Models\Subject;
use App\Models\GradeLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TeacherProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $teacherProfiles = TeacherProfile::with(['user', 'subjects'])
            ->where('is_active', true)
            ->paginate(15);

        return Inertia::render('Admin/TeacherProfiles/Index', [
            'teacherProfiles' => $teacherProfiles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $users = User::whereDoesntHave('teacherProfile')
            ->whereHas('roles', function($query) {
                $query->where('name', 'teacher');
            })
            ->get(['id', 'name', 'email']);

        $subjects = Subject::all(['id', 'name', 'code']);
        $gradeLevels = GradeLevel::all(['id', 'name', 'level']);

        return Inertia::render('Admin/TeacherProfiles/Create', [
            'users' => $users,
            'subjects' => $subjects,
            'gradeLevels' => $gradeLevels,
            'employmentStatuses' => ['permanent', 'contract', 'temporary', 'honorary'],
            'educationLevels' => ['D3', 'S1', 'S2', 'S3'],
            'genderOptions' => ['male', 'female'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:teacher_profiles',
            'nip' => 'nullable|string|max:255|unique:teacher_profiles',
            'employee_id' => 'nullable|string|max:255|unique:teacher_profiles',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female',
            'education_level' => 'nullable|string|max:255',
            'major' => 'nullable|string|max:255',
            'employment_status' => 'required|in:permanent,contract,temporary,honorary',
            'start_date' => 'nullable|date',
            'certifications' => 'nullable|array',
            'teaching_subjects' => 'nullable|array',
            'teaching_subjects.*' => 'exists:subjects,id',
            'grade_levels_taught' => 'nullable|array',
            'grade_levels_taught.*' => 'exists:grade_levels,id',
            'max_classes_capacity' => 'required|integer|min:1|max:20',
            'notes' => 'nullable|string',
            'profile_photo' => 'nullable|string',
        ]);

        $teacherProfile = TeacherProfile::create($validated);

        if (!empty($validated['teaching_subjects'])) {
            $teacherProfile->subjects()->sync($validated['teaching_subjects']);
        }

        return redirect()->route('admin.teacher-profiles.index')
            ->with('success', 'Teacher profile created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TeacherProfile $teacherProfile): Response
    {
        $teacherProfile->load(['user', 'subjects', 'assignedClasses']);

        return Inertia::render('Admin/TeacherProfiles/Show', [
            'teacherProfile' => $teacherProfile,
            'classCount' => $teacherProfile->assignedClasses()->count(),
            'hasCapacity' => $teacherProfile->hasCapacityForMoreClasses(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TeacherProfile $teacherProfile): Response
    {
        $teacherProfile->load(['user', 'subjects']);
        $subjects = Subject::all(['id', 'name', 'code']);
        $gradeLevels = GradeLevel::all(['id', 'name', 'level']);

        return Inertia::render('Admin/TeacherProfiles/Edit', [
            'teacherProfile' => $teacherProfile,
            'subjects' => $subjects,
            'gradeLevels' => $gradeLevels,
            'employmentStatuses' => ['permanent', 'contract', 'temporary', 'honorary'],
            'educationLevels' => ['D3', 'S1', 'S2', 'S3'],
            'genderOptions' => ['male', 'female'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TeacherProfile $teacherProfile): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => ['nullable', 'string', 'max:255', Rule::unique('teacher_profiles')->ignore($teacherProfile->id)],
            'employee_id' => ['nullable', 'string', 'max:255', Rule::unique('teacher_profiles')->ignore($teacherProfile->id)],
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female',
            'education_level' => 'nullable|string|max:255',
            'major' => 'nullable|string|max:255',
            'employment_status' => 'required|in:permanent,contract,temporary,honorary',
            'start_date' => 'nullable|date',
            'certifications' => 'nullable|array',
            'teaching_subjects' => 'nullable|array',
            'teaching_subjects.*' => 'exists:subjects,id',
            'grade_levels_taught' => 'nullable|array',
            'grade_levels_taught.*' => 'exists:grade_levels,id',
            'max_classes_capacity' => 'required|integer|min:1|max:20',
            'is_active' => 'boolean',
            'notes' => 'nullable|string',
            'profile_photo' => 'nullable|string',
        ]);

        $teacherProfile->update($validated);

        if (isset($validated['teaching_subjects'])) {
            $teacherProfile->subjects()->sync($validated['teaching_subjects']);
        }

        return redirect()->route('admin.teacher-profiles.index')
            ->with('success', 'Teacher profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeacherProfile $teacherProfile): RedirectResponse
    {
        // Soft delete by setting is_active to false
        $teacherProfile->update(['is_active' => false]);

        return redirect()->route('admin.teacher-profiles.index')
            ->with('success', 'Teacher profile deactivated successfully.');
    }

    /**
     * Show current user's teacher profile.
     */
    public function profile(): Response
    {
        $user = Auth::user();
        
        if (!$user->isTeacher()) {
            abort(403, 'Access denied. Teacher role required.');
        }

        $teacherProfile = $user->teacherProfile;
        
        if (!$teacherProfile) {
            // Create empty profile if doesn't exist
            $teacherProfile = $user->teacherProfile()->create([
                'employment_status' => 'contract',
                'max_classes_capacity' => 5,
            ]);
        }

        $teacherProfile->load(['subjects', 'assignedClasses']);
        $subjects = Subject::all(['id', 'name', 'code']);
        $gradeLevels = GradeLevel::all(['id', 'name', 'level']);

        return Inertia::render('Teacher/Profile', [
            'teacherProfile' => $teacherProfile,
            'subjects' => $subjects,
            'gradeLevels' => $gradeLevels,
            'employmentStatuses' => ['permanent', 'contract', 'temporary', 'honorary'],
            'educationLevels' => ['D3', 'S1', 'S2', 'S3'],
            'genderOptions' => ['male', 'female'],
            'classCount' => $teacherProfile->assignedClasses()->count(),
            'hasCapacity' => $teacherProfile->hasCapacityForMoreClasses(),
        ]);
    }

    /**
     * Update current user's teacher profile.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        if (!$user->isTeacher()) {
            abort(403, 'Access denied. Teacher role required.');
        }

        $teacherProfile = $user->teacherProfile;
        
        if (!$teacherProfile) {
            abort(404, 'Teacher profile not found.');
        }

        $validated = $request->validate([
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female',
            'education_level' => 'nullable|string|max:255',
            'major' => 'nullable|string|max:255',
            'certifications' => 'nullable|array',
            'profile_photo' => 'nullable|string',
        ]);

        $teacherProfile->update($validated);

        return redirect()->route('teacher.profile')
            ->with('success', 'Profile updated successfully.');
    }
}