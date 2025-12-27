import React, { FormEvent, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { RichTextEditor } from '@/components/rich-text-editor';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  featured_image: string | null;
  category_id: number | null;
  category: Category | null;
  tags: string[] | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  author: User;
}

interface PageProps {
  article: Article;
  categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Articles',
    href: '/admin/articles',
  },
  {
    title: 'Edit Artikel',
  },
];

export default function ArticlesEdit() {
  const { article, categories } = usePage<PageProps>().props;
  const [formData, setFormData] = useState({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    content: article.content,
    meta_title: article.meta_title || '',
    meta_description: article.meta_description || '',
    category_id: article.category_id?.toString() || '',
    tags: article.tags ? article.tags.join(', ') : '',
    status: article.status,
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(article.featured_image);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    if (formData.slug) data.append('slug', formData.slug);
    if (formData.excerpt) data.append('excerpt', formData.excerpt);
    data.append('content', formData.content);
    if (formData.meta_title) data.append('meta_title', formData.meta_title);
    if (formData.meta_description) data.append('meta_description', formData.meta_description);
    if (formData.category_id) data.append('category_id', formData.category_id);
    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      tagsArray.forEach((tag, index) => {
        data.append(`tags[${index}]`, tag);
      });
    }
    data.append('status', formData.status);
    if (featuredImage) {
      data.append('featured_image', featuredImage);
    }
    data.append('_method', 'PUT');

    router.post(`/admin/articles/${article.id}`, data, {
      onError: (errors) => setErrors(errors as Record<string, string>),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Artikel" />

      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/articles">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Artikel</h1>
            <p className="text-sm text-muted-foreground">Update artikel "{article.title}"</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title & Slug */}
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Artikel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul artikel..."
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
                  placeholder="otomatis-dari-judul"
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                <p className="text-xs text-muted-foreground">URL: /article/{formData.slug || 'slug'}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat artikel..."
                  rows={3}
                />
                {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt}</p>}
              </div>
            </div>

            {/* Content */}
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-2">
              <Label htmlFor="content">Konten Artikel *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Tulis konten artikel di sini..."
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            </div>

            {/* SEO */}
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
              <h3 className="font-semibold">SEO Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Judul untuk SEO (opsional)"
                />
                {errors.meta_title && <p className="text-sm text-red-500">{errors.meta_title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Deskripsi untuk search engine..."
                  rows={3}
                />
                {errors.meta_description && <p className="text-sm text-red-500">{errors.meta_description}</p>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish */}
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
              <h3 className="font-semibold">Publikasi</h3>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Penulis: {article.author.name}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="flex-1">Update</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/articles">Batal</Link>
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
              <h3 className="font-semibold">Featured Image</h3>
              
              {previewImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="featured_image">Ganti Gambar</Label>
                <Input
                  id="featured_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.featured_image && <p className="text-sm text-red-500">{errors.featured_image}</p>}
                <p className="text-xs text-muted-foreground">Max 2MB (JPG, PNG, WebP)</p>
              </div>
            </div>

            {/* Category */}
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
              <h3 className="font-semibold">Kategori</h3>
              
              <div className="space-y-2">
                <Label htmlFor="category_id">Pilih Kategori</Label>
                <select
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Tanpa Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
              <h3 className="font-semibold">Tags</h3>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="berita, pendidikan, kegiatan"
                />
                {errors.tags && <p className="text-sm text-red-500">{errors.tags}</p>}
                <p className="text-xs text-muted-foreground">Contoh: berita, kegiatan, prestasi</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
