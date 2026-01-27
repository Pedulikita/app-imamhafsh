<?php

namespace App\Http\Controllers;

use App\Models\DonationEmbed;
use Inertia\Inertia;

class PublicDonationController extends Controller
{
    public function index()
    {
        $donations = DonationEmbed::active()
            ->ordered()
            ->get()
            ->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'title' => $donation->title,
                    'description' => $donation->description,
                    'embed_url' => $donation->embed_url,
                    'direct_url' => $donation->direct_url,
                    'collected_amount' => $donation->collected_amount,
                    'target_amount' => $donation->target_amount,
                    'currency' => $donation->currency,
                    'donors_count' => $donation->donors_count,
                    'image_url' => $donation->image_url,
                    'progress_percentage' => $donation->progress_percentage,
                    'additional_info' => $donation->additional_info,
                ];
            });

        return Inertia::render('public/all-donasi', [
            'donations' => $donations
        ]);
    }
}
