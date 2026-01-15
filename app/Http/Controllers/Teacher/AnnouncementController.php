<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function index()
    {
        return Inertia::render('Teacher/Announcements/Index', [
            'announcements' => [],
            'stats' => [
                'total_announcements' => 0,
                'published_announcements' => 0,
                'draft_announcements' => 0,
            ]
        ]);
    }
}
