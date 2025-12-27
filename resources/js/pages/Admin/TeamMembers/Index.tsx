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

interface TeamMember {
    id: number;
    name: string;
    role: string | null;
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
    teamMembers: PaginatedData<TeamMember>;
}

export default function Index({ teamMembers }: Props) {
    const memberList = teamMembers.data || [];
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Team Members', href: '/admin/team-members' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus team member ini?')) {
            router.delete(`/admin/team-members/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Members" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Team Members</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola struktur organisasi
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/team-members/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Team Member
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Foto</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Urutan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {memberList.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        Belum ada data team member
                                    </TableCell>
                                </TableRow>
                            ) : (
                                memberList.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            {member.image ? (
                                                <img
                                                    src={`/${member.image}`}
                                                    alt={member.name}
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded bg-muted" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {member.name}
                                        </TableCell>
                                        <TableCell>
                                            {member.role || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {member.category || '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{member.order}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    member.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {member.is_active
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
                                                        href={`/admin/team-members/${member.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(member.id)
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
