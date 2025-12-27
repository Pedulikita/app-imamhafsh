<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentAuthController extends Controller
{
    /**
     * Display the student login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/student-login', [
            'canResetPassword' => false,
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming student authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'class_name' => 'required|string',
            'student_id' => 'required|string',
        ], [
            'class_name.required' => 'Nama kelas wajib diisi.',
            'student_id.required' => 'Nomor ID siswa wajib diisi.',
        ]);

        // Find student by student_id and class
        $student = Student::where('student_id', $request->student_id)
                          ->where('class', $request->class_name)
                          ->where('status', 'active')
                          ->first();

        if (!$student) {
            throw ValidationException::withMessages([
                'student_id' => 'Nomor ID siswa atau nama kelas tidak valid.',
            ]);
        }

        // Find or create user for this student
        $user = User::where('email', $student->email ?? $student->student_id . '@student.local')->first();
        
        if (!$user) {
            // Create user account for student
            $user = User::create([
                'name' => $student->name,
                'email' => $student->email ?? $student->student_id . '@student.local',
                'password' => Hash::make($request->student_id), // Use student_id as password
                'email_verified_at' => now(), // Auto-verify student accounts
            ]);
            
            // Assign student role
            $studentRole = \App\Models\Role::where('name', 'student')->first();
            if ($studentRole) {
                $user->roles()->attach($studentRole->id);
            }
            
            Log::info('Created new student user account', [
                'student_id' => $student->student_id,
                'user_id' => $user->id
            ]);
        }

        // Update password if it's different (in case student_id changed)
        if (!Hash::check($request->student_id, $user->password)) {
            $user->update([
                'password' => Hash::make($request->student_id)
            ]);
        }

        // Ensure user has student role
        if (!$user->hasRole('student')) {
            $studentRole = \App\Models\Role::where('name', 'student')->first();
            if ($studentRole) {
                $user->roles()->attach($studentRole->id);
            }
        }

        // Log the user in
        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        Log::info('Student logged in successfully', [
            'student_id' => $student->student_id,
            'class' => $student->class,
            'user_id' => $user->id
        ]);

        return redirect()->intended(route('student.dashboard'));
    }

    /**
     * Destroy an authenticated session for student.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        if ($user && $user->role === 'student') {
            Log::info('Student logged out', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/student/login');
    }
}