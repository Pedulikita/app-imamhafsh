<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Facility::class);

        $facilities = Facility::ordered()->paginate(15);

        return Inertia::render('Admin/Facilities/Index', [
            'facilities' => $facilities,
            'categories' => Facility::getCategories(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Facility::class);

        return Inertia::render('Admin/Facilities/Create', [
            'categories' => Facility::getCategories(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Facility::class);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'category' => ['required', 'string', 'in:' . implode(',', Facility::getCategories())],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Store the uploaded file
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('facilities', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        Facility::create($validated);

        return redirect()->route('admin.facilities.index')->with('success', 'Fasilitas berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Facility $facility)
    {
        $this->authorize('view', $facility);

        return Inertia::render('Admin/Facilities/Show', [
            'facility' => $facility,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Facility $facility)
    {
        $this->authorize('update', $facility);

        return Inertia::render('Admin/Facilities/Edit', [
            'facility' => $facility,
            'categories' => Facility::getCategories(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Facility $facility)
    {
        $this->authorize('update', $facility);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'category' => ['required', 'string', 'in:' . implode(',', Facility::getCategories())],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Store the new file if provided
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('facilities', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $facility->update($validated);

        return redirect()->route('admin.facilities.index')->with('success', 'Fasilitas berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Facility $facility)
    {
        $this->authorize('delete', $facility);

        $facility->delete();

        return redirect()->route('admin.facilities.index')->with('success', 'Fasilitas berhasil dihapus');
    }

    /**
     * Toggle the active status of a facility.
     */
    public function toggleActive(Request $request, Facility $facility)
    {
        $this->authorize('update', $facility);

        $facility->update([
            'is_active' => !$facility->is_active,
        ]);

        return back()->with('success', 'Status fasilitas berhasil diperbarui');
    }
}
