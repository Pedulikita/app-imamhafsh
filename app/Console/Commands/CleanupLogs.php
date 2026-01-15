<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanupLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'logs:cleanup {--days=7 : Days to keep logs} {--size=50 : Max size in MB}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old log files';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting log cleanup...');
        
        $days = $this->option('days');
        $maxSize = $this->option('size') * 1024 * 1024; // Convert MB to bytes
        
        $logPath = storage_path('logs');
        $cleaned = 0;
        $totalSize = 0;
        
        // Get all log files
        $logFiles = glob($logPath . '/*.log');
        
        foreach ($logFiles as $file) {
            $fileSize = filesize($file);
            $fileAge = time() - filemtime($file);
            $daysOld = $fileAge / (24 * 60 * 60);
            
            // Clean if file is older than specified days or larger than max size
            if ($daysOld > $days || $fileSize > $maxSize) {
                
                // For large files, truncate instead of delete if it's the current log
                if (basename($file) === 'laravel.log' && $fileSize > $maxSize) {
                    // Keep last 1000 lines
                    $this->truncateFile($file, 1000);
                    $this->info("Truncated large log file: " . basename($file));
                } else {
                    // Delete old files
                    unlink($file);
                    $this->info("Deleted old log file: " . basename($file) . " (" . round($daysOld, 1) . " days old)");
                    $cleaned++;
                    $totalSize += $fileSize;
                }
            }
        }
        
        // Clean up empty log directories
        $this->cleanEmptyDirectories($logPath);
        
        $this->info("Log cleanup completed!");
        $this->info("Files cleaned: {$cleaned}");
        $this->info("Space freed: " . $this->formatBytes($totalSize));
        
        return Command::SUCCESS;
    }
    
    private function truncateFile($file, $lines)
    {
        $handle = fopen($file, 'r');
        $fileLines = [];
        
        // Read all lines
        while (($line = fgets($handle)) !== false) {
            $fileLines[] = $line;
        }
        fclose($handle);
        
        // Keep only last N lines
        $keepLines = array_slice($fileLines, -$lines);
        
        // Write back to file
        file_put_contents($file, implode('', $keepLines));
    }
    
    private function cleanEmptyDirectories($path)
    {
        $directories = glob($path . '/*', GLOB_ONLYDIR);
        
        foreach ($directories as $dir) {
            if (count(scandir($dir)) <= 2) { // Only . and ..
                rmdir($dir);
                $this->info("Removed empty directory: " . basename($dir));
            }
        }
    }
    
    private function formatBytes($bytes, $precision = 2)
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}