<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HeroSlideController extends Controller
{
    /**
     * Display a listing of hero slides.
     */
    public function index(): Response
    {
        $slides = HeroSlide::ordered()->get();

        return Inertia::render('Admin/HeroSlides/Index', [
            'slides' => $slides,
        ]);
    }

    /**
     * Show the form for creating a new hero slide.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/HeroSlides/Create');
    }

    /**
     * Store a newly created hero slide.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'required|image|max:2048', // 2MB max
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        // Upload image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/hero'), $imageName);
            $validated['image'] = 'images/hero/' . $imageName;
        }

        HeroSlide::create($validated);

        return redirect()->route('hero-slides.index')->with('success', 'Hero slide berhasil ditambahkan!');
    }

    /**
     * Show the form for editing the specified hero slide.
     */
    public function edit(HeroSlide $heroSlide): Response
    {
        return Inertia::render('Admin/HeroSlides/Edit', [
            'slide' => $heroSlide,
        ]);
    }

    /**
     * Update the specified hero slide.
     */
    public function update(Request $request, HeroSlide $heroSlide)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        // Upload new image if provided
        if ($request->hasFile('image')) {
            // Delete old image
            if ($heroSlide->image && file_exists(public_path($heroSlide->image))) {
                unlink(public_path($heroSlide->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/hero'), $imageName);
            $validated['image'] = 'images/hero/' . $imageName;
        }

        $heroSlide->update($validated);

        return redirect()->route('hero-slides.index')->with('success', 'Hero slide berhasil diupdate!');
    }

    /**
     * Remove the specified hero slide.
     */
    public function destroy(HeroSlide $heroSlide)
    {
        // Delete image file
        if ($heroSlide->image && file_exists(public_path($heroSlide->image))) {
            unlink(public_path($heroSlide->image));
        }

        $heroSlide->delete();

        return redirect()->route('hero-slides.index')->with('success', 'Hero slide berhasil dihapus!');
    }

    /**
     * Get active hero slides for public display.
     */
    public function getActive()
    {
        return HeroSlide::active()->ordered()->get();
    }
}
