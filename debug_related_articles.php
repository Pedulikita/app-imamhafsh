<?php
/**
 * Debug Related Articles Image Data
 */

// Load Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
$request = \Illuminate\Http\Request::capture();
$kernel->bootstrap();

use App\Models\Article;

echo "=== Debugging Related Articles Images ===\n\n";

// Get first published article
$article = Article::where('status', 'published')
    ->with('category')
    ->first();

if (!$article) {
    echo "No published articles found\n";
    exit;
}

echo "Main Article: " . $article->title . "\n";
echo "Category: " . ($article->category ? $article->category->name : 'None') . "\n";
echo "Featured Image: " . ($article->featured_image ?: 'EMPTY') . "\n";
echo "Image Metadata: " . ($article->image_metadata ? 'YES' : 'NO (NULL)') . "\n\n";

// Get related articles
$related = Article::where('status', 'published')
    ->where('id', '!=', $article->id)
    ->where('category_id', $article->category_id)
    ->take(4)
    ->get();

echo "=== Related Articles (" . count($related) . ") ===\n\n";

foreach ($related as $index => $relArticle) {
    echo ($index + 1) . ". " . $relArticle->title . "\n";
    echo "   Featured Image: " . ($relArticle->featured_image ?: 'EMPTY ❌') . "\n";
    echo "   Image Metadata: " . ($relArticle->image_metadata ? 'YES ✓' : 'NO ❌') . "\n";
    echo "   Views: " . $relArticle->views . "\n";
    
    // Check file exists
    if ($relArticle->featured_image) {
        $path = public_path(ltrim($relArticle->featured_image, '/'));
        echo "   File Path: " . $path . "\n";
        echo "   File Exists: " . (file_exists($path) ? "YES ✓" : "NO ❌") . "\n";
    }
    echo "\n";
}

echo "\n=== Image Data Format Check ===\n\n";

// Check one article's image metadata
if ($related->first() && $related->first()->image_metadata) {
    $metadata = json_decode($related->first()->image_metadata, true);
    echo "Image Metadata Structure:\n";
    echo "Has 'main': " . (isset($metadata['main']) ? "YES" : "NO") . "\n";
    echo "Has 'thumbnails': " . (isset($metadata['thumbnails']) ? "YES" : "NO") . "\n";
    echo "Has 'social': " . (isset($metadata['social']) ? "YES" : "NO") . "\n";
    
    if (isset($metadata['main'])) {
        echo "\nMain image sizes: " . json_encode(array_keys($metadata['main'])) . "\n";
    }
}
?>
