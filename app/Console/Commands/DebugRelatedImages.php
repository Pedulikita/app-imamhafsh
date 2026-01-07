<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;

class DebugRelatedImages extends Command
{
    protected $signature = 'debug:related-images';
    protected $description = 'Debug related articles images';

    public function handle()
    {
        $this->info('=== CHECKING ALL ARTICLES ===');
        
        $allArticles = Article::all(['id', 'title', 'status', 'featured_image', 'category_id']);
        $this->line("Total Articles in DB: " . count($allArticles));
        
        $this->info('\n=== PUBLISHED ARTICLES ===');
        
        $articles = Article::where('status', 'published')
            ->get(['id', 'title', 'featured_image', 'category_id']);
        
        $this->line("Total Published: " . count($articles));
        
        foreach ($articles as $article) {
            $this->line("\nID: {$article->id} | Title: {$article->title}");
            $this->line("  Featured Image: " . ($article->featured_image ?? 'NULL'));
            $this->line("  Category ID: " . ($article->category_id ?? 'NULL'));
            
            if ($article->featured_image) {
                $publicPath = public_path() . $article->featured_image;
                $exists = file_exists($publicPath) ? 'YES' : 'NO';
                $this->line("  File Exists: {$exists}");
                
                // Also check if accessible via HTTP
                $this->line("  Full Path: {$publicPath}");
            }
        }
        
        // Test formatArticleForPublic for article 4
        $this->info('\n=== TESTING ARTICLE 4 FORMAT ===');
        if ($article = Article::find(4)) {
            $controller = app()->make(\App\Http\Controllers\PublicArticleController::class);
            $reflection = new \ReflectionMethod($controller, 'formatArticleForPublic');
            $reflection->setAccessible(true);
            $formatted = $reflection->invoke($controller, $article);
            $this->line("Featured Image in formatted: " . ($formatted['featured_image'] ?? 'NULL'));
            $this->line("Category in formatted: " . ($formatted['category'] ?? 'NULL'));
        }
    }
}
