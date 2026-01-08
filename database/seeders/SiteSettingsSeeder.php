<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing settings
        SiteSetting::truncate();
        
        $defaults = [
            // Contact Information
            [
                'key' => 'contact_address',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Alamat',
                'value' => 'Gg. Al-Fitroh Jl. Kemang Kiara, Kemang, Kec. Kemang, Kabupaten Bogor, Jawa Barat 16310',
                'description' => 'Alamat lengkap institusi',
                'order' => 1,
                'is_active' => true
            ],
            [
                'key' => 'contact_phone',
                'type' => 'phone',
                'group' => 'contact',
                'label' => 'Telepon',
                'value' => '08111178847',
                'description' => 'Nomor telepon utama',
                'order' => 2,
                'is_active' => true
            ],
            [
                'key' => 'contact_whatsapp',
                'type' => 'phone',
                'group' => 'contact',
                'label' => 'WhatsApp',
                'value' => '08111178847',
                'description' => 'Nomor WhatsApp',
                'order' => 3,
                'is_active' => true
            ],
            [
                'key' => 'contact_email',
                'type' => 'email',
                'group' => 'contact',
                'label' => 'Email',
                'value' => 'info@imamhafsh.com',
                'description' => 'Email utama institusi',
                'order' => 4,
                'is_active' => true
            ],
            
            // Social Media
            [
                'key' => 'social_facebook',
                'type' => 'url',
                'group' => 'social',
                'label' => 'Facebook',
                'value' => '',
                'description' => 'URL halaman Facebook',
                'order' => 1,
                'is_active' => true
            ],
            [
                'key' => 'social_instagram',
                'type' => 'url',
                'group' => 'social',
                'label' => 'Instagram',
                'value' => '',
                'description' => 'URL profil Instagram',
                'order' => 2,
                'is_active' => true
            ],
            [
                'key' => 'social_youtube',
                'type' => 'url',
                'group' => 'social',
                'label' => 'YouTube',
                'value' => '',
                'description' => 'URL channel YouTube',
                'order' => 3,
                'is_active' => true
            ],
            [
                'key' => 'social_twitter',
                'type' => 'url',
                'group' => 'social',
                'label' => 'Twitter',
                'value' => '',
                'description' => 'URL profil Twitter',
                'order' => 4,
                'is_active' => true
            ],
            [
                'key' => 'social_linkedin',
                'type' => 'url',
                'group' => 'social',
                'label' => 'LinkedIn',
                'value' => '',
                'description' => 'URL profil LinkedIn',
                'order' => 5,
                'is_active' => true
            ],
            [
                'key' => 'social_tiktok',
                'type' => 'url',
                'group' => 'social',
                'label' => 'TikTok',
                'value' => '',
                'description' => 'URL profil TikTok',
                'order' => 6,
                'is_active' => true
            ]
        ];
        
        foreach ($defaults as $setting) {
            SiteSetting::create($setting);
        }
        
        $this->command->info('Site settings seeded successfully!');
    }
}
