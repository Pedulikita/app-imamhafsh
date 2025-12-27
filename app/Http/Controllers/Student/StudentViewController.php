<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentViewController extends Controller
{
    public function assignments()
    {
        return Inertia::render('Student/Assignments');
    }

    public function grades()
    {
        return Inertia::render('Student/Grades');
    }

    public function schedule()
    {
        return Inertia::render('Student/Schedule');
    }

    public function attendance()
    {
        return Inertia::render('Student/Attendance');
    }

    public function exams()
    {
        return Inertia::render('Student/Exams');
    }
}