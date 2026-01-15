<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegalContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalContentController extends Controller
{
    public function editPrivacy()
    {
        $content = LegalContent::getValue('privacy_content', '');
        
        return Inertia::render('Admin/Legal/Privacy', [
            'content' => $content,
        ]);
    }

    public function updatePrivacy(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        LegalContent::updateOrCreate(
            ['key' => 'privacy_content'],
            ['value' => $request->content]
        );

        return back()->with('success', 'Kebijakan Privasi berhasil diperbarui');
    }

    public function editTerms()
    {
        $content = LegalContent::getValue('terms_content', '');
        
        return Inertia::render('Admin/Legal/Terms', [
            'content' => $content,
        ]);
    }

    public function updateTerms(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        LegalContent::updateOrCreate(
            ['key' => 'terms_content'],
            ['value' => $request->content]
        );

        return back()->with('success', 'Syarat & Ketentuan berhasil diperbarui');
    }
}
