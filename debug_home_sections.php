<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$filename = 'peDpRu5E9prKOwVN3q7p5FFwj6efXU3COGofFxxK.png';

echo "Searching for file: {$filename}\n\n";

// Check HomeSection meta fields
echo "=== HomeSections (all data) ===\n";
$homeSections = App\Models\HomeSection::all();
foreach ($homeSections as $section) {
    echo "ID: {$section->id}, Key: {$section->section_key}\n";
    echo "Image: " . ($section->image ?? 'null') . "\n";
    echo "Meta: " . json_encode($section->meta) . "\n";
    echo "Active: " . ($section->is_active ? 'Yes' : 'No') . "\n";
    echo "---\n";
}

// Check in image_metadata fields
echo "\n=== Articles (image_metadata) ===\n";
$articles = App\Models\Article::whereNotNull('image_metadata')->get();
foreach ($articles as $article) {
    if (strpos($article->image_metadata, $filename) !== false) {
        echo "ID: {$article->id}, Title: {$article->title}\n";
        echo "Image Metadata: {$article->image_metadata}\n";
        echo "---\n";
    }
}

echo "\nDone.\n";