<?php

require 'bootstrap/app.php';

$app = require_once 'bootstrap/app.php';

use Illuminate\Support\Facades\DB;

try {
    // Query articles dan related articles
    echo "=== CHECKING FEATURED IMAGES IN DATABASE ===\n\n";
    
    $articles = DB::select("
        SELECT id, title, featured_image, category_id, status 
        FROM articles 
        WHERE status = 'published' 
        ORDER BY id DESC 
        LIMIT 5
    ");
    
    foreach ($articles as $article) {
        echo "Article ID: {$article->id}\n";
        echo "Title: {$article->title}\n";
        echo "Featured Image: " . ($article->featured_image ?? 'NULL') . "\n";
        echo "Category ID: " . ($article->category_id ?? 'NULL') . "\n";
        
        // Check if file exists
        if ($article->featured_image) {
            $fullPath = public_path() . $article->featured_image;
            $exists = file_exists($fullPath) ? 'YES' : 'NO';
            echo "File Exists: $exists (path: $fullPath)\n";
        }
        echo "---\n\n";
    }
    
    // Test formatArticleForPublic
    echo "\n=== TESTING formatArticleForPublic ===\n\n";
    
    $article = DB::table('articles')
        ->where('id', 4)
        ->where('status', 'published')
        ->first();
    
    if ($article) {
        echo "Raw featured_image: " . ($article->featured_image ?? 'NULL') . "\n";
        echo "Full Object:\n";
        var_dump($article);
    }
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
