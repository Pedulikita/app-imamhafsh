<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Debugging HomeSection data...\n\n";

$sections = App\Models\HomeSection::all();

foreach ($sections as $section) {
    echo "Section: {$section->section_key}\n";
    echo "Raw Image: " . ($section->image ?? 'null') . "\n";
    echo "Image URL: " . ($section->image_url ?? 'null') . "\n";
    echo "---\n";
}

echo "\nDone.\n";