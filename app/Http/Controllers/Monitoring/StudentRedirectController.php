<?php

namespace App\Http\Controllers\Monitoring;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StudentRedirectController extends Controller
{
    public function index()
    {
        return redirect()->route('monitoring.student-management.index');
    }

    public function create()
    {
        return redirect()->route('monitoring.student-management.create');
    }

    public function show($id)
    {
        return redirect()->route('monitoring.student-management.show', $id);
    }

    public function edit($id)
    {
        return redirect()->route('monitoring.student-management.edit', $id);
    }
}