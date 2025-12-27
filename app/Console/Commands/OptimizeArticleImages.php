<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Services\ImageOptimizationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class OptimizeArticleImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize-articles 
                           {--force : Force optimization even if already optimized} 
                           {--limit= : Limit number of articles to process} 
                           {--dry-run : Show what would be processed without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize existing article featured images for better performance';

    private ImageOptimizationService $imageOptimizationService;

    public function __construct(ImageOptimizationService $imageOptimizationService)
    {
        parent::__construct();
        $this->imageOptimizationService = $imageOptimizationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $force = $this->option('force');
        $limit = $this->option('limit');
        $dryRun = $this->option('dry-run');

        $this->info('Starting article image optimization...');

        // Get articles that need optimization
        $query = Article::whereNotNull('featured_image');
        
        if (!$force) {
            $query->where(function ($q) {
                $q->whereNull('image_metadata')
                  ->orWhere('image_metadata', 'like', '%"fallback":true%');
            });
        }

        if ($limit) {
            $query->limit((int)$limit);
        }

        $articles = $query->get();

        if ($articles->isEmpty()) {
            $this->info('No articles found that need image optimization.');
            return 0;
        }

        $this->info("Found {$articles->count()} articles to process.");

        if ($dryRun) {
            $this->table(['ID', 'Title', 'Image', 'Status'], 
                $articles->map(function ($article) {
                    $metadata = $article->image_metadata ? json_decode($article->image_metadata, true) : null;
                    $status = $metadata && !isset($metadata['fallback']) ? 'Optimized' : 'Needs optimization';
                    
                    return [
                        $article->id,
                        \Str::limit($article->title, 30),
                        basename($article->featured_image),
                        $status
                    ];
                })
            );
            
            $this->info('Dry run completed. Use --force to actually process the images.');
            return 0;
        }

        $bar = $this->output->createProgressBar($articles->count());
        $bar->start();

        $processed = 0;
        $failed = 0;

        foreach ($articles as $article) {
            try {
                $this->optimizeArticleImage($article, $force);
                $processed++;
                $this->line(""); // New line after progress bar
                $this->info("✓ Optimized: {$article->title}");
            } catch (\Exception $e) {
                $failed++;
                $this->line(""); // New line after progress bar
                $this->error("✗ Failed to optimize {$article->title}: " . $e->getMessage());
            }
            
            $bar->advance();
        }

        $bar->finish();
        $this->line(""); // New line after progress bar

        $this->info("Optimization complete!");
        $this->info("Processed: $processed");
        $this->info("Failed: $failed");

        return 0;
    }

    private function optimizeArticleImage(Article $article, bool $force = false)
    {
        if (!$article->featured_image) {
            throw new \Exception('No featured image found');
        }

        // Check if already optimized and not forcing
        $metadata = $article->image_metadata ? json_decode($article->image_metadata, true) : null;
        if (!$force && $metadata && !isset($metadata['fallback'])) {
            throw new \Exception('Already optimized (use --force to re-optimize)');
        }

        // Get the file path
        $imagePath = str_replace('/storage/', 'public/', $article->featured_image);
        $fullPath = Storage::path($imagePath);

        if (!file_exists($fullPath)) {
            throw new \Exception('Image file not found: ' . $fullPath);
        }

        // Create a temporary uploaded file object for processing
        $tempFile = new \Illuminate\Http\Testing\File(
            basename($fullPath),
            fopen($fullPath, 'r')
        );

        // Process the image
        $optimized = $this->imageOptimizationService->processImage(
            $tempFile,
            'articles',
            [
                'quality' => 85,
                'max_width' => 1200,
                'create_thumbnails' => true,
                'create_social' => true,
                'formats' => ['jpg', 'webp']
            ]
        );

        // Update article with optimized image data
        $article->update([
            'featured_image' => $optimized['main']['jpg']['path'],
            'image_metadata' => json_encode([
                'main' => $optimized['main'],
                'thumbnails' => $optimized['thumbnails'] ?? [],
                'social' => $optimized['social'] ?? [],
                'original_size' => filesize($fullPath),
                'optimized_at' => now()
            ])
        ]);

        // Clean up original if it's different from optimized
        $originalPath = str_replace('/storage/', '', $article->featured_image);
        $optimizedPath = str_replace('/storage/', '', $optimized['main']['jpg']['path']);
        
        if ($originalPath !== $optimizedPath && Storage::disk('public')->exists($originalPath)) {
            Storage::disk('public')->delete($originalPath);
        }
    }
}
