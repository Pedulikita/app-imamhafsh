<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display a listing of pages.
     */
    public function index(Request $request): Response
    {
        $query = Page::with(['creator', 'updater'])->orderBy('order');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $pages = $query->paginate(15);

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new page.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Pages/Create');
    }

    /**
     * Store a newly created page.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:pages,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'order' => 'nullable|integer',
            'is_homepage' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id();

        if ($validated['status'] === 'published' && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $page = Page::create($validated);

        return redirect()->route('pages.edit', $page)->with('success', 'Page created successfully');
    }

    /**
     * Show the form for editing the specified page.
     */
    public function edit(Page $page): Response
    {
        $page->load(['creator', 'updater']);

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    /**
     * Update the specified page.
     */
    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:pages,slug,' . $page->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'order' => 'nullable|integer',
            'is_homepage' => 'boolean',
        ]);

        $validated['updated_by'] = auth()->id();

        if ($validated['status'] === 'published' && !$page->published_at) {
            $validated['published_at'] = now();
        }

        $page->update($validated);

        return back()->with('success', 'Page updated successfully');
    }

    /**
     * Remove the specified page.
     */
    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('pages.index')->with('success', 'Page deleted successfully');
    }

    /**
     * Display the specified page (public view).
     */
    public function show(string $slug): Response
    {
        $page = Page::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('Public/Page', [
            'page' => $page,
        ]);
    }
}
