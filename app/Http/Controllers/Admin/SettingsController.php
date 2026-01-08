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
        SiteSetting::clearCache();

        return back()->with('success', 'Pengaturan berhasil diperbarui');
    }

    protected function bulkUpdate(Request $request)
    {
        $settings = $request->get('settings', []);
        
        foreach ($settings as $id => $data) {
            $setting = SiteSetting::find($id);
            if ($setting) {
                $setting->update([
                    'value' => $data['value'] ?? '',
                    'is_active' => isset($data['is_active']) && $data['is_active'] === 'on'
                ]);
            }
        }

        SiteSetting::clearCache();
        
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

        foreach ($defaults as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        return back()->with('success', 'Pengaturan default berhasil diinisialisasi');
    }
}
