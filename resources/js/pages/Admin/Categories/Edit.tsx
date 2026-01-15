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

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  order: number;
  is_active: boolean;
}

interface PageProps {
  category: Category;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Categories',
    href: '/categories',
  },
  {
    title: 'Edit Kategori',
  },
];

export default function CategoriesEdit() {
  const { category } = usePage<PageProps>().props;
  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    color: category.color,
    order: category.order,
    is_active: category.is_active,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.put(`/categories/${category.id}`, formData, {
      onError: (errors) => setErrors(errors as Record<string, string>),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Kategori" />

      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/categories">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Kategori</h1>
            <p className="text-sm text-muted-foreground">Update informasi kategori</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Berita, Kegiatan, Prestasi..."
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Otomatis dari nama jika kosong"
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Warna</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3b82f6"
                    className="font-mono"
                  />
                </div>
                {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order">Urutan</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                {errors.order && <p className="text-sm text-red-500">{errors.order}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi kategori..."
                rows={4}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Aktif
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t pt-4">
              <Button type="submit">Update</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/categories">Batal</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
