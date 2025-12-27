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
import { Edit, Plus, Star, Trash2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Testimony {
    id: number;
    name: string;
    role: string | null;
    text: string;
    rating: number;
    avatar: string | null;
    is_featured: boolean;
    is_active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: any;
    meta: any;
}

interface Props {
    testimonies: PaginatedData<Testimony>;
}

export default function Index({ testimonies }: Props) {
    const testimonyList = testimonies.data || [];
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Testimonies', href: '/admin/testimonies' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus testimony ini?')) {
            router.delete(`/admin/testimonies/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonies" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Testimonies</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola testimoni dan ulasan
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/testimonies/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Testimony
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonyList.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data testimony
                                    </TableCell>
                                </TableRow>
                            ) : (
                                testimonyList.map((testimony) => (
                                    <TableRow key={testimony.id}>
                                        <TableCell>
                                            {testimony.avatar ? (
                                                <img
                                                    src={testimony.avatar}
                                                    alt={testimony.name}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                                    {testimony.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {testimony.name}
                                        </TableCell>
                                        <TableCell>
                                            {testimony.role || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                <span>{testimony.rating}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {testimony.is_featured ? (
                                                <Badge variant="default">Featured</Badge>
                                            ) : (
                                                <Badge variant="outline">No</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    testimony.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {testimony.is_active
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
                                                    <Link
                                                        href={`/admin/testimonies/${testimony.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(testimony.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
        </AppLayout>
    );
}
