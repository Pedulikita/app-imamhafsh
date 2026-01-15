<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PPDBSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PPDBSettingController extends Controller
{
    public function index()
    {
        $settings = PPDBSetting::ordered()->get()->keyBy('section_key');
        
        return Inertia::render('Admin/PPDB/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, $sectionKey)
    {
        $validated = $request->validate([
            'content' => 'required|array',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $setting = PPDBSetting::updateOrCreate(
            ['section_key' => $sectionKey],
            $validated
        );

        return redirect()->back()->with('success', 'PPDB settings updated successfully.');
    }

    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            $path = $request->file('image')->store('ppdb', 'public');

            return response()->json([
                'success' => true,
                'path' => '/storage/' . $path,
            ]);
        } catch (\Exception $e) {
            \Log::error('PPDB Image upload failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
