<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DonationEmbed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationEmbedController extends Controller
{
    public function index()
    {
        $donationEmbeds = DonationEmbed::ordered()->get();
        
        return Inertia::render('Admin/DonationEmbeds/Index', [
            'donationEmbeds' => $donationEmbeds
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/DonationEmbeds/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'embed_url' => [
                'required',
                'url',
                'regex:/^https:\/\/temenbaik\.com\/.*/'
            ],
            'direct_url' => [
                'required',
                'url', 
                'regex:/^https:\/\/temenbaik\.com\/.*/'
            ],
            'target_amount' => 'required|numeric|min:0',
            'collected_amount' => 'nullable|numeric|min:0',
            'donors_count' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'additional_info' => 'nullable|string|max:2000',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer'
        ], [
            'embed_url.regex' => 'Embed URL harus berasal dari https://temenbaik.com/',
            'direct_url.regex' => 'Direct URL harus berasal dari https://temenbaik.com/',
        ]);

        $data = $request->all();
        $data['collected_amount'] = $data['collected_amount'] ?? 0;
        $data['donors_count'] = $data['donors_count'] ?? 0;
        $data['sort_order'] = $data['sort_order'] ?? DonationEmbed::max('sort_order') + 1;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('donation-embeds', 'public');
            $data['image_url'] = '/storage/' . $imagePath;
        }
        unset($data['image']); // Remove image file from data array

        DonationEmbed::create($data);

        return redirect()->route('donation-embeds.index')
            ->with('success', 'Donation embed created successfully.');
    }

    public function show(DonationEmbed $donationEmbed)
    {
        return Inertia::render('Admin/DonationEmbeds/Show', [
            'donationEmbed' => $donationEmbed
        ]);
    }

    public function edit(DonationEmbed $donationEmbed)
    {
        return Inertia::render('Admin/DonationEmbeds/Edit', [
            'donationEmbed' => $donationEmbed
        ]);
    }

    public function update(Request $request, DonationEmbed $donationEmbed)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'embed_url' => [
                'required',
                'url',
                'regex:/^https:\/\/temenbaik\.com\/.*/'
            ],
            'direct_url' => [
                'required',
                'url', 
                'regex:/^https:\/\/temenbaik\.com\/.*/'
            ],
            'target_amount' => 'required|numeric|min:0',
            'collected_amount' => 'nullable|numeric|min:0',
            'donors_count' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'additional_info' => 'nullable|string|max:2000',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer'
        ], [
            'embed_url.regex' => 'Embed URL harus berasal dari https://temenbaik.com/',
            'direct_url.regex' => 'Direct URL harus berasal dari https://temenbaik.com/',
        ]);

        $data = $request->all();
        $data['collected_amount'] = $data['collected_amount'] ?? 0;
        $data['donors_count'] = $data['donors_count'] ?? 0;

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($donationEmbed->image_url && \Illuminate\Support\Facades\Storage::disk('public')->exists(str_replace('/storage/', '', $donationEmbed->image_url))) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $donationEmbed->image_url));
            }
            
            $imagePath = $request->file('image')->store('donation-embeds', 'public');
            $data['image_url'] = '/storage/' . $imagePath;
        }
        unset($data['image']); // Remove image file from data array

        $donationEmbed->update($data);

        return redirect()->route('donation-embeds.index')
            ->with('success', 'Donation embed updated successfully.');
    }

    public function destroy(DonationEmbed $donationEmbed)
    {
        $donationEmbed->delete();

        return redirect()->route('admin.donation-embeds.index')
            ->with('success', 'Donation embed deleted successfully.');
    }
}
