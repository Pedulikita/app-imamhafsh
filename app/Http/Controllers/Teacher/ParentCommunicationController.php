<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ParentCommunicationController extends Controller
{
    public function index()
    {
        return Inertia::render('Teacher/ParentCommunication/Index', [
            'communications' => [],
            'students_with_parents' => [],
            'recent_activities' => [],
            'stats' => [
                'total_parents' => 0,
                'active_communications' => 0,
                'pending_responses' => 0,
                'messages_this_month' => 0,
            ]
        ]);
    }
}
