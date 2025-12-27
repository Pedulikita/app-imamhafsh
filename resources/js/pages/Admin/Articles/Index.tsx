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
import { Edit2Icon, TrashIcon, PlusIcon, Eye, Newspaper } from 'lucide-react';
import { format } from 'date-fns';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

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
  featured_image: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  views: number;
  author: User;
  category: Category | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  articles: {
    data: Article[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  categories: Category[];
  filters: {
    status?: string;
    category_id?: string;
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Articles',
  },
];

export default function ArticlesIndex() {
  const { articles, categories, filters } = usePage<PageProps>().props;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [categoryFilter, setCategoryFilter] = useState(filters.category_id || '');

  const openDeleteDialog = (article: Article) => {
    setSelectedArticle(article);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedArticle) return;

    router.delete(`/admin/articles/${selectedArticle.id}`, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedArticle(null);
      },
    });
  };

  const handleSearch = () => {
    router.get(
      '/admin/articles',
      { search: searchQuery, status: statusFilter, category_id: categoryFilter },
      { preserveState: true }
    );
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
      case 'published':
        return 'default';
      case 'review':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'review':
        return 'Review';
      case 'draft':
        return 'Draft';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Articles Management" />

      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Articles</h1>
            <p className="text-sm text-muted-foreground">Kelola artikel dan konten website</p>
          </div>
          <Button asChild>
            <Link href="/admin/articles/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Tulis Artikel
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                router.get(
                  '/admin/articles',
                  { search: searchQuery, status: e.target.value, category_id: categoryFilter },
                  { preserveState: true }
                );
              }}
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                router.get(
                  '/admin/articles',
                  { search: searchQuery, status: statusFilter, category_id: e.target.value },
                  { preserveState: true }
                );
              }}
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button onClick={handleSearch}>Cari</Button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="rounded-xl border border-sidebar-border/70 bg-background overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Gambar</TableHead>
                <TableHead>Judul & Kategori</TableHead>
                <TableHead className="w-[150px]">Penulis</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="w-[80px] text-center">Views</TableHead>
                <TableHead className="w-[150px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Newspaper className="h-8 w-8" />
                      <p className="text-sm">Belum ada artikel</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                articles.data.map((article) => (
                  <TableRow key={article.id}>
                    {/* Featured Image */}
                    <TableCell>
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {article.featured_image ? (
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Newspaper className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Title & Category */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium" title={article.title}>
                          {article.title.length > 60 ? article.title.substring(0, 60) + '...' : article.title}
                        </div>
                        <div className="flex items-center gap-2">
                          {article.category ? (
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{
                                borderColor: article.category.color,
                                color: article.category.color,
                              }}
                            >
                              {article.category.name}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Tanpa kategori</span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {article.published_at
                              ? format(new Date(article.published_at), 'dd MMM yyyy')
                              : format(new Date(article.created_at), 'dd MMM yyyy')}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Author */}
                    <TableCell className="text-sm">{article.author.name}</TableCell>
                    
                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(article.status)}
                        className={article.status === 'published' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {getStatusLabel(article.status)}
                      </Badge>
                    </TableCell>
                    
                    {/* Views */}
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {article.views}
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {article.status === 'published' && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/article/${article.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/articles/${article.id}/edit`}>
                            <Edit2Icon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(article)}
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
          {articles.last_page > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t">
              {Array.from({ length: articles.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={articles.current_page === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    router.get(
                      `/admin/articles?page=${page}`,
                      { search: searchQuery, status: statusFilter, category_id: categoryFilter },
                      { preserveState: true }
                    )
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
              Apakah Anda yakin ingin menghapus artikel "{selectedArticle?.title}"? Tindakan ini tidak
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
