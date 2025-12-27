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
        LiterasiContent::create($request->validated());

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
        $literasiContent->update($request->validated());

        return redirect()->route('literasi-content.index')
            ->with('success', 'Literasi content updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LiterasiContent $literasiContent)
    {
        $literasiContent->delete();

        return redirect()->route('literasi-content.index')
            ->with('success', 'Literasi content deleted successfully.');
    }
}