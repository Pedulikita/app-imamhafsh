<?php

namespace App\Http\Controllers;

use App\Models\ProfilePage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ProfilePageController extends Controller
{
    public function index(): Response
    {
        $pages = ProfilePage::orderBy('id', 'desc')->paginate(15);

        return Inertia::render('Admin/ProfilePages/Index', [
            'pages' => $pages,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/ProfilePages/Create');
    }

    public function store(Request $request)
    {
        // Debug: Log incoming request data
        Log::info('ProfilePage store request', [
            'has_hero_image' => $request->hasFile('hero_image'),
            'has_content_image' => $request->hasFile('content_image'),
            'has_content_thumbnail' => $request->hasFile('content_thumbnail'),
            'has_sidebar_image' => $request->hasFile('sidebar_image'),
            'sidebar_colors' => [
                'bg' => $request->input('sidebar_bg_color'),
                'header' => $request->input('sidebar_header_color'),
                'title' => $request->input('sidebar_title')
            ]
        ]);

        // Normalize slug: trim, slugify, or set null to auto-generate
        $rawSlug = trim((string) $request->input('slug', ''));
        $normalizedSlug = $rawSlug !== '' ? Str::slug($rawSlug) : null;
        $request->merge(['slug' => $normalizedSlug]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:profile_pages,slug',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'hero_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'content_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'content_thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'sidebar_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'sidebar_bg_color' => 'nullable|string|max:50',
            'sidebar_header_color' => 'nullable|string|max:50',
            'sidebar_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        // Handle main image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('profile-pages', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        // Handle hero image
        if ($request->hasFile('hero_image')) {
            $path = $request->file('hero_image')->store('profile-pages/hero', 'public');
            $validated['hero_image'] = '/storage/' . $path;
        }

        // Handle content image
        if ($request->hasFile('content_image')) {
            $path = $request->file('content_image')->store('profile-pages/content', 'public');
            $validated['content_image'] = '/storage/' . $path;
        }

        // Handle content thumbnail
        if ($request->hasFile('content_thumbnail')) {
            $path = $request->file('content_thumbnail')->store('profile-pages/thumbnails', 'public');
            $validated['content_thumbnail'] = '/storage/' . $path;
        }

        // Handle sidebar image
        if ($request->hasFile('sidebar_image')) {
            $path = $request->file('sidebar_image')->store('profile-pages/sidebar', 'public');
            $validated['sidebar_image'] = '/storage/' . $path;
        }

        try {
            $created = ProfilePage::create($validated);
            Log::info('ProfilePage created', ['id' => $created->id, 'title' => $created->title, 'slug' => $created->slug]);
            return redirect('/admin/profile-pages')->with('success', 'Halaman profil berhasil dibuat.');
        } catch (\Throwable $e) {
            Log::error('Failed to create ProfilePage', [
                'message' => $e->getMessage(),
                'title' => $validated['title'] ?? null,
                'slug' => $validated['slug'] ?? null,
            ]);
            return back()->withErrors(['general' => 'Gagal menyimpan halaman.'])->withInput();
        }
    }

    public function edit(ProfilePage $profilePage): Response
    {
        return Inertia::render('Admin/ProfilePages/Edit', [
            'page' => $profilePage,
        ]);
    }

    public function update(Request $request, ProfilePage $profilePage)
    {
        // Debug: Log incoming request data
        Log::info('ProfilePage update request', [
            'id' => $profilePage->id,
            'has_hero_image' => $request->hasFile('hero_image'),
            'has_content_image' => $request->hasFile('content_image'),
            'has_content_thumbnail' => $request->hasFile('content_thumbnail'),
            'has_sidebar_image' => $request->hasFile('sidebar_image'),
            'sidebar_colors' => [
                'bg' => $request->input('sidebar_bg_color'),
                'header' => $request->input('sidebar_header_color'),
                'title' => $request->input('sidebar_title')
            ]
        ]);

        // Normalize slug: trim, slugify, or set null to auto-generate
        $rawSlug = trim((string) $request->input('slug', ''));
        $normalizedSlug = $rawSlug !== '' ? Str::slug($rawSlug) : null;
        $request->merge(['slug' => $normalizedSlug]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:profile_pages,slug,' . $profilePage->id,
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'hero_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'content_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'content_thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'sidebar_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'sidebar_bg_color' => 'nullable|string|max:50',
            'sidebar_header_color' => 'nullable|string|max:50',
            'sidebar_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        // Handle main image
        if ($request->hasFile('image')) {
            if ($profilePage->image) {
                $oldPath = str_replace('/storage/', '', $profilePage->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('profile-pages', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        // Handle hero image
        if ($request->hasFile('hero_image')) {
            if ($profilePage->hero_image) {
                $oldPath = str_replace('/storage/', '', $profilePage->hero_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('hero_image')->store('profile-pages/hero', 'public');
            $validated['hero_image'] = '/storage/' . $path;
        }

        // Handle content image
        if ($request->hasFile('content_image')) {
            if ($profilePage->content_image) {
                $oldPath = str_replace('/storage/', '', $profilePage->content_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('content_image')->store('profile-pages/content', 'public');
            $validated['content_image'] = '/storage/' . $path;
        }

        // Handle content thumbnail
        if ($request->hasFile('content_thumbnail')) {
            if ($profilePage->content_thumbnail) {
                $oldPath = str_replace('/storage/', '', $profilePage->content_thumbnail);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('content_thumbnail')->store('profile-pages/thumbnails', 'public');
            $validated['content_thumbnail'] = '/storage/' . $path;
        }

        // Handle sidebar image
        if ($request->hasFile('sidebar_image')) {
            if ($profilePage->sidebar_image) {
                $oldPath = str_replace('/storage/', '', $profilePage->sidebar_image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('sidebar_image')->store('profile-pages/sidebar', 'public');
            $validated['sidebar_image'] = '/storage/' . $path;
        }

        // Debug: Log the validated array before update
        Log::info('About to update ProfilePage', [
            'id' => $profilePage->id,
            'validated_data' => $validated,
            'file_paths' => [
                'hero_image' => $validated['hero_image'] ?? 'NOT_SET',
                'content_image' => $validated['content_image'] ?? 'NOT_SET',
                'content_thumbnail' => $validated['content_thumbnail'] ?? 'NOT_SET',
                'sidebar_image' => $validated['sidebar_image'] ?? 'NOT_SET'
            ]
        ]);

        try {
            $profilePage->update($validated);
            
            // Debug: Log after update
            $profilePage->refresh();
            Log::info('ProfilePage updated successfully', [
                'id' => $profilePage->id,
                'saved_paths' => [
                    'hero_image' => $profilePage->hero_image,
                    'content_image' => $profilePage->content_image,
                    'content_thumbnail' => $profilePage->content_thumbnail,
                    'sidebar_image' => $profilePage->sidebar_image
                ]
            ]);
            
            return redirect('/admin/profile-pages')->with('success', 'Halaman profil berhasil diperbarui.');
        } catch (\Throwable $e) {
            Log::error('Failed to update ProfilePage', [
                'message' => $e->getMessage(),
                'id' => $profilePage->id,
            ]);
            return back()->withErrors(['general' => 'Gagal memperbarui halaman.'])->withInput();
        }
    }

    public function destroy(ProfilePage $profilePage)
    {
        if ($profilePage->image) {
            $path = str_replace('/storage/', '', $profilePage->image);
            Storage::disk('public')->delete($path);
        }

        $profilePage->delete();

        return redirect('/admin/profile-pages')->with('success', 'Halaman profil berhasil dihapus.');
    }

    public function show($slug): Response
    {
        $page = ProfilePage::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('public/profile-page', [
            'page' => $page,
        ]);
    }
}
