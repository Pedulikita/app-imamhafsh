<?php

namespace App\Console\Commands;

use App\Models\SiteSetting;
use Illuminate\Console\Command;

class InitializeSiteSettings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'settings:initialize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize default site settings for contact and social media';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Initializing default site settings...');

        $defaults = [
            // Contact Information
            [
                'key' => 'contact_address',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Alamat',
                'value' => '',
                'description' => 'Alamat lengkap institusi',
                'order' => 1
            ],
            [
                'key' => 'contact_phone',
                'type' => 'phone',
                'group' => 'contact',
                'label' => 'Telepon',
                'value' => '',
                'description' => 'Nomor telepon utama',
                'order' => 2
            ],
            [
                'key' => 'contact_whatsapp',
                'type' => 'phone',
                'group' => 'contact',
                'label' => 'WhatsApp',
                'value' => '',
                'description' => 'Nomor WhatsApp',
                'order' => 3
            ],
            [
                'key' => 'contact_email',
                'type' => 'email',
                'group' => 'contact',
                'label' => 'Email',
                'value' => '',
                'description' => 'Email utama institusi',
                'order' => 4
            ],
            
            // Social Media
            [
                'key' => 'social_facebook',
                'type' => 'url',
                'group' => 'social',
                'label' => 'Facebook',
                'value' => '',
                'description' => 'URL halaman Facebook',
                'order' => 1
            ],
            [
                'key' => 'social_instagram',
                'type' => 'url',
                'group' => 'social',
                'label' => 'Instagram',
                'value' => '',
                'description' => 'URL profil Instagram',
                'order' => 2
            ],
            [
                'key' => 'social_youtube',
                'type' => 'url',
                'group' => 'social',
                'label' => 'YouTube',
                'value' => '',
                'description' => 'URL channel YouTube',
                'order' => 3
            ],
            [
                'key' => 'social_twitter',
                'type' => 'url',
                'group' => 'social',
                'label' => 'Twitter',
                'value' => '',
                'description' => 'URL profil Twitter',
                'order' => 4
            ],
            [
                'key' => 'social_linkedin',
                'type' => 'url',
                'group' => 'social',
                'label' => 'LinkedIn',
                'value' => '',
                'description' => 'URL profil LinkedIn',
                'order' => 5
            ],
            [
                'key' => 'social_tiktok',
                'type' => 'url',
                'group' => 'social',
                'label' => 'TikTok',
                'value' => '',
                'description' => 'URL profil TikTok',
                'order' => 6
            ]
        ];

        $created = 0;
        $updated = 0;

        foreach ($defaults as $setting) {
            $existing = SiteSetting::where('key', $setting['key'])->first();
            
            if ($existing) {
                $existing->update($setting);
                $updated++;
                $this->line("Updated: {$setting['label']}");
            } else {
                SiteSetting::create($setting);
                $created++;
                $this->line("Created: {$setting['label']}");
            }
        }

        $this->info("Default settings initialized successfully!");
        $this->info("Created: {$created} settings");
        $this->info("Updated: {$updated} settings");

        return Command::SUCCESS;
    }
}
