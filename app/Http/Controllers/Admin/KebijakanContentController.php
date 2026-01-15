<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KebijakanContent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class KebijakanContentController extends Controller
{
    public function index()
    {
        $contents = KebijakanContent::orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($content) {
                return [
                    'id' => $content->id,
                    'hero_badge' => $content->hero_badge,
                    'hero_title' => $content->hero_title,
                    'hero_subtitle' => $content->hero_subtitle,
                    'hero_image' => $content->hero_image_url,
                    'is_active' => $content->is_active,
                    'order' => $content->order,
                ];
            });

        return Inertia::render('Admin/KebijakanContent/Index', [
            'contents' => $contents,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/KebijakanContent/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hero_badge' => 'required|string|max:255',
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'nullable|string',
            'hero_image' => 'nullable|image|max:2048',
            'intro_title' => 'nullable|string|max:255',
            'intro_content' => 'nullable|string',
            'bullying_title' => 'nullable|string|max:255',
            'bullying_content' => 'nullable|string',
            'bullying_points' => 'nullable|array',
            'bullying_image' => 'nullable|image|max:2048',
            'lgbt_title' => 'nullable|string|max:255',
            'lgbt_content' => 'nullable|string',
            'lgbt_points' => 'nullable|array',
            'lgbt_image' => 'nullable|image|max:2048',
            'environment_title' => 'nullable|string|max:255',
            'environment_content' => 'nullable|string',
            'environment_features' => 'nullable|array',
            'environment_image' => 'nullable|image|max:2048',
            'commitment_title' => 'nullable|string|max:255',
            'commitment_content' => 'nullable|string',
            'commitment_items' => 'nullable|array',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        // Handle image uploads
        if ($request->hasFile('hero_image')) {
            $validated['hero_image'] = $request->file('hero_image')->store('kebijakan', 'public');
        }

        if ($request->hasFile('bullying_image')) {
            $validated['bullying_image'] = $request->file('bullying_image')->store('kebijakan', 'public');
        }

        if ($request->hasFile('lgbt_image')) {
            $validated['lgbt_image'] = $request->file('lgbt_image')->store('kebijakan', 'public');
        }

        if ($request->hasFile('environment_image')) {
            $validated['environment_image'] = $request->file('environment_image')->store('kebijakan', 'public');
        }

        KebijakanContent::create($validated);

        return redirect()->route('admin.kebijakan-content.index')
            ->with('success', 'Konten kebijakan berhasil dibuat.');
    }

    public function edit(KebijakanContent $kebijakanContent)
    {
        return Inertia::render('Admin/KebijakanContent/Edit', [
            'content' => [
                'id' => $kebijakanContent->id,
                'hero_badge' => $kebijakanContent->hero_badge,
                'hero_title' => $kebijakanContent->hero_title,
                'hero_subtitle' => $kebijakanContent->hero_subtitle,
                'hero_image' => $kebijakanContent->hero_image_url,
                'intro_title' => $kebijakanContent->intro_title,
                'intro_content' => $kebijakanContent->intro_content,
                'bullying_title' => $kebijakanContent->bullying_title,
                'bullying_content' => $kebijakanContent->bullying_content,
                'bullying_points' => $kebijakanContent->bullying_points,
                'bullying_image' => $kebijakanContent->bullying_image_url,
                'lgbt_title' => $kebijakanContent->lgbt_title,
                'lgbt_content' => $kebijakanContent->lgbt_content,
                'lgbt_points' => $kebijakanContent->lgbt_points,
                'lgbt_image' => $kebijakanContent->lgbt_image_url,
                'environment_title' => $kebijakanContent->environment_title,
                'environment_content' => $kebijakanContent->environment_content,
                'environment_features' => $kebijakanContent->environment_features,
                'environment_image' => $kebijakanContent->environment_image_url,
                'commitment_title' => $kebijakanContent->commitment_title,
                'commitment_content' => $kebijakanContent->commitment_content,
                'commitment_items' => $kebijakanContent->commitment_items,
                'order' => $kebijakanContent->order,
                'is_active' => $kebijakanContent->is_active,
            ],
        ]);
    }

    public function update(Request $request, KebijakanContent $kebijakanContent)
    {
        $validated = $request->validate([
            'hero_badge' => 'required|string|max:255',
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'nullable|string',
            'hero_image' => 'nullable|image|max:2048',
            'intro_title' => 'nullable|string|max:255',
            'intro_content' => 'nullable|string',
            'bullying_title' => 'nullable|string|max:255',
            'bullying_content' => 'nullable|string',
            'bullying_points' => 'nullable|array',
            'bullying_image' => 'nullable|image|max:2048',
            'lgbt_title' => 'nullable|string|max:255',
            'lgbt_content' => 'nullable|string',
            'lgbt_points' => 'nullable|array',
            'lgbt_image' => 'nullable|image|max:2048',
            'environment_title' => 'nullable|string|max:255',
            'environment_content' => 'nullable|string',
            'environment_features' => 'nullable|array',
            'environment_image' => 'nullable|image|max:2048',
            'commitment_title' => 'nullable|string|max:255',
            'commitment_content' => 'nullable|string',
            'commitment_items' => 'nullable|array',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        // Handle image uploads
        if ($request->hasFile('hero_image')) {
            if ($kebijakanContent->hero_image) {
                Storage::disk('public')->delete($kebijakanContent->hero_image);
            }
            $validated['hero_image'] = $request->file('hero_image')->store('kebijakan', 'public');
        }

        if ($request->hasFile('bullying_image')) {
            if ($kebijakanContent->bullying_image) {
                Storage::disk('public')->delete($kebijakanContent->bullying_image);
            }
            $validated['bullying_image'] = $request->file('bullying_image')->store('kebijakan', 'public');
        }

        if ($request->hasFile('lgbt_image')) {
            if ($kebijakanContent->lgbt_image) {
                Storage::disk('public')->delete($kebijakanContent->lgbt_image);
            }
            $validated['lgbt_image'] = $request->file('lgbt_image')->store('kebijakan', 'public');
        }

        if ($request->hasFile('environment_image')) {
            if ($kebijakanContent->environment_image) {
                Storage::disk('public')->delete($kebijakanContent->environment_image);
            }
            $validated['environment_image'] = $request->file('environment_image')->store('kebijakan', 'public');
        }

        $kebijakanContent->update($validated);

        return redirect()->route('admin.kebijakan-content.index')
            ->with('success', 'Konten kebijakan berhasil diupdate.');
    }

    public function destroy(KebijakanContent $kebijakanContent)
    {
        // Delete associated images
        if ($kebijakanContent->hero_image) {
            Storage::disk('public')->delete($kebijakanContent->hero_image);
        }
        if ($kebijakanContent->bullying_image) {
            Storage::disk('public')->delete($kebijakanContent->bullying_image);
        }
        if ($kebijakanContent->lgbt_image) {
            Storage::disk('public')->delete($kebijakanContent->lgbt_image);
        }
        if ($kebijakanContent->environment_image) {
            Storage::disk('public')->delete($kebijakanContent->environment_image);
        }

        $kebijakanContent->delete();

        return redirect()->route('admin.kebijakan-content.index')
            ->with('success', 'Konten kebijakan berhasil dihapus.');
    }
}
