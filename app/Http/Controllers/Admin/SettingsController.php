<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:super-admin|admin');
    }

    public function index()
    {
        $settings = SiteSetting::orderBy('group')->orderBy('order')->get()->groupBy('group');
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function contact()
    {
        $settings = SiteSetting::where('group', 'contact')->orderBy('order')->get();
        return Inertia::render('Admin/Settings/Contact', [
            'settings' => $settings
        ]);
    }

    public function social()
    {
        $settings = SiteSetting::where('group', 'social')->orderBy('order')->get();
        return Inertia::render('Admin/Settings/Social', [
            'settings' => $settings
        ]);
    }

    public function general()
    {
        $settings = SiteSetting::where('group', 'general')->orderBy('order')->get();
        return Inertia::render('Admin/Settings/General', [
            'settings' => $settings
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:255|unique:site_settings,key',
            'type' => 'required|string|in:text,textarea,email,phone,url,json',
            'group' => 'required|string|max:255',
            'label' => 'required|string|max:255',
            'value' => 'nullable|string',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        SiteSetting::create($request->all());

        return back()->with('success', 'Pengaturan berhasil ditambahkan');
    }

    public function update(Request $request, $id = null)
    {
        if ($request->has('bulk_update')) {
            return $this->bulkUpdate($request);
        }

        $setting = SiteSetting::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:255',
            'value' => 'nullable|string',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $setting->update($request->all());
        
        // Clear all caches
        SiteSetting::clearCache();
        \Illuminate\Support\Facades\Cache::flush();

        return back()->with('success', 'Pengaturan berhasil diperbarui');
    }

    protected function bulkUpdate(Request $request)
    {
        $settings = $request->get('settings', []);
        
        foreach ($settings as $id => $data) {
            $setting = SiteSetting::find($id);
            if ($setting) {
                $isActive = filter_var($data['is_active'] ?? false, FILTER_VALIDATE_BOOLEAN);
                
                $setting->update([
                    'value' => $data['value'] ?? '',
                    'is_active' => $isActive
                ]);
                
                \Log::info('Setting updated', [
                    'id' => $id,
                    'key' => $setting->key,
                    'value' => $data['value'] ?? '',
                    'is_active' => $isActive,
                    'raw_is_active' => $data['is_active'] ?? 'not set'
                ]);
            }
        }

        // Clear all caches
        SiteSetting::clearCache();
        \Illuminate\Support\Facades\Cache::flush();
        
        return back()->with('success', 'Pengaturan berhasil diperbarui');
    }

    public function destroy($id)
    {
        $setting = SiteSetting::findOrFail($id);
        $setting->delete();
        
        return back()->with('success', 'Pengaturan berhasil dihapus');
    }

    // Initialize default settings
    public function initializeDefaults()
    {
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
            [
                'key' => 'contact_description',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Deskripsi Lokasi',
                'value' => 'Lokasi strategis boarding school sangat strategis dan asri, dengan dikelilingi sawah, bukit, dan view gunung Salak Bogor.',
                'description' => 'Deskripsi singkat tentang lokasi sekolah',
                'order' => 5
            ],
            [
                'key' => 'contact_map_embed',
                'type' => 'textarea',
                'group' => 'contact',
                'label' => 'Google Maps Embed URL',
                'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.150711139771!2d106.73816268477667!3d-6.5025976467700355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c3af7cf49cff%3A0x31c36e13b0f3b5f2!2sMAHAD%20IMAM%20HAFSH!5e0!3m2!1sen!2sid!4v1768376416507!5m2!1sen!2sid',
                'description' => 'URL embed Google Maps',
                'order' => 6
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
            ],
            
            // General Settings
            [
                'key' => 'site_name',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Nama Situs',
                'value' => 'Imam Hafsh Islamic Boarding School',
                'description' => 'Nama website/sekolah',
                'order' => 1
            ],
            [
                'key' => 'site_tagline',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Tagline',
                'value' => 'Pendidikan, Adab, dan Prestasi',
                'description' => 'Tagline atau motto sekolah',
                'order' => 2
            ],
            [
                'key' => 'site_description',
                'type' => 'textarea',
                'group' => 'general',
                'label' => 'Deskripsi Situs',
                'value' => 'Pondok pesantren dengan Aqidah Ahlussunnah wal Jama\'ah. Pembelajaran dan pengasuhan terarah untuk memahami Alquran dan As-Sunnah secara mendalam.',
                'description' => 'Deskripsi singkat website',
                'order' => 3
            ],
            [
                'key' => 'site_logo',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Logo Situs',
                'value' => '/images/logo.png',
                'description' => 'Path logo website',
                'order' => 4
            ]
        ];

        foreach ($defaults as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        return back()->with('success', 'Pengaturan default berhasil diinisialisasi');
    }
}
