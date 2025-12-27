import React, { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeftIcon } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Pages',
    href: '/pages',
  },
  {
    title: 'Tambah Halaman',
  },
];

export default function CreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    is_published: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    router.post('/pages', formData, {
      onError: (errors) => {
        setErrors(errors);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Halaman" />

      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/pages">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Tambah Halaman</h1>
            <p className="text-sm text-muted-foreground">Buat halaman baru</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="contoh: tentang-kami (kosongkan untuk otomatis)"
              />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_published">Publikasikan halaman</Label>
            </div>
          </div>

          {/* Content */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-2">
            <Label htmlFor="content">Konten Halaman *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Tulis konten halaman di sini..."
              rows={15}
              required
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
            <h3 className="font-semibold">SEO</h3>
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Judul untuk SEO (max 60 karakter)"
                maxLength={60}
              />
              {errors.meta_title && <p className="text-sm text-red-500">{errors.meta_title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Deskripsi singkat untuk SEO (max 160 karakter)"
                maxLength={160}
                rows={3}
              />
              {errors.meta_description && <p className="text-sm text-red-500">{errors.meta_description}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/pages">Batal</Link>
            </Button>
            <Button type="submit">Simpan Halaman</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
