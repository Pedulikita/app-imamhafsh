<?php

namespace App\Http\Controllers;

use App\Http\Requests\LiterasiContentRequest;
use App\Models\LiterasiContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LiterasiContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contents = LiterasiContent::latest()->get();
        
        return Inertia::render('Admin/LiterasiContent/Index', [
            'contents' => $contents,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/LiterasiContent/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LiterasiContentRequest $request)
    {
        $validated = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('literasi', 'public');
            $validated['image_path'] = $path;
        }
        
        // Remove image file from validated data to avoid column error
        unset($validated['image']);
        
        LiterasiContent::create($validated);

        return redirect()->route('literasi-content.index')
            ->with('success', 'Literasi content created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LiterasiContent $literasiContent)
    {
        return Inertia::render('Admin/LiterasiContent/Edit', [
            'content' => $literasiContent,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LiterasiContentRequest $request, LiterasiContent $literasiContent)
    {
        $validated = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($literasiContent->image_path && \Storage::disk('public')->exists($literasiContent->image_path)) {
                \Storage::disk('public')->delete($literasiContent->image_path);
            }
            
            $path = $request->file('image')->store('literasi', 'public');
            $validated['image_path'] = $path;
        } else {
            // Keep existing image if no new file uploaded
            unset($validated['image_path']);
        }
        
        // Remove image file from validated data
        unset($validated['image']);
        
        $literasiContent->update($validated);

        return redirect()->route('literasi-content.index')
            ->with('success', 'Literasi content updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LiterasiContent $literasiContent)
    {
        // Delete image if exists
        if ($literasiContent->image_path && \Storage::disk('public')->exists($literasiContent->image_path)) {
            \Storage::disk('public')->delete($literasiContent->image_path);
        }
        
        $literasiContent->delete();

        return redirect()->route('literasi-content.index')
            ->with('success', 'Literasi content deleted successfully.');
    }
}