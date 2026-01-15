import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Edit2Icon, TrashIcon, PlusIcon, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface User {
  id: number;
  name: string;
}

interface Page {
  id: number;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  order: number;
  is_homepage: boolean;
  created_by: number;
  updated_by: number;
  creator?: User;
  updater?: User;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  pages: {
    data: Page[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    status?: string;
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Pages',
  },
];

export default function PagesIndex() {
  const { pages, filters } = usePage<PageProps>().props;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  const openDeleteDialog = (page: Page) => {
    setSelectedPage(page);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedPage) return;

    router.delete(`/pages/${selectedPage.id}`, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedPage(null);
      },
    });
  };

  const handleSearch = () => {
    router.get('/pages', { search: searchQuery, status: statusFilter }, { preserveState: true });
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pages Management" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pages</h1>
            <p className="text-sm text-muted-foreground">Manage website pages (Home, About, dll)</p>
          </div>
          <Button asChild>
            <Link href="/pages/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Buat Page
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="Cari pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                router.get('/pages', { search: searchQuery, status: e.target.value }, { preserveState: true });
              }}
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <Button onClick={handleSearch}>Cari</Button>
          </div>
        </div>

        {/* Pages Table */}
        <div className="rounded-xl border border-sidebar-border/70 bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead className="w-[140px]">Published</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <p className="text-sm">Belum ada pages</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pages.data.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{page.title}</div>
                        {page.is_homepage && (
                          <Badge variant="outline" className="mt-1 text-xs">Homepage</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      /{page.slug}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(page.status)}
                        className={page.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{page.order}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {page.published_at ? format(new Date(page.published_at), 'PP') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {page.status === 'published' && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/pages/${page.id}/edit`}>
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
                    onClick={() => router.get(`/pages?page=${page}`)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            )}
          </div>

        {/* Delete Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus page "{selectedPage?.title}"? Tindakan ini tidak dapat dibatalkan.
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
      </div>
    </AppLayout>
  );
}
