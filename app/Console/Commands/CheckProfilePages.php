<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProfilePage;

class CheckProfilePages extends Command
{
    protected $signature = 'check:profile-pages';
    protected $description = 'Check and create test profile pages';

    public function handle()
    {
        $count = ProfilePage::count();
        $this->info("Total ProfilePage records: {$count}");
        
        if ($count === 0) {
            $this->info("No records found. Creating test data...");
            
            $page = ProfilePage::create([
                'title' => 'Test Profile Page',
                'slug' => 'test-profile-page',
                'content' => '<p>This is a test profile page content.</p>',
                'meta_description' => 'Test profile page for debugging',
                'is_active' => true,
                'order' => 0,
            ]);
            
            $this->info("Created test ProfilePage with ID: {$page->id}");
        } else {
            $this->info("Existing records:");
            ProfilePage::select('id', 'title', 'slug', 'is_active', 'order')
                ->get()
                ->each(function($p) {
                    $active = $p->is_active ? 'active' : 'inactive';
                    $this->info("ID: {$p->id}, Title: {$p->title}, Slug: {$p->slug}, Status: {$active}, Order: {$p->order}");
                });
        }
        
        return 0;
    }
}
