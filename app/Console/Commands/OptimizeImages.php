<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\DonationEmbed;

class OptimizeImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize {--quality=80 : JPEG quality (1-100)} {--force : Force optimization of all images}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize donation embed images';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting image optimization...');
        
        $quality = $this->option('quality');
        $force = $this->option('force');
        
        $optimized = 0;
        $totalSaved = 0;
        
        // Get all donation embeds with images
        $donations = DonationEmbed::whereNotNull('image_url')->get();
        
        foreach ($donations as $donation) {
            $imagePath = $donation->getAttributes()['image_url'];
            
            if (!$imagePath || !Storage::disk('public')->exists($imagePath)) {
                continue;
            }
            
            $fullPath = storage_path('app/public/' . $imagePath);
            $originalSize = filesize($fullPath);
            
            // Check if image needs optimization
            if (!$force && $this->isOptimized($fullPath)) {
                continue;
            }
            
            $savedBytes = $this->optimizeImage($fullPath, $quality);
            
            if ($savedBytes > 0) {
                $optimized++;
                $totalSaved += $savedBytes;
                
                $this->info("Optimized: " . basename($imagePath) . " (saved " . $this->formatBytes($savedBytes) . ")");
            }
        }
        
        // Clean up orphaned images
        $this->cleanOrphanedImages();
        
        $this->info("Image optimization completed!");
        $this->info("Images optimized: {$optimized}");
        $this->info("Total space saved: " . $this->formatBytes($totalSaved));
        
        return Command::SUCCESS;
    }
    
    private function isOptimized($imagePath)
    {
        // Check if image was recently optimized (within 30 days)
        $optimizedFile = $imagePath . '.optimized';
        
        if (file_exists($optimizedFile)) {
            $lastOptimized = filemtime($optimizedFile);
            return (time() - $lastOptimized) < (30 * 24 * 60 * 60); // 30 days
        }
        
        return false;
    }
    
    private function optimizeImage($imagePath, $quality)
    {
        if (!extension_loaded('gd')) {
            $this->warn('GD extension not loaded, skipping image optimization');
            return 0;
        }
        
        $originalSize = filesize($imagePath);
        $imageInfo = getimagesize($imagePath);
        
        if (!$imageInfo) {
            return 0;
        }
        
        $mimeType = $imageInfo['mime'];
        
        // Create image resource based on type
        switch ($mimeType) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($imagePath);
                break;
            case 'image/png':
                $image = imagecreatefrompng($imagePath);
                break;
            case 'image/gif':
                $image = imagecreatefromgif($imagePath);
                break;
            default:
                return 0;
        }
        
        if (!$image) {
            return 0;
        }
        
        // Save optimized image
        $tempPath = $imagePath . '.temp';
        
        switch ($mimeType) {
            case 'image/jpeg':
                imagejpeg($image, $tempPath, $quality);
                break;
            case 'image/png':
                // PNG optimization
                imagepng($image, $tempPath, 9);
                break;
            case 'image/gif':
                imagegif($image, $tempPath);
                break;
        }
        
        imagedestroy($image);
        
        $newSize = filesize($tempPath);
        $savedBytes = $originalSize - $newSize;
        
        // Only replace if we saved significant space (at least 5%)
        if ($savedBytes > ($originalSize * 0.05)) {
            rename($tempPath, $imagePath);
            
            // Mark as optimized
            touch($imagePath . '.optimized');
            
            return $savedBytes;
        } else {
            unlink($tempPath);
            return 0;
        }
    }
    
    private function cleanOrphanedImages()
    {
        $this->info('Cleaning orphaned images...');
        
        // Get all image files
        $allImages = Storage::disk('public')->files('donation-embeds');
        
        // Get all images referenced in database
        $usedImages = DonationEmbed::whereNotNull('image_url')
                                  ->pluck('image_url')
                                  ->map(function ($url) {
                                      return str_replace('donation-embeds/', '', basename($url));
                                  })
                                  ->toArray();
        
        $deleted = 0;
        $deletedSize = 0;
        
        foreach ($allImages as $imagePath) {
            $filename = basename($imagePath);
            
            // Skip optimization marker files
            if (str_ends_with($filename, '.optimized')) {
                continue;
            }
            
            if (!in_array($filename, $usedImages)) {
                $size = Storage::disk('public')->size($imagePath);
                Storage::disk('public')->delete($imagePath);
                
                // Also delete optimization marker if exists
                Storage::disk('public')->delete($imagePath . '.optimized');
                
                $deleted++;
                $deletedSize += $size;
                
                $this->info("Deleted orphaned image: " . $filename);
            }
        }
        
        if ($deleted > 0) {
            $this->info("Orphaned images cleaned: {$deleted} (freed " . $this->formatBytes($deletedSize) . ")");
        }
    }
    
    private function formatBytes($bytes, $precision = 2)
    {
        $units = array('B', 'KB', 'MB', 'GB');
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}