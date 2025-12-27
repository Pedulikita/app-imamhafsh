<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeamMemberController extends Controller
{
    public function index()
    {
        $teamMembers = TeamMember::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/TeamMembers/Index', [
            'teamMembers' => $teamMembers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/TeamMembers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category' => ['required', Rule::in(['Pembina', 'Director', 'Head', 'Manager', 'Staff'])],
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('team-members', 'public');
            $validated['image'] = 'storage/' . $path;
        }

        TeamMember::create($validated);

        return redirect('/admin/team-members')->with('success', 'Team member created successfully.');
    }

    public function edit(TeamMember $teamMember)
    {
        return Inertia::render('Admin/TeamMembers/Edit', [
            'teamMember' => $teamMember,
        ]);
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category' => ['required', Rule::in(['Pembina', 'Director', 'Head', 'Manager', 'Staff'])],
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($teamMember->image && file_exists(public_path($teamMember->image))) {
                unlink(public_path($teamMember->image));
            }
            
            $path = $request->file('image')->store('team-members', 'public');
            $validated['image'] = 'storage/' . $path;
        } else {
            unset($validated['image']);
        }

        $teamMember->update($validated);

        return redirect('/admin/team-members')->with('success', 'Team member updated successfully.');
    }

    public function destroy(TeamMember $teamMember)
    {
        if ($teamMember->image && file_exists(public_path($teamMember->image))) {
            unlink(public_path($teamMember->image));
        }

        $teamMember->delete();

        return redirect('/admin/team-members')->with('success', 'Team member deleted successfully.');
    }
}
