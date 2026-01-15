import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Edit, Plus, Trash2, Eye } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface KebijakanContent {
    id: number;
    hero_badge: string;
    hero_title: string;
    hero_subtitle: string | null;
    hero_image: string | null;
    is_active: boolean;
    order: number;
}

interface Props {
    contents: KebijakanContent[];
}

export default function Index({ contents }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Kebijakan & Norma', href: '/admin/kebijakan-content' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus konten kebijakan ini?')) {
            router.delete(`/admin/kebijakan-content/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kebijakan & Norma Content" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Kebijakan & Norma</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola konten halaman Kebijakan dan Norma
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/kebijakan-content/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Konten
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Hero Image</TableHead>
                                <TableHead>Badge</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Subtitle</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contents.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data konten kebijakan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contents.map((content) => (
                                    <TableRow key={content.id}>
                                        <TableCell className="font-medium">
                                            {content.order}
                                        </TableCell>
                                        <TableCell>
                                            {content.hero_image ? (
                                                <img
                                                    src={content.hero_image.startsWith('http') ? content.hero_image : `/storage/${content.hero_image}`}
                                                    alt={content.hero_title}
                                                    className="h-16 w-24 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="h-16 w-24 rounded bg-muted flex items-center justify-center text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {content.hero_badge}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium max-w-xs truncate">
                                            {content.hero_title}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-muted-foreground">
                                            {content.hero_subtitle || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    content.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {content.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={`/admin/kebijakan-content/${content.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDelete(content.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Preview Button */}
                <div className="flex justify-end">
                    <Button variant="outline" asChild>
                        <a href="/kebijakan" target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            Preview Halaman
                        </a>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
