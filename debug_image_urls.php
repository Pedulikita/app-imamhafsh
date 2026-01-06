<?php

// Debug HomeSection Image URL
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Debugging HomeSection Image URLs ===\n";

// Test asset() function
echo "asset('storage/test.jpg'): " . asset('storage/test.jpg') . "\n";
echo "url('storage/test.jpg'): " . url('storage/test.jpg') . "\n";

// Check APP_URL
echo "APP_URL: " . config('app.url') . "\n";
echo "APP_ENV: " . config('app.env') . "\n";

// Check HomeSection data
$homeSections = \App\Models\HomeSection::take(3)->get();
echo "HomeSection count: " . \App\Models\HomeSection::count() . "\n";

foreach ($homeSections as $section) {
    echo "\nSection: {$section->section_key}\n";
    echo "Raw image: " . ($section->image ?? 'null') . "\n";
    echo "image_url accessor: " . ($section->image_url ?? 'null') . "\n";
    
    if ($section->image) {
        echo "Manual asset(): " . asset('storage/' . $section->image) . "\n";
    }
    echo "---\n";
}