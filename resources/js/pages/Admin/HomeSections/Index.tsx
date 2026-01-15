import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Image, LayoutGrid } from 'lucide-react';
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

interface HomeSection {
    id: number;
    section_key: string;
    title: string;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    image_url: string | null; // Add image_url accessor
    badge_text: string | null;
    button_text: string | null;
    button_link: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
}

interface Props {
    sections: {
        data: HomeSection[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ sections }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Home Sections', href: '/admin/home-sections' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus section ini?')) {
            router.delete(`/admin/home-sections/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home Sections Management" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Home Sections</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola konten section di halaman beranda
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/home-sections/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Section
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Gambar</TableHead>
                                <TableHead className="w-[150px]">Section Key</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead className="w-[120px]">Badge</TableHead>
                                <TableHead className="w-[80px] text-center">Order</TableHead>
                                <TableHead className="w-[100px] text-center">Status</TableHead>
                                <TableHead className="w-[150px] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sections.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                            <LayoutGrid className="h-8 w-8" />
                                            <p className="text-sm">Belum ada section</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sections.data.map((section) => (
                                    <TableRow key={section.id}>
                                        {/* Image */}
                                        <TableCell>
                                            <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                                {section.image ? (
                                                    <img
                                                        src={
                                                            section.image_url || 
                                                            (section.image.startsWith('/storage/') ? section.image : `/storage/${section.image}`)
                                                        }
                                                        alt={section.title}
                                                        className="h-full w-full object-cover"
                                                        onError={() => {}}
                                                    />
                                                ) : (
                                                    <Image className="h-6 w-6 text-muted-foreground" />
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Section Key */}
                                        <TableCell>
                                            <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                                                {section.section_key}
                                            </code>
                                        </TableCell>

                                        {/* Title */}
                                        <TableCell className="font-medium">
                                            {section.title}
                                        </TableCell>

                                        {/* Badge */}
                                        <TableCell>
                                            {section.badge_text && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {section.badge_text}
                                                </Badge>
                                            )}
                                        </TableCell>

                                        {/* Order */}
                                        <TableCell className="text-center">
                                            {section.order}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={section.is_active ? 'default' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {section.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/home-sections/${section.id}/edit`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(section.id)}
                                                    className="text-red-600 hover:text-red-700"
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
