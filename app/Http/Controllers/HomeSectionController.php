<?php

namespace App\Http\Controllers;

use App\Models\HomeSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeSectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sections = HomeSection::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/HomeSections/Index', [
            'sections' => $sections,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/HomeSections/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_key' => 'required|string|unique:home_sections,section_key|max:255|in:about,alasan,pendidikan,galeri,artikel',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'image_alt' => 'nullable|string|max:255',
            'badge_text' => 'nullable|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'list_items' => 'nullable|string',
            'meta' => 'nullable|array',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        // Parse list_items (one item per line) into array
        if (!empty($validated['list_items'])) {
            $listArray = array_filter(array_map('trim', explode("\n", $validated['list_items'])));
            $validated['meta'] = ['list_items' => array_values($listArray)];
        }
        unset($validated['list_items']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('home-sections', 'public');
            $validated['image'] = $path; // Store tanpa prefix /storage/
        }

        HomeSection::create($validated);

        return redirect()
            ->route('home-sections.index')
            ->with('success', 'Home section created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HomeSection $homeSection)
    {
        return Inertia::render('Admin/HomeSections/Edit', [
            'section' => $homeSection,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HomeSection $homeSection)
    {
        $validated = $request->validate([
            'section_key' => 'required|string|max:255|unique:home_sections,section_key,' . $homeSection->id . '|in:about,alasan,pendidikan,galeri,artikel',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'image_alt' => 'nullable|string|max:255',
            'badge_text' => 'nullable|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
            'list_items' => 'nullable|string',
            'meta' => 'nullable|array',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        // Parse list_items into array
        if (!empty($validated['list_items'])) {
            $listArray = array_filter(array_map('trim', explode("\n", $validated['list_items'])));
            $validated['meta'] = ['list_items' => array_values($listArray)];
        } elseif (array_key_exists('list_items', $validated)) {
            // Clear list_items if empty
            $validated['meta'] = ['list_items' => []];
        }
        unset($validated['list_items']);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($homeSection->image && Storage::disk('public')->exists($homeSection->image)) {
                Storage::disk('public')->delete($homeSection->image);
            }

            $path = $request->file('image')->store('home-sections', 'public');
            $validated['image'] = $path; // Store tanpa prefix /storage/
        } else {
            // Keep existing image if no new file uploaded
            unset($validated['image']);
        }

        $homeSection->update($validated);

        return redirect()
            ->route('home-sections.index')
            ->with('success', 'Home section updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HomeSection $homeSection)
    {
        // Delete image if exists from Storage
        if ($homeSection->image && Storage::disk('public')->exists($homeSection->image)) {
            Storage::disk('public')->delete($homeSection->image);
        }

        $homeSection->delete();

        return redirect()
            ->route('home-sections.index')
            ->with('success', 'Home section deleted successfully.');
    }
}
