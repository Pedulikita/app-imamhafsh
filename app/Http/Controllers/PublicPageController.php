<?php

namespace App\Http\Controllers;

use App\Models\ProfilePage;
use App\Models\SiteSetting;
use App\Models\KebijakanContent;
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

    public function kebijakan()
    {
        $content = KebijakanContent::active()->ordered()->first();
        
        if ($content) {
            $content = [
                'id' => $content->id,
                'hero_badge' => $content->hero_badge,
                'hero_title' => $content->hero_title,
                'hero_subtitle' => $content->hero_subtitle,
                'hero_image' => $content->hero_image,
                'hero_image_url' => $content->hero_image_url,
                'intro_title' => $content->intro_title,
                'intro_content' => $content->intro_content,
                'bullying_title' => $content->bullying_title,
                'bullying_content' => $content->bullying_content,
                'bullying_points' => $content->bullying_points,
                'bullying_image' => $content->bullying_image,
                'bullying_image_url' => $content->bullying_image_url,
                'lgbt_title' => $content->lgbt_title,
                'lgbt_content' => $content->lgbt_content,
                'lgbt_points' => $content->lgbt_points,
                'lgbt_image' => $content->lgbt_image,
                'lgbt_image_url' => $content->lgbt_image_url,
                'environment_title' => $content->environment_title,
                'environment_content' => $content->environment_content,
                'environment_features' => $content->environment_features,
                'environment_image' => $content->environment_image,
                'environment_image_url' => $content->environment_image_url,
                'commitment_title' => $content->commitment_title,
                'commitment_content' => $content->commitment_content,
                'commitment_items' => $content->commitment_items,
            ];
        }
        
        return Inertia::render('public/kebijakan', [
            'content' => $content,
        ]);
    }
}