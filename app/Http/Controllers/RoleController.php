<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    /**
     * Display roles list.
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')->get();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show create role form.
     */
    public function create(): Response
    {
        $permissions = Permission::all()->groupBy('group');
        $users = User::all(['id', 'name', 'email', 'email_verified_at']);

        return Inertia::render('Admin/Roles/Create', [
            'permissions' => $permissions,
            'users' => $users,
        ]);
    }

    /**
     * Store new role.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
            'users' => 'array',
            'users.*' => 'exists:users,id',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        if ($request->has('users')) {
            $users = User::whereIn('id', $request->users)->get();
            foreach ($users as $user) {
                $user->roles()->syncWithoutDetaching([$role->id]);
            }
        }

        return redirect()->route('roles.index')->with('success', 'Role berhasil ditambahkan!');
    }

    /**
     * Show edit role form.
     */
    public function edit(Role $role): Response
    {
        $role->load('permissions');
        $permissions = Permission::all()->groupBy('group');

        return Inertia::render('Admin/Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update role.
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return redirect()->route('roles.index')->with('success', 'Role berhasil diupdate!');
    }

    /**
     * Delete role.
     */
    public function destroy(Role $role)
    {
        if ($role->name === 'super_admin') {
            return back()->with('error', 'Cannot delete super admin role');
        }

        $role->delete();

        return back()->with('success', 'Role berhasil dihapus!');
    }

    /**
     * Assign role to user.
     */
    public function assignToUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->roles()->syncWithoutDetaching([$request->role_id]);

        return back()->with('success', 'Role berhasil diberikan!');
    }

    /**
     * Remove role from user.
     */
    public function removeFromUser(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->roles()->detach($request->role_id);

        return back()->with('success', 'Role berhasil dihapus dari user!');
    }
}
