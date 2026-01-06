<?php

// Debug HomeSection production
echo "=== Production HomeSection Debug ===\n";

// Basic Laravel bootstrap
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "APP_URL: " . config('app.url') . "\n";
echo "APP_ENV: " . config('app.env') . "\n\n";

// Test asset and url functions
echo "asset('storage/test.jpg'): " . asset('storage/test.jpg') . "\n";
echo "url('storage/test.jpg'): " . url('storage/test.jpg') . "\n\n";

// Check HomeSection data and accessor
$sections = \App\Models\HomeSection::take(5)->get();
echo "HomeSection count: " . \App\Models\HomeSection::count() . "\n\n";

foreach ($sections as $section) {
    echo "=== Section: {$section->section_key} ===\n";
    echo "ID: {$section->id}\n";
    echo "Raw image field: " . ($section->image ?? 'NULL') . "\n";
    
    // Test accessor directly
    try {
        echo "image_url accessor: " . ($section->image_url ?? 'NULL') . "\n";
    } catch (\Exception $e) {
        echo "Error with image_url accessor: " . $e->getMessage() . "\n";
    }
    
    // Manual URL generation
    if ($section->image) {
        echo "Manual asset(): " . asset('storage/' . $section->image) . "\n";
        echo "Manual url(): " . url('storage/' . $section->image) . "\n";
    }
    echo "---\n";
}

echo "\n=== Testing accessor logic ===\n";
$testSection = $sections->first();
if ($testSection && $testSection->image) {
    $image = $testSection->image;
    echo "Original image: {$image}\n";
    
    if (str_starts_with($image, 'home-sections/')) {
        echo "Starts with home-sections/ - would return: " . config('app.url', 'https://imamhafsh.com') . '/storage/' . $image . "\n";
    }
    
    if (str_starts_with($image, 'storage/')) {
        echo "Starts with storage/ - would return: " . config('app.url', 'https://imamhafsh.com') . '/' . $image . "\n";
    }
}