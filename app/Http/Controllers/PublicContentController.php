<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use App\Models\Project;
use App\Models\Activity;
use App\Models\EkstrakurikulerItem;
use App\Models\EkstrakurikulerContent;
use App\Models\Achievement;
use App\Models\Event;
use App\Models\Facility;
use App\Models\LiterasiContent;
use App\Models\Testimony;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicContentController extends Controller
{
    public function team()
    {
        return Inertia::render('public/team', [
            'teamMembers' => TeamMember::active()->ordered()->get()->groupBy('category'),
        ]);
    }

    public function project()
    {
        return Inertia::render('public/project', [
            'projects' => Project::active()->ordered()->get(),
            'categories' => Project::active()->distinct()->pluck('category'),
        ]);
    }

    public function activities()
    {
        return Inertia::render('public/activities', [
            'activities' => Activity::active()->ordered()->get(),
            'categories' => Activity::active()->distinct()->pluck('category'),
        ]);
    }

    public function ekstrakurikuler()
    {
        $content = EkstrakurikulerContent::getAllContent();
        
        return Inertia::render('public/ekstrakurikuler', [
            'items' => EkstrakurikulerItem::active()->ordered()->get(),
            'events' => Event::active()->ordered()->get(),
            'categories' => Event::active()->distinct()->pluck('category'),
            'content' => $content,
        ]);
    }

    public function achievements()
    {
        return Inertia::render('public/achievements', [
            'achievements' => Achievement::active()->ordered()->get(),
        ]);
    }

    public function literasi()
    {
        $content = LiterasiContent::active()->ordered()->first();
        
        return Inertia::render('public/literasi', [
            'content' => $content,
        ]);
    }

    public function fasilitas()
    {
        $facilities = Facility::active()->ordered()->get();
        $categories = \App\Models\FacilityCategory::active()->ordered()->pluck('name')->toArray();

        return Inertia::render('public/fasilitas', [
            'facilities' => $facilities,
            'categories' => $categories,
        ]);
    }

    public function events()
    {
        return Inertia::render('public/events', [
            'events' => Event::active()->ordered()->get(),
        ]);
    }

    public function testimoni()
    {
        return Inertia::render('public/testimoni', [
            'testimonies' => Testimony::active()->ordered()->get(),
            'featured' => Testimony::active()->featured()->first(),
        ]);
    }

    public function pendaftaran()
    {
        $settings = \App\Models\PPDBSetting::active()->ordered()->get()->keyBy('section_key');
        
        return Inertia::render('public/pendaftaran', [
            'hero' => $settings->get('hero')?->content ?? null,
            'programs' => $settings->get('programs')?->content ?? null,
            'flowSteps' => $settings->get('flow_steps')?->content ?? null,
            'fees' => $settings->get('fees')?->content ?? null,
            'faqs' => $settings->get('faqs')?->content ?? null,
            'gallery' => $settings->get('gallery')?->content ?? null,
            'welcome' => $settings->get('welcome')?->content ?? null,
            'contactWhatsapp' => \App\Models\SiteSetting::get('contact_whatsapp', '+62 081-1117-8847'),
        ]);
    }
}