<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Activities/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('activities', 'public');
            $validated['image'] = 'storage/' . $path;
        }

        Activity::create($validated);

        return redirect('/admin/activities')->with('success', 'Activity created successfully.');
    }

    public function edit(Activity $activity)
    {
        return Inertia::render('Admin/Activities/Edit', [
            'activity' => $activity,
        ]);
    }

    public function update(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($activity->image && file_exists(public_path($activity->image))) {
                unlink(public_path($activity->image));
            }
            
            $path = $request->file('image')->store('activities', 'public');
            $validated['image'] = 'storage/' . $path;
        } else {
            unset($validated['image']);
        }

        $activity->update($validated);

        return redirect('/admin/activities')->with('success', 'Activity updated successfully.');
    }

    public function destroy(Activity $activity)
    {
        if ($activity->image && file_exists(public_path($activity->image))) {
            unlink(public_path($activity->image));
        }

        $activity->delete();

        return redirect('/admin/activities')->with('success', 'Activity deleted successfully.');
    }
}
