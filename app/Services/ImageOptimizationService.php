<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ImageOptimizationService
{
    private ImageManager $imageManager;
    
    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Optimize and process uploaded image
     */
    public function processImage(UploadedFile $file, string $path = 'articles', array $options = []): array
    {
        $filename = $this->generateFilename($file);
        
        // Default options
        $options = array_merge([
            'quality' => 85,
            'max_width' => 1200,
            'create_thumbnails' => true,
            'create_social' => true,
            'formats' => ['jpg', 'webp']
        ], $options);

        $results = [];
        
        // Read original image
        $image = $this->imageManager->read($file->getPathname());
        
        // Get original dimensions
        $originalWidth = $image->width();
        $originalHeight = $image->height();
        
        // Calculate dimensions while maintaining aspect ratio
        $maxWidth = $options['max_width'];
        if ($originalWidth > $maxWidth) {
            $newWidth = $maxWidth;
            $newHeight = (int) ($originalHeight * ($maxWidth / $originalWidth));
        } else {
            $newWidth = $originalWidth;
            $newHeight = $originalHeight;
        }

        // Create main optimized image
        $optimizedImage = $image->scale($newWidth, $newHeight);
        
        // Save in different formats
        foreach ($options['formats'] as $format) {
            $formatFilename = $this->changeFileExtension($filename, $format);
            $fullPath = "{$path}/{$formatFilename}";
            
            if ($format === 'jpg' || $format === 'jpeg') {
                $encoded = $optimizedImage->toJpeg($options['quality']);
            } elseif ($format === 'webp') {
                $encoded = $optimizedImage->toWebp($options['quality']);
            } else {
                $encoded = $optimizedImage->toPng();
            }
            
            Storage::disk('public')->put($fullPath, (string) $encoded);
            
            $results['main'][$format] = [
                'path' => "/storage/{$fullPath}",
                'width' => $newWidth,
                'height' => $newHeight,
                'size' => Storage::disk('public')->size($fullPath)
            ];
        }

        // Create thumbnail versions
        if ($options['create_thumbnails']) {
            $thumbnailSizes = [
                'small' => ['width' => 300, 'height' => 200],
                'medium' => ['width' => 600, 'height' => 400],
                'large' => ['width' => 800, 'height' => 600]
            ];

            foreach ($thumbnailSizes as $size => $dimensions) {
                foreach ($options['formats'] as $format) {
                    $thumbFilename = $this->addSuffix($filename, "_{$size}", $format);
                    $thumbPath = "{$path}/thumbs/{$thumbFilename}";
                    
                    // Create thumbnail with cover (crops to exact size)
                    $thumbnail = $optimizedImage->cover($dimensions['width'], $dimensions['height']);
                    
                    if ($format === 'jpg' || $format === 'jpeg') {
                        $encoded = $thumbnail->toJpeg($options['quality']);
                    } elseif ($format === 'webp') {
                        $encoded = $thumbnail->toWebp($options['quality']);
                    } else {
                        $encoded = $thumbnail->toPng();
                    }
                    
                    Storage::disk('public')->put($thumbPath, (string) $encoded);
                    
                    $results['thumbnails'][$size][$format] = [
                        'path' => "/storage/{$thumbPath}",
                        'width' => $dimensions['width'],
                        'height' => $dimensions['height'],
                        'size' => Storage::disk('public')->size($thumbPath)
                    ];
                }
            }
        }

        // Create social media optimized versions
        if ($options['create_social']) {
            $socialSizes = [
                'facebook' => ['width' => 1200, 'height' => 630],
                'twitter' => ['width' => 1200, 'height' => 675],
                'instagram' => ['width' => 1080, 'height' => 1080]
            ];

            foreach ($socialSizes as $platform => $dimensions) {
                foreach ($options['formats'] as $format) {
                    $socialFilename = $this->addSuffix($filename, "_{$platform}", $format);
                    $socialPath = "{$path}/social/{$socialFilename}";
                    
                    // Create social media optimized image
                    $socialImage = $optimizedImage->cover($dimensions['width'], $dimensions['height']);
                    
                    if ($format === 'jpg' || $format === 'jpeg') {
                        $encoded = $socialImage->toJpeg($options['quality']);
                    } elseif ($format === 'webp') {
                        $encoded = $socialImage->toWebp($options['quality']);
                    } else {
                        $encoded = $socialImage->toPng();
                    }
                    
                    Storage::disk('public')->put($socialPath, (string) $encoded);
                    
                    $results['social'][$platform][$format] = [
                        'path' => "/storage/{$socialPath}",
                        'width' => $dimensions['width'],
                        'height' => $dimensions['height'],
                        'size' => Storage::disk('public')->size($socialPath)
                    ];
                }
            }
        }

        return $results;
    }

    /**
     * Optimize existing image file
     */
    public function optimizeExistingImage(string $imagePath, array $options = []): array
    {
        if (!Storage::disk('public')->exists($imagePath)) {
            throw new \Exception("Image file not found: {$imagePath}");
        }

        $fullPath = Storage::disk('public')->path($imagePath);
        $image = $this->imageManager->read($fullPath);
        
        $options = array_merge([
            'quality' => 85,
            'max_width' => 1200,
            'backup' => true
        ], $options);

        // Create backup if requested
        if ($options['backup']) {
            $backupPath = str_replace('.', '_backup.', $imagePath);
            Storage::disk('public')->copy($imagePath, $backupPath);
        }

        // Optimize image
        $originalSize = Storage::disk('public')->size($imagePath);
        
        if ($image->width() > $options['max_width']) {
            $image = $image->scale($options['max_width']);
        }

        // Save optimized version
        $encoded = $image->toJpeg($options['quality']);
        Storage::disk('public')->put($imagePath, (string) $encoded);
        
        $newSize = Storage::disk('public')->size($imagePath);
        $savings = $originalSize - $newSize;
        $savingsPercent = round(($savings / $originalSize) * 100, 2);

        return [
            'path' => $imagePath,
            'original_size' => $originalSize,
            'new_size' => $newSize,
            'savings' => $savings,
            'savings_percent' => $savingsPercent
        ];
    }

    /**
     * Generate unique filename
     */
    private function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $sanitizedName = preg_replace('/[^a-zA-Z0-9-_]/', '_', $name);
        
        return $sanitizedName . '_' . time() . '_' . uniqid() . '.' . $extension;
    }

    /**
     * Change file extension
     */
    private function changeFileExtension(string $filename, string $newExtension): string
    {
        $pathInfo = pathinfo($filename);
        return $pathInfo['filename'] . '.' . $newExtension;
    }

    /**
     * Add suffix to filename
     */
    private function addSuffix(string $filename, string $suffix, string $extension): string
    {
        $pathInfo = pathinfo($filename);
        return $pathInfo['filename'] . $suffix . '.' . $extension;
    }

    /**
     * Get image info
     */
    public function getImageInfo(string $imagePath): array
    {
        if (!Storage::disk('public')->exists($imagePath)) {
            throw new \Exception("Image file not found: {$imagePath}");
        }

        $fullPath = Storage::disk('public')->path($imagePath);
        $image = $this->imageManager->read($fullPath);
        
        return [
            'width' => $image->width(),
            'height' => $image->height(),
            'size' => Storage::disk('public')->size($imagePath),
            'mime_type' => mime_content_type($fullPath),
            'file_size_human' => $this->formatBytes(Storage::disk('public')->size($imagePath))
        ];
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}