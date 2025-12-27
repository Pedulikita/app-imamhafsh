<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Services\ImageOptimizationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles.
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $query = Article::with(['author', 'reviewer', 'publisher', 'category']);

        // Filter based on user role
        if (!$user->canManageAllArticles()) {
            // Penulis hanya bisa lihat artikel mereka sendiri
            $query->byAuthor($user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $articles = $query->latest()->paginate(15);
        $categories = Category::active()->ordered()->get();

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => $request->only(['status', 'category_id', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new article.
     */
    public function create(): Response
    {
        $categories = Category::active()->ordered()->get();
        
        return Inertia::render('Admin/Articles/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:articles,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120', // Increased to 5MB
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,review,published,archived',
        ]);

        // Handle optimized image upload
        if ($request->hasFile('featured_image')) {
            $imageService = app(ImageOptimizationService::class);
            
            try {
                $optimizedImages = $imageService->processImage(
                    $request->file('featured_image'),
                    'articles',
                    [
                        'quality' => 85,
                        'max_width' => 1200,
                        'create_thumbnails' => true,
                        'create_social' => true,
                        'formats' => ['jpg', 'webp']
                    ]
                );
                
                // Store main image path and metadata
                $validated['featured_image'] = $optimizedImages['main']['jpg']['path'];
                $validated['image_metadata'] = json_encode([
                    'main' => $optimizedImages['main'],
                    'thumbnails' => $optimizedImages['thumbnails'] ?? [],
                    'social' => $optimizedImages['social'] ?? [],
                    'original_size' => $request->file('featured_image')->getSize(),
                    'optimized_at' => now()
                ]);
                
            } catch (\Exception $e) {
                \Log::error('Image optimization failed: ' . $e->getMessage());
                
                // Fallback to simple upload if optimization fails
                $path = $request->file('featured_image')->store('articles', 'public');
                $validated['featured_image'] = '/storage/' . $path;
                $validated['image_metadata'] = json_encode(['fallback' => true]);
            }
        }

        $validated['author_id'] = auth()->id();

        // Editor dan Super Admin bisa langsung publish
        if ($validated['status'] === 'published') {
            if (auth()->user()->canPublishArticles()) {
                $validated['published_at'] = now();
                $validated['published_by'] = auth()->id();
            } else {
                // Penulis tidak bisa langsung publish, ubah ke review
                $validated['status'] = 'review';
            }
        }

        $article = Article::create($validated);

        return redirect()->route('articles.index')
            ->with('success', 'Artikel berhasil ditambahkan!');
    }

    /**
     * Show the form for editing the specified article.
     */
    public function edit(Article $article): Response
    {
        $user = auth()->user();

        // Penulis hanya bisa edit artikel mereka sendiri
        if (!$user->isSuperAdmin() && $user->hasRole('penulis') && $article->author_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $article->load(['author', 'reviewer', 'publisher', 'category']);
        $categories = Category::active()->ordered()->get();

        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified article.
     */
    public function update(Request $request, Article $article)
    {
        $user = auth()->user();

        // Penulis hanya bisa edit artikel mereka sendiri
        if (!$user->isSuperAdmin() && $user->hasRole('penulis') && $article->author_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:articles,slug,' . $article->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120', // Increased to 5MB
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,review,published,archived',
        ]);

        // Handle optimized image upload
        if ($request->hasFile('featured_image')) {
            // Delete old images if exists
            if ($article->featured_image) {
                $this->deleteArticleImages($article);
            }
            
            $imageService = app(ImageOptimizationService::class);
            
            try {
                $optimizedImages = $imageService->processImage(
                    $request->file('featured_image'),
                    'articles',
                    [
                        'quality' => 85,
                        'max_width' => 1200,
                        'create_thumbnails' => true,
                        'create_social' => true,
                        'formats' => ['jpg', 'webp']
                    ]
                );
                
                // Store main image path and metadata
                $validated['featured_image'] = $optimizedImages['main']['jpg']['path'];
                $validated['image_metadata'] = json_encode([
                    'main' => $optimizedImages['main'],
                    'thumbnails' => $optimizedImages['thumbnails'] ?? [],
                    'social' => $optimizedImages['social'] ?? [],
                    'original_size' => $request->file('featured_image')->getSize(),
                    'optimized_at' => now()
                ]);
                
            } catch (\Exception $e) {
                \Log::error('Image optimization failed during update: ' . $e->getMessage());
                
                // Fallback to simple upload if optimization fails
                $path = $request->file('featured_image')->store('articles', 'public');
                $validated['featured_image'] = '/storage/' . $path;
                $validated['image_metadata'] = json_encode(['fallback' => true]);
            }
        }

        // Handle status changes
        if ($validated['status'] === 'published' && $article->status !== 'published') {
            if ($user->canPublishArticles()) {
                $validated['published_at'] = now();
                $validated['published_by'] = $user->id;
            } else {
                $validated['status'] = 'review';
            }
        }

        if ($validated['status'] === 'review' && $article->status !== 'review') {
            $validated['reviewed_by'] = $user->id;
        }

        $article->update($validated);

        return back()->with('success', 'Artikel berhasil diupdate!');
    }

    /**
     * Remove the specified article.
     */
    public function destroy(Article $article)
    {
        $user = auth()->user();

        // Cek apakah user bisa delete artikel ini
        if (!$user->canDeleteArticle($article)) {
            abort(403, 'Unauthorized action.');
        }

        // Delete featured image if exists (including optimized versions)
        if ($article->featured_image) {
            $this->deleteArticleImages($article);
        }

        $article->delete();

        return redirect()->route('articles.index')
            ->with('success', 'Artikel berhasil dihapus!');
    }

    /**
     * Delete all images associated with an article (including optimized versions)
     */
    private function deleteArticleImages(Article $article)
    {
        if (!$article->featured_image) {
            return;
        }

        // Delete main image
        $mainPath = str_replace('/storage/', '', $article->featured_image);
        Storage::disk('public')->delete($mainPath);

        // Delete optimized versions if metadata exists
        if ($article->image_metadata) {
            $metadata = json_decode($article->image_metadata, true);
            
            if (!isset($metadata['fallback']) && isset($metadata['main'])) {
                // Delete all format variants (jpg, webp)
                foreach ($metadata['main'] as $format => $data) {
                    if (isset($data['path'])) {
                        $path = str_replace('/storage/', '', $data['path']);
                        Storage::disk('public')->delete($path);
                    }
                }

                // Delete thumbnails
                if (isset($metadata['thumbnails'])) {
                    foreach ($metadata['thumbnails'] as $size => $formats) {
                        foreach ($formats as $format => $data) {
                            if (isset($data['path'])) {
                                $path = str_replace('/storage/', '', $data['path']);
                                Storage::disk('public')->delete($path);
                            }
                        }
                    }
                }

                // Delete social media variants
                if (isset($metadata['social'])) {
                    foreach ($metadata['social'] as $platform => $formats) {
                        foreach ($formats as $format => $data) {
                            if (isset($data['path'])) {
                                $path = str_replace('/storage/', '', $data['path']);
                                Storage::disk('public')->delete($path);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Display the specified article (public view).
     */
    public function show(string $slug): Response
    {
        $article = Article::where('slug', $slug)
            ->where('status', 'published')
            ->with('author')
            ->firstOrFail();

        $article->incrementViews();

        return Inertia::render('Public/Article', [
            'article' => $article,
        ]);
    }
}
