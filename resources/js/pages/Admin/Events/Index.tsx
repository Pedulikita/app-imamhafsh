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

interface Event {
    id: number;
    title: string;
    image: string | null;
    category: string | null;
    order: number;
    is_active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: any;
    meta: any;
}

interface Props {
    events: PaginatedData<Event>;
}

export default function Index({ events }: Props) {
    const eventList = events.data || [];
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Events', href: '/admin/events' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus event ini?')) {
            router.delete(`/admin/events/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Events</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola event dan poster
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/events/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Event
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Gambar</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Urutan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventList.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data event
                                    </TableCell>
                                </TableRow>
                            ) : (
                                eventList.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>
                                            {event.image ? (
                                                <img
                                                    src={`/${event.image}`}
                                                    alt={event.title}
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded bg-muted" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {event.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {event.category || 'Event'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{event.order}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    event.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {event.is_active
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
                                                        href={`/admin/events/${event.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(event.id)
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
