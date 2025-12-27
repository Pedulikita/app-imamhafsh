<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        return Inertia::render('Teacher/Messages/Index', [
            'messages' => [],
            'conversations' => [],
            'stats' => [
                'total_messages' => 0,
                'unread_messages' => 0,
                'new_messages_today' => 0,
            ]
        ]);
    }
}
