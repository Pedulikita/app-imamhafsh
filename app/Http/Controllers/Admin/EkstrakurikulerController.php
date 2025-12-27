<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EkstrakurikulerItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EkstrakurikulerController extends Controller
{
    public function index()
    {
        $ekstrakurikulers = EkstrakurikulerItem::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Ekstrakurikulers/Index', [
            'ekstrakurikulers' => $ekstrakurikulers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Ekstrakurikulers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        EkstrakurikulerItem::create($validated);

        return redirect('/admin/ekstrakurikulers')->with('success', 'Ekstrakurikuler created successfully.');
    }

    public function edit(EkstrakurikulerItem $ekstrakurikuler)
    {
        return Inertia::render('Admin/Ekstrakurikulers/Edit', [
            'ekstrakurikuler' => $ekstrakurikuler,
        ]);
    }

    public function update(Request $request, EkstrakurikulerItem $ekstrakurikuler)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $ekstrakurikuler->update($validated);

        return redirect('/admin/ekstrakurikulers')->with('success', 'Ekstrakurikuler updated successfully.');
    }

    public function destroy(EkstrakurikulerItem $ekstrakurikuler)
    {
        $ekstrakurikuler->delete();

        return redirect('/admin/ekstrakurikulers')->with('success', 'Ekstrakurikuler deleted successfully.');
    }
}
