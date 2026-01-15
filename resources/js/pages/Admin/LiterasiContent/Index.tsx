import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Edit, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface LiterasiContent {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    contents: LiterasiContent[];
}

export default function Index({ contents }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this literasi content?')) {
            router.delete(`/admin/literasi-content/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Literasi Content Management" />

            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Literasi Content</h1>
                        <p className="text-muted-foreground">
                            Manage literasi sekolah page content
                        </p>
                    </div>
                    <Link href="/admin/literasi-content/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Content
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Literasi Content List</CardTitle>
                        <CardDescription>
                            All literasi content entries
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {contents.length === 0 ? (
                            <div className="text-center py-10">
                                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-semibold">No content</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Get started by creating a new literasi content.
                                </p>
                                <div className="mt-6">
                                    <Link href="/admin/literasi-content/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Content
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Subtitle</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contents.map((content) => (
                                        <TableRow key={content.id}>
                                            <TableCell className="font-medium">
                                                {content.title}
                                            </TableCell>
                                            <TableCell>
                                                {content.subtitle || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={content.is_active ? 'default' : 'secondary'}>
                                                    {content.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{content.sort_order}</TableCell>
                                            <TableCell>
                                                {new Date(content.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/literasi-content/${content.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(content.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}