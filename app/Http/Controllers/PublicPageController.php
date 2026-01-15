<?php

namespace App\Http\Controllers;

use App\Models\ProfilePage;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicPageController extends Controller
{
    public function about()
    {
        $page = ProfilePage::active()
            ->where('slug', 'profile-imam-hafsh-islamic-school')
            ->orWhere(function($query) {
                $query->active()->ordered()->limit(1);
            })
            ->first();
        
        $siteSettings = [
            'contact' => SiteSetting::getGroupAsArray('contact'),
            'social' => SiteSetting::getGroupAsArray('social'),
            'achievement_banner' => SiteSetting::getGroupAsArray('achievement_banner'),
        ];
        
        return Inertia::render('public/about', [
            'page' => $page,
            'siteSettings' => $siteSettings,
        ]);
    }

    public function nilai()
    {
        $page = ProfilePage::active()
            ->where('slug', 'like', '%nilai%')
            ->first();
        
        return Inertia::render('public/about', [
            'page' => $page,
        ]);
    }

    public function mutu()
    {
        $page = ProfilePage::active()
            ->where('slug', 'like', '%mutu%')
            ->first();
        
        return Inertia::render('public/about', [
            'page' => $page,
        ]);
    }

    public function kurikulum()
    {
        $page = ProfilePage::active()
            ->where('slug', 'like', '%kurikulum%')
            ->first();

        return Inertia::render('public/about', [
            'page' => $page,
        ]);
    }

    public function privacy()
    {
        $content = \App\Models\LegalContent::getValue('privacy_content', '');
        
        return Inertia::render('public/privacy', [
            'content' => $content,
        ]);
    }

    public function terms()
    {
        $content = \App\Models\LegalContent::getValue('terms_content', '');
        
        return Inertia::render('public/terms', [
            'content' => $content,
        ]);
    }
}