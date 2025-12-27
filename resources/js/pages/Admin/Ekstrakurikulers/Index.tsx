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
import { Edit, Plus, Trash2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Ekstrakurikuler {
    id: number;
    name: string;
    order: number;
    is_active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: any;
    meta: any;
}

interface Props {
    ekstrakurikulers: PaginatedData<Ekstrakurikuler>;
}

export default function Index({ ekstrakurikulers }: Props) {
    const itemList = ekstrakurikulers.data || [];
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Ekstrakurikuler', href: '/admin/ekstrakurikuler' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus ekstrakurikuler ini?')) {
            router.delete(`/admin/ekstrakurikuler/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ekstrakurikuler" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Ekstrakurikuler</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola daftar ekstrakurikuler
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/ekstrakurikuler/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Ekstrakurikuler
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Urutan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {itemList.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data ekstrakurikuler
                                    </TableCell>
                                </TableRow>
                            ) : (
                                itemList.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.name}
                                        </TableCell>
                                        <TableCell>{item.order}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    item.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {item.is_active
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
                                                        href={`/admin/ekstrakurikuler/${item.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(item.id)
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
