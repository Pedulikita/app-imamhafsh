<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShareSiteSettings
{
    public function handle(Request $request, Closure $next)
    {
        // Share settings data dengan semua halaman Inertia
        Inertia::share([
            'siteSettings' => function () {
                try {
                    $contactSettings = SiteSetting::getByGroup('contact');
                    $socialSettings = SiteSetting::getByGroup('social');
                    
                    return [
                        'contact' => is_array($contactSettings) ? $contactSettings : [],
                        'social' => is_array($socialSettings) ? $socialSettings : [],
                    ];
                } catch (\Exception $e) {
                    // Log error dan return default structure
                    \Log::warning('Error loading site settings: ' . $e->getMessage());
                    return [
                        'contact' => [],
                        'social' => [],
                    ];
                }
            }
        ]);

        return $next($request);
    }
}