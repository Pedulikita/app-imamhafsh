<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimony;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TestimonyController extends Controller
{
    public function index()
    {
        $testimonies = Testimony::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Testimonies/Index', [
            'testimonies' => $testimonies,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Testimonies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'text' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_featured' => 'boolean',
            'platform' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('testimonies', 'public');
            $validated['avatar'] = 'storage/' . $path;
        }

        Testimony::create($validated);

        return redirect('/admin/testimonies')->with('success', 'Testimony created successfully.');
    }

    public function edit(Testimony $testimony)
    {
        return Inertia::render('Admin/Testimonies/Edit', [
            'testimony' => $testimony,
        ]);
    }

    public function update(Request $request, Testimony $testimony)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'text' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_featured' => 'boolean',
            'platform' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('avatar')) {
            if ($testimony->avatar && file_exists(public_path($testimony->avatar))) {
                unlink(public_path($testimony->avatar));
            }
            
            $path = $request->file('avatar')->store('testimonies', 'public');
            $validated['avatar'] = 'storage/' . $path;
        } else {
            unset($validated['avatar']);
        }

        $testimony->update($validated);

        return redirect('/admin/testimonies')->with('success', 'Testimony updated successfully.');
    }

    public function destroy(Testimony $testimony)
    {
        if ($testimony->avatar && file_exists(public_path($testimony->avatar))) {
            unlink(public_path($testimony->avatar));
        }

        $testimony->delete();

        return redirect('/admin/testimonies')->with('success', 'Testimony deleted successfully.');
    }
}
