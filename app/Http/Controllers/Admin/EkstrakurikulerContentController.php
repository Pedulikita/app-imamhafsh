<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EkstrakurikulerContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EkstrakurikulerContentController extends Controller
{
    public function edit()
    {
        $content = EkstrakurikulerContent::getAllContent();
        
        // Set default values if not exists
        $defaults = [
            'hero_title' => 'Imam Hafsh Islamic Boarding School',
            'hero_subtitle' => 'Sekolah Tahfidz Al-Qur\'an, IT Dan Bahasa',
            'content_description' => '<p>Imam Hafsh Islamic Boarding School memberikan keleluasaan kepada seluruh peserta didik untuk mengikuti kegiatan-kegiatan ekstrakurikuler. Tujuan dari kegiatan-kegiatan tersebut adalah untuk memfasilitasi minat dan bakat peserta didik yang cukup variatif, sehingga output Imam Hafsh ini tidak hanya mumpuni dari sisi kognitif dan afektif tetapi juga secara psikomotorik mampu berkompetisi dengan lulusan-lulusan sekolah lainnya.</p><p>Selain itu, kegiatan ekstrakurikuler merupakan bagian integral dari pengalaman siswa di sekolah yang dapat memberikan manfaat yang signifikan. Diantaranya adalah untuk pengembangan keterampilan di luar lingkungan kelas untuk dapat berbicara di depan umum dalam logika berargumentasi; Menentukan bakat dan minat melalui berbagai kegiatan ekstrakurikuler sehingga siswa dapat memiliki kesempatan untuk menemukan bakat dan minat yang mungkin belum mereka sadari sebelumnya;</p><p>Serta dapat meningkatkan prestasi akademik melalui kegiatan ekstrakurikuler diharapkan membantu meningkatkan keterampilan manajemen waktu, disiplin, dan konsentrasi dalam meraih kesuksesan akademik. Kegiatan ekstrakurikuler Imam Hafsh Islamic Boarding School merupakan kegiatan wajib yang harus diikuti oleh setiap peserta didik. Kegiatan ekstrakurikuler tersebut diantaranya adalah:</p>',
            'gallery_title' => 'Dokumentasi Kegiatan Ekstrakurikuler',
            'gallery_subtitle' => 'Berbagai kegiatan dan prestasi siswa',
        ];

        foreach ($defaults as $key => $value) {
            if (!isset($content[$key])) {
                $content[$key] = $value;
            }
        }

        return Inertia::render('Admin/Ekstrakurikulers/Content', [
            'content' => $content,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_title' => 'required|string|max:255',
            'hero_subtitle' => 'required|string|max:255',
            'content_description' => 'required|string',
            'gallery_title' => 'required|string|max:255',
            'gallery_subtitle' => 'required|string|max:255',
            'collage_image_1' => 'nullable|string|max:500',
            'collage_image_2' => 'nullable|string|max:500',
            'collage_image_3' => 'nullable|string|max:500',
            'collage_image_4' => 'nullable|string|max:500',
        ]);

        foreach ($validated as $key => $value) {
            EkstrakurikulerContent::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return redirect()->back()->with('success', 'Content berhasil diperbarui.');
    }

    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            $path = $request->file('image')->store('ekstrakurikuler', 'public');

            return response()->json([
                'success' => true,
                'path' => '/storage/' . $path,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
