<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Redirect based on user role
        if ($user->hasRole('teacher')) {
            return redirect()->route('teacher.dashboard');
        } elseif ($user->hasRole('student')) {
            return redirect()->route('student.dashboard');
        } elseif ($user->hasRole('super_admin') || $user->hasRole('editor')) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->hasRole('penulis')) {
            return Inertia::render('dashboard');
        }
        
        // Default dashboard for regular users
        return Inertia::render('dashboard');
    }
}