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
import { Edit2Icon, TrashIcon, PlusIcon, FileText } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface ProfilePage {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  pages: {
    data: ProfilePage[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Profile Pages',
  },
];

export default function ProfilePagesIndex() {
  const pageProps = usePage().props as any;
  const pages = pageProps.pages || { data: [], current_page: 1, last_page: 1, per_page: 15, total: 0 };
  const allPages = pageProps.allPages || [];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ProfilePage | null>(null);

  const openDeleteDialog = (page: ProfilePage) => {
    setSelectedPage(page);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedPage) return;

    router.delete(`/admin/profile-pages/${selectedPage.id}`, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedPage(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile Pages Management" />

      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Profile Pages</h1>
            <p className="text-sm text-muted-foreground">Kelola halaman profil sekolah</p>
          </div>
          <Button asChild>
            <Link href="/admin/profile-pages/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Tambah Halaman
            </Link>
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-sidebar-border/70 bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Gambar</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead className="w-[200px]">Slug</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead className="w-[150px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!pages.data || pages.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <p className="text-sm">Belum ada halaman profil</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pages.data.map((page: ProfilePage) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {page.image ? (
                          <img
                            src={page.image.startsWith('/storage/') || page.image.startsWith('http') ? page.image : `/${page.image}`}
                            alt={page.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant={page.is_active ? 'default' : 'secondary'}>
                        {page.is_active ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{page.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/profile-pages/${page.id}/edit`}>
                            <Edit2Icon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(page)}
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

          {/* Pagination */}
          {pages.last_page > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t">
              {Array.from({ length: pages.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={pages.current_page === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    router.get(`/admin/profile-pages?page=${page}`, {}, { preserveState: true })
                  }
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus halaman "{selectedPage?.title}"? Tindakan ini tidak
              dapat dibatalkan.
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
