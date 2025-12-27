import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit2Icon, TrashIcon, PlusIcon, Tag } from 'lucide-react';
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
  articles_count: number;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Categories',
  },
];

export default function CategoriesIndex() {
  const { categories } = usePage<PageProps>().props;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedCategory) return;

    router.delete(`/categories/${selectedCategory.id}`, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedCategory(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories Management" />

      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Categories</h1>
            <p className="text-sm text-muted-foreground">Kelola kategori artikel</p>
          </div>
          <Button asChild>
            <Link href="/categories/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Link>
          </Button>
        </div>

        {/* Categories Table */}
        <div className="rounded-xl border border-sidebar-border/70 bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="w-[100px]">Warna</TableHead>
                <TableHead className="w-[80px]">Urutan</TableHead>
                <TableHead className="w-[100px]">Artikel</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Tag className="h-8 w-8" />
                      <p className="text-sm">Belum ada kategori</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded border"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs font-mono">{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{category.order}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{category.articles_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.is_active ? 'default' : 'secondary'}>
                        {category.is_active ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/categories/${category.id}/edit`}>
                            <Edit2Icon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(category)}
                          disabled={category.articles_count > 0}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kategori "{selectedCategory?.name}"? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
