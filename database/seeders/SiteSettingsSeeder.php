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
            [
                'key' => 'contact_description',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Deskripsi Lokasi',
                'value' => 'Lokasi strategis boarding school sangat strategis dan asri, dengan dikelilingi sawah, bukit, dan view gunung Salak Bogor.',
                'description' => 'Deskripsi singkat tentang lokasi sekolah',
                'order' => 5,
                'is_active' => true
            ],
            [
                'key' => 'contact_map_embed',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Google Maps Embed URL',
                'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.150711139771!2d106.73816268477667!3d-6.5025976467700355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c3af7cf49cff%3A0x31c36e13b0f3b5f2!2sMAHAD%20IMAM%20HAFSH!5e0!3m2!1sen!2sid!4v1768376416507!5m2!1sen!2sid',
                'description' => 'URL embed Google Maps',
                'order' => 6,
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
            ],
            
            // General Settings
            [
                'key' => 'site_name',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Nama Situs',
                'value' => 'Imam Hafsh Islamic Boarding School',
                'description' => 'Nama website/sekolah',
                'order' => 1,
                'is_active' => true
            ],
            [
                'key' => 'site_tagline',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Tagline',
                'value' => 'Pendidikan, Adab, dan Prestasi',
                'description' => 'Tagline atau motto sekolah',
                'order' => 2,
                'is_active' => true
            ],
            [
                'key' => 'site_description',
                'type' => 'textarea',
                'group' => 'general',
                'label' => 'Deskripsi Situs',
                'value' => 'Pondok pesantren dengan Aqidah Ahlussunnah wal Jama\'ah. Pembelajaran dan pengasuhan terarah untuk memahami Alquran dan As-Sunnah secara mendalam.',
                'description' => 'Deskripsi singkat website',
                'order' => 3,
                'is_active' => true
            ],
            [
                'key' => 'site_logo',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Logo Situs',
                'value' => '/images/logo.png',
                'description' => 'Path logo website',
                'order' => 4,
                'is_active' => true
            ]
        ];
        
        foreach ($defaults as $setting) {
            SiteSetting::create($setting);
        }
        
        $this->command->info('Site settings seeded successfully!');
    }
}
