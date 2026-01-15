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
                    // Get fresh data without cache
                    $contactSettings = SiteSetting::where('group', 'contact')
                        ->where('is_active', true)
                        ->orderBy('order')
                        ->get(['key', 'value', 'label'])
                        ->map(function($item) {
                            return [
                                'key' => $item->key,
                                'value' => $item->value ?? '',
                                'label' => $item->label
                            ];
                        })
                        ->toArray();
                        
                    $socialSettings = SiteSetting::where('group', 'social')
                        ->where('is_active', true)
                        ->orderBy('order')
                        ->get(['key', 'value', 'label'])
                        ->map(function($item) {
                            return [
                                'key' => $item->key,
                                'value' => $item->value ?? '',
                                'label' => $item->label
                            ];
                        })
                        ->toArray();
                    
                    $generalSettings = SiteSetting::where('group', 'general')
                        ->where('is_active', true)
                        ->orderBy('order')
                        ->get(['key', 'value', 'label'])
                        ->map(function($item) {
                            return [
                                'key' => $item->key,
                                'value' => $item->value ?? '',
                                'label' => $item->label
                            ];
                        })
                        ->toArray();
                    
                    \Log::debug('Site settings loaded', [
                        'contact_count' => count($contactSettings),
                        'social_count' => count($socialSettings),
                        'general_count' => count($generalSettings),
                        'contact' => $contactSettings,
                        'social' => $socialSettings,
                        'general' => $generalSettings
                    ]);
                    
                    return [
                        'contact' => $contactSettings,
                        'social' => $socialSettings,
                        'general' => $generalSettings,
                    ];
                } catch (\Exception $e) {
                    // Log error dan return default structure
                    \Log::error('Error loading site settings: ' . $e->getMessage(), [
                        'exception' => $e->getTraceAsString()
                    ]);
                    return [
                        'contact' => [],
                        'social' => [],
                        'general' => [],
                    ];
                }
            }
        ]);

        return $next($request);
    }
}