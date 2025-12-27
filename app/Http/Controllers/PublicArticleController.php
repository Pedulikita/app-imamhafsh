<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicArticleController extends Controller
{
    /**
     * Display a listing of articles for public view
     */
    public function index(Request $request)
    {
        try {
            $articles = Article::with('category')
                ->where('status', 'published')
                ->latest('published_at')
                ->get()
                ->map(function ($article) {
                    return $this->formatArticleForPublic($article);
                });

            return Inertia::render('public/all-articles', [
                'articles' => $articles,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memuat artikel']);
        }
    }

    /**
     * Display the specified article for public view
     */
    public function show(Request $request, $slug)
    {
        try {
            // Validate slug input
            $slug = strip_tags($slug);
            
            // Try to find by slug first, then by ID as fallback
            $article = Article::with('category')
                ->where(function($query) use ($slug) {
                    $query->where('slug', $slug)
                          ->orWhere('id', $slug);
                })
                ->where('status', 'published')
                ->firstOrFail();
            
            // Security: Increment views safely with transaction
            \DB::transaction(function () use ($article) {
                $article->increment('views');
            });
            
            $articleData = $this->formatArticleForPublic($article, true);

            // Get sidebar articles with optimized queries
            $popularArticles = $this->getPopularArticles($article->id);
            $trendingArticles = $this->getTrendingArticles($article->id);
            $latestArticles = $this->getLatestArticles($article->id);
            $relatedArticles = $this->getRelatedArticles($article->id, $article->category);

            return Inertia::render('public/article-detail', [
                'article' => $articleData,
                'popularArticles' => $popularArticles,
                'trendingArticles' => $trendingArticles,
                'latestArticles' => $latestArticles,
                'relatedArticles' => $relatedArticles,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            abort(404, 'Artikel tidak ditemukan');
        } catch (\Exception $e) {
            \Log::error('Error showing article: ' . $e->getMessage());
            return redirect()->route('articles')->withErrors(['error' => 'Gagal memuat artikel']);
        }
    }

    /**
     * Format article data for public consumption
     */
    private function formatArticleForPublic($article, $includeContent = false)
    {
        $data = [
            'id' => $article->id,
            'title' => e($article->title), // XSS protection
            'slug' => $article->slug,
            'featured_image' => $article->featured_image ?? '/images/logo.png',
            'image_metadata' => $article->image_metadata,
            'category' => $article->category ? e($article->category->name) : e($article->category ?? 'General'),
            'date' => $article->published_at ? $article->published_at->format('d M Y') : '',
            'excerpt' => e($article->excerpt ?? ''), // XSS protection
            'authorName' => $article->author->name ?? 'Admin',
            'authorAvatar' => '/images/logo.png',
            'readTime' => $this->calculateReadTime($article->content ?? ''),
            'tags' => $this->sanitizeTags($article->tags),
            'views' => (int) ($article->views ?? 0),
            
            // Legacy field for backward compatibility
            'image' => $article->featured_image ?? '/images/logo.png',
        ];

        if ($includeContent) {
            $data['content'] = $this->sanitizeContent($article->content ?? '');
        }

        return $data;
    }

    /**
     * Get popular articles by views (cached for performance)
     */
    private function getPopularArticles($excludeId, $limit = 5)
    {
        return cache()->remember("popular_articles_{$excludeId}", 3600, function () use ($excludeId, $limit) {
            return Article::with('category')
                ->where('status', 'published')
                ->where('id', '!=', $excludeId)
                ->orderBy('views', 'desc')
                ->take($limit)
                ->get()
                ->map(function ($article) {
                    return $this->formatArticleForPublic($article);
                });
        });
    }

    /**
     * Get trending articles (recent with high views)
     */
    private function getTrendingArticles($excludeId, $limit = 5)
    {
        return cache()->remember("trending_articles_{$excludeId}", 1800, function () use ($excludeId, $limit) {
            return Article::with('category')
                ->where('status', 'published')
                ->where('id', '!=', $excludeId)
                ->where('published_at', '>=', now()->subDays(30))
                ->orderBy('views', 'desc')
                ->take($limit)
                ->get()
                ->map(function ($article) {
                    return $this->formatArticleForPublic($article);
                });
        });
    }

    /**
     * Get latest articles
     */
    private function getLatestArticles($excludeId, $limit = 5)
    {
        return cache()->remember("latest_articles_{$excludeId}", 1800, function () use ($excludeId, $limit) {
            return Article::with('category')
                ->where('status', 'published')
                ->where('id', '!=', $excludeId)
                ->latest('published_at')
                ->take($limit)
                ->get()
                ->map(function ($article) {
                    return $this->formatArticleForPublic($article);
                });
        });
    }

    /**
     * Get related articles by category
     */
    private function getRelatedArticles($excludeId, $category, $limit = 4)
    {
        $sanitizedCategory = e($category);
        
        return cache()->remember("related_articles_{$excludeId}_{$sanitizedCategory}", 3600, function () use ($excludeId, $category, $limit) {
            return Article::with('category')
                ->where('status', 'published')
                ->where('id', '!=', $excludeId)
                ->where('category', $category)
                ->latest('published_at')
                ->take($limit)
                ->get()
                ->map(function ($article) {
                    return $this->formatArticleForPublic($article);
                });
        });
    }

    /**
     * Calculate reading time based on content
     */
    private function calculateReadTime($content)
    {
        $wordCount = str_word_count(strip_tags($content));
        $minutes = max(1, ceil($wordCount / 200)); // Minimum 1 minute
        return $minutes . ' min read';
    }

    /**
     * Sanitize tags for security
     */
    private function sanitizeTags($tags)
    {
        if (!$tags) return [];
        
        $tagArray = is_array($tags) ? $tags : explode(',', $tags);
        
        return array_map(function($tag) {
            return e(trim($tag)); // XSS protection
        }, $tagArray);
    }

    /**
     * Sanitize content for safe display
     */
    private function sanitizeContent($content)
    {
        // Allow safe HTML tags, remove dangerous ones
        $allowedTags = '<p><br><strong><b><em><i><u><h1><h2><h3><h4><h5><h6><ul><ol><li><blockquote><img><a>';
        return strip_tags($content, $allowedTags);
    }
}