<?php

namespace App\Http\Controllers;

use App\Models\ProfilePage;
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
        
        return Inertia::render('public/about', [
            'page' => $page,
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
}