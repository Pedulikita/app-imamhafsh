<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    /**
     * Display permissions list.
     */
    public function index(): Response
    {
        $permissions = Permission::all()->groupBy('group');

        return Inertia::render('Admin/Permissions/Index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show create permission form.
     */
    public function create(): Response
    {
        return Inertia::render('Permissions/Create');
    }

    /**
     * Store new permission.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'group' => 'nullable|string|max:255',
        ]);

        Permission::create($request->all());

        return redirect()->route('permissions.index')->with('success', 'Permission berhasil ditambahkan!');
    }

    /**
     * Show edit permission form.
     */
    public function edit(Permission $permission): Response
    {
        return Inertia::render('Permissions/Edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update permission.
     */
    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'group' => 'nullable|string|max:255',
        ]);

        $permission->update($request->all());

        return redirect()->route('permissions.index')->with('success', 'Permission berhasil diupdate!');
    }

    /**
     * Delete permission.
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();

        return back()->with('success', 'Permission berhasil dihapus!');
    }
}
