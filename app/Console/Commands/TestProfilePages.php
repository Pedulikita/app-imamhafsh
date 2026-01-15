<?php

namespace App\Console\Commands;

use App\Models\ProfilePage;
use Illuminate\Console\Command;

class TestProfilePages extends Command
{
    protected $signature = 'test:profile-pages';
    protected $description = 'Test ProfilePage data';

    public function handle()
    {
        $this->info('Testing ProfilePage data...');
        
        $count = ProfilePage::count();
        $this->info("Total records: {$count}");
        
        if ($count > 0) {
            $pages = ProfilePage::all(['id', 'title', 'slug', 'is_active']);
            foreach ($pages as $page) {
                $status = $page->is_active ? 'active' : 'inactive';
                $this->info("ID: {$page->id}, Title: {$page->title}, Slug: {$page->slug}, Status: {$status}");
            }
        } else {
            $this->warn('No ProfilePage records found!');
        }
        
        return 0;
    }
}