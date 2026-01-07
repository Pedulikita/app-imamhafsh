<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Http\Kernel')->bootstrap();

use App\Models\Article;

$articles = Article::where('status','published')
    ->with('category')
    ->limit(5)
    ->get();

echo "=== Articles Check ===\n\n";
foreach($articles as $a) {
    echo $a->title . "\n";
    echo "  Category: " . ($a->category ? $a->category->name : 'NULL') . "\n";
    echo "  Featured Image: " . ($a->featured_image ?: 'EMPTY') . "\n\n";
}
