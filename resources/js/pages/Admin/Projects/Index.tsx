import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react';
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

interface Project {
    id: number;
    title: string;
    subtitle: string | null;
    image: string;
    category: string;
    badge: string;
    order: number;
    is_active: boolean;
}

interface Props {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ projects }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Projects', href: '/admin/projects' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus project ini?')) {
            router.delete(`/admin/projects/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects Management" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Projects</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola project siswa yang ditampilkan di halaman public
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/projects/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Project
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
                                <TableHead className="w-[100px]">Badge</TableHead>
                                <TableHead className="w-[80px] text-center">Order</TableHead>
                                <TableHead className="w-[100px] text-center">Status</TableHead>
                                <TableHead className="w-[150px] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <FolderKanban className="h-8 w-8" />
                                            <p className="text-sm">Belum ada project</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.data.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>
                                            {project.image ? (
                                                <img
                                                    src={`/${project.image}`}
                                                    alt={project.title}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                                    <FolderKanban className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{project.title}</div>
                                                {project.subtitle && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {project.subtitle}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{project.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{project.badge}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">{project.order}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={project.is_active ? 'default' : 'secondary'}>
                                                {project.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={`/admin/projects/${project.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(project.id)}
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
                {projects.total > 0 && (
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {projects.data.length} dari {projects.total} project
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
