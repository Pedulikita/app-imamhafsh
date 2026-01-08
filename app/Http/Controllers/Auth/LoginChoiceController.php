<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginChoiceController extends Controller
{
    public function show()
    {
        return Inertia::render('auth/LoginChoice');
    }
}