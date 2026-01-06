<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Article;
use App\Models\DonationEmbed;
use App\Models\HeroSlide;
use App\Models\HomeSection;
use App\Models\TeamMember;
use App\Models\Testimony;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('public/home', [
            'canRegister' => Features::enabled(Features::registration()),
            'heroSlides' => $this->getHeroSlides(),
            'homeSections' => $this->getHomeSections(),
            'latestArticles' => $this->getLatestArticles(),
            'testimonies' => $this->getTestimonies(),
            'mentors' => $this->getMentors(),
            'activities' => $this->getActivities(),
            'donationEmbeds' => $this->getDonationEmbeds(),
        ]);
    }

    private function getHeroSlides()
    {
        return HeroSlide::active()->ordered()->get();
    }

    private function getHomeSections()
    {
        return HomeSection::active()->ordered()->get()->keyBy('section_key');
    }

    private function getLatestArticles()
    {
        return Article::where('status', 'published')
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                    'excerpt' => $article->excerpt,
                    'image' => $article->featured_image,
                    'category' => $article->category,
                    'published_at' => $article->published_at,
                    'author' => $article->author->name ?? null,
                ];
            });
    }

    private function getTestimonies()
    {
        return Testimony::active()->ordered()->get()->map(function ($testimony) {
            return [
                'id' => $testimony->id,
                'name' => $testimony->name,
                'role' => $testimony->role,
                'content' => $testimony->text,
                'rating' => $testimony->rating,
                'image' => $testimony->avatar_url,
                'is_active' => $testimony->is_active,
            ];
        });
    }

    private function getMentors()
    {
        return TeamMember::active()->ordered()->take(10)->get()->map(function ($member) {
            return [
                'id' => $member->id,
                'name' => $member->name,
                'title' => $member->role,
                'quote' => $member->description,
                'img' => $member->image,
                'category' => $member->category,
            ];
        });
    }

    private function getActivities()
    {
        return Activity::active()->ordered()->take(9)->get()->map(function ($activity) {
            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'src' => $activity->image,
                'category' => $activity->category,
            ];
        });
    }

    private function getDonationEmbeds()
    {
        return DonationEmbed::active()->ordered()->get()->map(function ($embed) {
            return [
                'id' => $embed->id,
                'title' => $embed->title,
                'description' => $embed->description,
                'embed_url' => $embed->embed_url,
                'direct_url' => $embed->direct_url,
                'collected_amount' => $embed->collected_amount,
                'target_amount' => $embed->target_amount,
                'formatted_collected_amount' => $embed->formatted_collected_amount,
                'formatted_target_amount' => $embed->formatted_target_amount,
                'progress_percentage' => $embed->progress_percentage,
                'donors_count' => $embed->donors_count,
                'image_url' => $embed->image_url,
                'additional_info' => $embed->additional_info,
            ];
        });
    }
}