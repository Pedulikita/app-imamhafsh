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

interface Achievement {
    id: number;
    title: string;
    image: string | null;
    order: number;
    is_active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: any;
    meta: any;
}

interface Props {
    achievements: PaginatedData<Achievement>;
}

export default function Index({ achievements }: Props) {
    const achievementList = achievements.data || [];
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Achievements', href: '/admin/achievements' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus achievement ini?')) {
            router.delete(`/admin/achievements/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Achievements" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Achievements</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola galeri prestasi
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/achievements/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Achievement
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
                                <TableHead>Urutan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {achievementList.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data achievement
                                    </TableCell>
                                </TableRow>
                            ) : (
                                achievementList.map((achievement) => (
                                    <TableRow key={achievement.id}>
                                        <TableCell>
                                            {achievement.image ? (
                                                <img
                                                    src={`/${achievement.image}`}
                                                    alt={achievement.title}
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded bg-muted" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {achievement.title}
                                        </TableCell>
                                        <TableCell>{achievement.order}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    achievement.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {achievement.is_active
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
                                                        href={`/admin/achievements/${achievement.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(achievement.id)
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
