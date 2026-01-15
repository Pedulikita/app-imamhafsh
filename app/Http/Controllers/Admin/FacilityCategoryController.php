<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FacilityCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilityCategoryController extends Controller
{
    public function index()
    {
        $categories = FacilityCategory::ordered()->get();

        return Inertia::render('Admin/Facilities/Categories', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:facility_categories,name',
            'order' => 'nullable|integer',
            'is_active' => 'boolean'
        ]);

        FacilityCategory::create($validated);

        return back()->with('success', 'Kategori berhasil ditambahkan');
    }

    public function update(Request $request, FacilityCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:facility_categories,name,' . $category->id,
            'order' => 'nullable|integer',
            'is_active' => 'boolean'
        ]);

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroy(FacilityCategory $category)
    {
        // Check if category is being used
        $facilityCount = $category->facilities()->count();
        
        if ($facilityCount > 0) {
            return back()->with('error', "Tidak dapat menghapus kategori. Masih ada {$facilityCount} fasilitas yang menggunakan kategori ini.");
        }

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:facility_categories,id',
            'categories.*.order' => 'required|integer'
        ]);

        foreach ($validated['categories'] as $item) {
            FacilityCategory::where('id', $item['id'])
                ->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Urutan kategori berhasil diperbarui');
    }
}
