<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:database {--compress} {--path=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create database backup';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting database backup...');

        $database = config('database.connections.mysql.database');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');
        $host = config('database.connections.mysql.host');
        
        $date = now()->format('Y-m-d_H-i-s');
        $filename = "backup_{$database}_{$date}.sql";
        
        $backupPath = $this->option('path') ?: storage_path('app/backups');
        
        // Create backup directory if not exists
        if (!file_exists($backupPath)) {
            mkdir($backupPath, 0755, true);
        }
        
        $fullPath = $backupPath . '/' . $filename;
        
        // Create mysqldump command
        $command = sprintf(
            'mysqldump --user=%s --password=%s --host=%s %s > %s',
            escapeshellarg($username),
            escapeshellarg($password),
            escapeshellarg($host),
            escapeshellarg($database),
            escapeshellarg($fullPath)
        );
        
        // Execute backup
        $result = null;
        $output = [];
        exec($command, $output, $result);
        
        if ($result === 0) {
            $this->info("Database backup created: {$fullPath}");
            
            // Compress if requested
            if ($this->option('compress')) {
                $compressedFile = $fullPath . '.gz';
                exec("gzip {$fullPath}", $output, $compressResult);
                
                if ($compressResult === 0) {
                    $this->info("Backup compressed: {$compressedFile}");
                }
            }
            
            // Clean old backups (keep last 7 days)
            $this->cleanOldBackups($backupPath);
            
            return Command::SUCCESS;
        } else {
            $this->error('Database backup failed!');
            return Command::FAILURE;
        }
    }
    
    private function cleanOldBackups($backupPath)
    {
        $files = glob($backupPath . '/backup_*.sql*');
        
        foreach ($files as $file) {
            if (filemtime($file) < strtotime('-7 days')) {
                unlink($file);
                $this->info("Deleted old backup: " . basename($file));
            }
        }
    }
}