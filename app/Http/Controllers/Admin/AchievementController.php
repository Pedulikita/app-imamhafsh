<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AchievementController extends Controller
{
    public function index()
    {
        $achievements = Achievement::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Achievements/Index', [
            'achievements' => $achievements,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Achievements/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('achievements', 'public');
            $validated['image'] = 'storage/' . $path;
        }

        Achievement::create($validated);

        return redirect('/admin/achievements')->with('success', 'Achievement created successfully.');
    }

    public function edit(Achievement $achievement)
    {
        return Inertia::render('Admin/Achievements/Edit', [
            'achievement' => $achievement,
        ]);
    }

    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($achievement->image && file_exists(public_path($achievement->image))) {
                unlink(public_path($achievement->image));
            }
            
            $path = $request->file('image')->store('achievements', 'public');
            $validated['image'] = 'storage/' . $path;
        } else {
            unset($validated['image']);
        }

        $achievement->update($validated);

        return redirect('/admin/achievements')->with('success', 'Achievement updated successfully.');
    }

    public function destroy(Achievement $achievement)
    {
        if ($achievement->image && file_exists(public_path($achievement->image))) {
            unlink(public_path($achievement->image));
        }

        $achievement->delete();

        return redirect('/admin/achievements')->with('success', 'Achievement deleted successfully.');
    }
}
