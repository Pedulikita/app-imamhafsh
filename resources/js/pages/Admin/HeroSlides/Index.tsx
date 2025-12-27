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
import { Edit2Icon, TrashIcon, PlusIcon, ImageIcon, Info } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  button_text: string | null;
  button_link: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  slides: HeroSlide[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Hero Slides',
  },
];

export default function HeroSlidesIndex() {
  const { slides } = usePage<PageProps>().props;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);

  const openDeleteDialog = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedSlide) return;

    router.delete(`/hero-slides/${selectedSlide.id}`, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedSlide(null);
      },
    });
  };

  const toggleActive = (slide: HeroSlide) => {
    router.put(`/hero-slides/${slide.id}`, {
      ...slide,
      is_active: !slide.is_active,
    }, {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hero Slides Management" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Hero Slides</h1>
            <p className="text-sm text-muted-foreground">Kelola slider hero di halaman home</p>
          </div>
          <Button asChild>
            <Link href="/hero-slides/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Tambah Slide
            </Link>
          </Button>
        </div>

        {/* Info Alert */}
        <div className="rounded-xl border border-sidebar-border/70 bg-muted/50 p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Tips Penggunaan:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Upload gambar dengan ukuran optimal 1920x1080px untuk hasil terbaik</li>
                <li>Atur urutan slide dengan mengubah nilai "Order" (angka kecil akan muncul lebih dulu)</li>
                <li>Klik status untuk mengaktifkan/menonaktifkan slide</li>
                <li>Hanya slide yang aktif yang akan tampil di halaman home</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-xl border border-sidebar-border/70 bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <p className="text-sm">Belum ada hero slide</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                slides.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      {slide.image ? (
                        <img
                          src={`/${slide.image}`}
                          alt={slide.title}
                          className="h-12 w-20 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-20 items-center justify-center rounded-md bg-muted">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{slide.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {slide.subtitle || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{slide.order}</Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleActive(slide)}
                        className="cursor-pointer"
                      >
                        <Badge 
                          variant={slide.is_active ? 'default' : 'secondary'}
                          className={slide.is_active ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {slide.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/hero-slides/${slide.id}/edit`}>
                            <Edit2Icon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(slide)}
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
              Apakah Anda yakin ingin menghapus slide "{selectedSlide?.title}"? Tindakan ini tidak dapat dibatalkan dan akan menghapus file gambar juga.
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
