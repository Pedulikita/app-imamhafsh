import React, { FormEvent, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeftIcon, Upload } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { RichTextEditor } from '@/components/rich-text-editor';

interface ProfilePage {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  hero_image: string | null;
  content_image: string | null;
  content_thumbnail: string | null;
  sidebar_image: string | null;
  sidebar_bg_color: string | null;
  sidebar_header_color: string | null;
  sidebar_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  order: number;
}

interface PageProps extends InertiaPageProps {
  page: ProfilePage;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Profile Pages',
    href: '/admin/profile-pages',
  },
  {
    title: 'Edit Halaman',
  },
];

export default function EditProfilePage() {
  const { page } = usePage<PageProps>().props;

  const [formData, setFormData] = useState({
    title: page.title,
    slug: page.slug,
    content: page.content,
    meta_description: page.meta_description || '',
    is_active: page.is_active,
    order: page.order,
    sidebar_bg_color: page.sidebar_bg_color || 'blue-50',
    sidebar_header_color: page.sidebar_header_color || 'blue-600',
    sidebar_title: page.sidebar_title || '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [contentImage, setContentImage] = useState<File | null>(null);
  const [contentThumbnail, setContentThumbnail] = useState<File | null>(null);
  const [sidebarImage, setSidebarImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(page.image);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(page.hero_image);
  const [contentImagePreview, setContentImagePreview] = useState<string | null>(page.content_image);
  const [contentThumbnailPreview, setContentThumbnailPreview] = useState<string | null>(page.content_thumbnail);
  const [sidebarImagePreview, setSidebarImagePreview] = useState<string | null>(page.sidebar_image);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImage(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleContentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContentImage(file);
      setContentImagePreview(URL.createObjectURL(file));
    }
  };

  const handleContentThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContentThumbnail(file);
      setContentThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSidebarImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSidebarImage(file);
      setSidebarImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('_method', 'PUT');
    data.append('title', formData.title);
    data.append('slug', formData.slug);
    data.append('content', formData.content);
    data.append('meta_description', formData.meta_description);
    data.append('is_active', formData.is_active ? '1' : '0');
    data.append('order', formData.order.toString());
    data.append('sidebar_bg_color', formData.sidebar_bg_color);
    data.append('sidebar_header_color', formData.sidebar_header_color);
    data.append('sidebar_title', formData.sidebar_title);

    if (image) {
      data.append('image', image);
      console.log('Appending main image:', image.name);
    }
    if (heroImage) {
      data.append('hero_image', heroImage);
      console.log('Appending hero image:', heroImage.name);
    }
    if (contentImage) {
      data.append('content_image', contentImage);
      console.log('Appending content image:', contentImage.name);
    }
    if (contentThumbnail) {
      data.append('content_thumbnail', contentThumbnail);
      console.log('Appending content thumbnail:', contentThumbnail.name);
    }
    if (sidebarImage) {
      data.append('sidebar_image', sidebarImage);
      console.log('Appending sidebar image:', sidebarImage.name);
    }

    console.log('Edit form data being sent:', Array.from(data.entries()));

    router.post(`/admin/profile-pages/${page.id}`, data, {
      forceFormData: true,
      onSuccess: () => {
        console.log('Profile page updated successfully');
        router.visit('/admin/profile-pages');
      },
      onError: (errors) => {
        setErrors(errors);
        console.error('Update Profile Page errors:', errors);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${page.title}`} />

      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/profile-pages">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Halaman Profil</h1>
            <p className="text-sm text-muted-foreground">Perbarui halaman profil</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Basic Info */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Halaman *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul halaman"
                required
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="contoh: profile-sekolah"
              />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Urutan</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
              {errors.order && <p className="text-sm text-red-500">{errors.order}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_active">Aktifkan halaman</Label>
            </div>
          </div>

          {/* Main Image */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-2">
            <Label htmlFor="image">Gambar Utama</Label>
            <div className="space-y-2">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full max-w-md rounded-lg" />
              )}
              <div className="flex items-center gap-2">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Kosongkan jika tidak ingin mengubah gambar</p>
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-2">
            <Label htmlFor="hero_image">Gambar Hero (Banner Atas)</Label>
            <div className="space-y-2">
              {heroImagePreview && (
                <img src={heroImagePreview} alt="Hero Preview" className="w-full max-w-md rounded-lg" />
              )}
              <div className="flex items-center gap-2">
                <Input id="hero_image" type="file" accept="image/*" onChange={handleHeroImageChange} />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Kosongkan jika tidak ingin mengubah gambar</p>
              {errors.hero_image && <p className="text-sm text-red-500">{errors.hero_image}</p>}
            </div>
          </div>

          {/* Content Images */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
            <h3 className="text-lg font-medium">Gambar Konten</h3>
            
            {/* Content Image */}
            <div className="space-y-2">
              <Label htmlFor="content_image">Gambar Konten Utama</Label>
              {contentImagePreview && (
                <img src={contentImagePreview} alt="Content Preview" className="w-full max-w-md rounded-lg" />
              )}
              <div className="flex items-center gap-2">
                <Input id="content_image" type="file" accept="image/*" onChange={handleContentImageChange} />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Kosongkan jika tidak ingin mengubah gambar</p>
              {errors.content_image && <p className="text-sm text-red-500">{errors.content_image}</p>}
            </div>

            {/* Content Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="content_thumbnail">Thumbnail Konten</Label>
              {contentThumbnailPreview && (
                <img src={contentThumbnailPreview} alt="Thumbnail Preview" className="w-32 h-20 object-cover rounded-lg" />
              )}
              <div className="flex items-center gap-2">
                <Input id="content_thumbnail" type="file" accept="image/*" onChange={handleContentThumbnailChange} />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Kosongkan jika tidak ingin mengubah gambar</p>
              {errors.content_thumbnail && <p className="text-sm text-red-500">{errors.content_thumbnail}</p>}
            </div>
          </div>

          {/* Sidebar Configuration */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
            <h3 className="text-lg font-medium">Konfigurasi Sidebar</h3>
            
            {/* Sidebar Image */}
            <div className="space-y-2">
              <Label htmlFor="sidebar_image">Gambar Sidebar</Label>
              {sidebarImagePreview && (
                <img src={sidebarImagePreview} alt="Sidebar Preview" className="w-full max-w-md rounded-lg" />
              )}
              <div className="flex items-center gap-2">
                <Input id="sidebar_image" type="file" accept="image/*" onChange={handleSidebarImageChange} />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Kosongkan jika tidak ingin mengubah gambar</p>
              {errors.sidebar_image && <p className="text-sm text-red-500">{errors.sidebar_image}</p>}
            </div>

            {/* Sidebar Title */}
            <div className="space-y-2">
              <Label htmlFor="sidebar_title">Judul Sidebar</Label>
              <Input
                id="sidebar_title"
                value={formData.sidebar_title}
                onChange={(e) => setFormData({ ...formData, sidebar_title: e.target.value })}
                placeholder="Masukkan judul custom untuk sidebar"
              />
              {errors.sidebar_title && <p className="text-sm text-red-500">{errors.sidebar_title}</p>}
            </div>

            {/* Sidebar Background Color */}
            <div className="space-y-2">
              <Label htmlFor="sidebar_bg_color">Warna Background Sidebar</Label>
              <select
                id="sidebar_bg_color"
                value={formData.sidebar_bg_color}
                onChange={(e) => setFormData({ ...formData, sidebar_bg_color: e.target.value })}
                className="w-full rounded-md border border-gray-300 bg-background px-3 py-2"
              >
                <option value="blue-50">Biru Muda</option>
                <option value="green-50">Hijau Muda</option>
                <option value="red-50">Merah Muda</option>
                <option value="yellow-50">Kuning Muda</option>
                <option value="purple-50">Ungu Muda</option>
                <option value="gray-50">Abu-abu Muda</option>
              </select>
              {errors.sidebar_bg_color && <p className="text-sm text-red-500">{errors.sidebar_bg_color}</p>}
            </div>

            {/* Sidebar Header Color */}
            <div className="space-y-2">
              <Label htmlFor="sidebar_header_color">Warna Header Sidebar</Label>
              <select
                id="sidebar_header_color"
                value={formData.sidebar_header_color}
                onChange={(e) => setFormData({ ...formData, sidebar_header_color: e.target.value })}
                className="w-full rounded-md border border-gray-300 bg-background px-3 py-2"
              >
                <option value="blue-600">Biru Gelap</option>
                <option value="green-600">Hijau Gelap</option>
                <option value="red-600">Merah Gelap</option>
                <option value="yellow-600">Kuning Gelap</option>
                <option value="purple-600">Ungu Gelap</option>
                <option value="gray-600">Abu-abu Gelap</option>
              </select>
              {errors.sidebar_header_color && <p className="text-sm text-red-500">{errors.sidebar_header_color}</p>}
            </div>
          </div>

          {/* Content */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-2">
            <Label htmlFor="content">Konten Halaman *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Tulis konten halaman di sini..."
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
          </div>

          {/* Meta */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-2">
            <Label htmlFor="meta_description">Meta Description (SEO)</Label>
            <Input
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Deskripsi singkat untuk SEO (max 160 karakter)"
              maxLength={160}
            />
            {errors.meta_description && <p className="text-sm text-red-500">{errors.meta_description}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/profile-pages">Batal</Link>
            </Button>
            <Button type="submit">Perbarui Halaman</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
