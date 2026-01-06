<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LiterasiContentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'main_content' => 'required|string',
            'features' => 'nullable|array',
            'features.*.title' => 'required|string|max:255',
            'features.*.description' => 'required|string',
            'features.*.icon' => 'nullable|string|max:255',
            'statistics' => 'nullable|array',
            'statistics.*.label' => 'required|string|max:255',
            'statistics.*.value' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'image_path' => 'nullable|string|max:255',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'string|max:255',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'title' => 'judul',
            'subtitle' => 'sub judul',
            'description' => 'deskripsi',
            'main_content' => 'konten utama',
            'features' => 'fitur-fitur',
            'statistics' => 'statistik',
            'image_path' => 'gambar utama',
            'gallery_images' => 'galeri gambar',
            'meta_title' => 'meta title',
            'meta_description' => 'meta description',
            'is_active' => 'status aktif',
            'sort_order' => 'urutan',
        ];
    }
}