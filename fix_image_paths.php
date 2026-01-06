<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Cleaning up home_sections image paths...\n\n";

// Get all home sections with images that have /storage/ prefix
$sections = DB::table('home_sections')
    ->whereNotNull('image')
    ->where('image', 'like', '/storage/%')
    ->get();

$cleaned = 0;

foreach ($sections as $section) {
    $oldPath = $section->image;
    // Remove /storage/ prefix 
    $newPath = ltrim($oldPath, '/storage/');
    
    echo "Cleaning: {$oldPath} -> {$newPath}\n";
    
    DB::table('home_sections')
        ->where('id', $section->id)
        ->update(['image' => $newPath]);
        
    $cleaned++;
}

echo "\n=== CLEANUP COMPLETE ===\n";
echo "Records cleaned: {$cleaned}\n";