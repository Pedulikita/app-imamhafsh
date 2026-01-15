import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Facility {
    id: number;
    title: string;
    image: string;
    category: string;
    is_active: boolean;
    created_at: string;
}

interface Props {
    facilities: {
        data: Facility[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ facilities }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Facilities', href: '/admin/facilities' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus fasilitas ini?')) {
            router.delete(`/admin/facilities/${id}`);
        }
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/facilities/${id}/toggle-active`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Facilities Management" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Fasilitas</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola fasilitas sekolah yang ditampilkan di halaman publik
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/facilities/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Fasilitas
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Gambar</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead className="w-[150px]">Kategori</TableHead>
                                <TableHead className="w-[100px] text-center">Status</TableHead>
                                <TableHead className="w-[150px] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facilities.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <Building2 className="h-8 w-8" />
                                            <p className="text-sm">Belum ada fasilitas</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                facilities.data.map((facility) => (
                                    <TableRow key={facility.id}>
                                        <TableCell>
                                            {facility.image ? (
                                                <img
                                                    src={facility.image}
                                                    alt={facility.title}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{facility.title}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{facility.category}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleActive(facility.id)}
                                            >
                                                <Badge variant={facility.is_active ? 'default' : 'secondary'}>
                                                    {facility.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={`/admin/facilities/${facility.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(facility.id)}
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

                {/* Pagination info */}
                {facilities.total > 0 && (
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {facilities.data.length} dari {facilities.total} fasilitas
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
