<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category' => 'required|string|max:255',
            'badge' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $validated['image'] = 'storage/' . $path;
        }

        $validated['badge'] = $validated['badge'] ?? 'PROJECT';

        Project::create($validated);

        return redirect('/admin/projects')->with('success', 'Project created successfully.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category' => 'required|string|max:255',
            'badge' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($project->image && file_exists(public_path($project->image))) {
                unlink(public_path($project->image));
            }
            
            $path = $request->file('image')->store('projects', 'public');
            $validated['image'] = 'storage/' . $path;
        } else {
            unset($validated['image']);
        }

        $project->update($validated);

        return redirect('/admin/projects')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        if ($project->image && file_exists(public_path($project->image))) {
            unlink(public_path($project->image));
        }

        $project->delete();

        return redirect('/admin/projects')->with('success', 'Project deleted successfully.');
    }
}
