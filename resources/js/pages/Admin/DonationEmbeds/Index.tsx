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
import { Edit, Plus, Trash2, ExternalLink, Heart } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface DonationEmbed {
    id: number;
    title: string;
    description: string;
    embed_url: string;
    direct_url: string;
    target_amount: number;
    collected_amount: number;
    donors_count: number;
    image_url?: string;
    additional_info?: string;
    is_active: boolean;
    sort_order: number;
    progress_percentage: number;
    formatted_target_amount: string;
    formatted_collected_amount: string;
}

interface Props {
    donationEmbeds: DonationEmbed[];
}

export default function Index({ donationEmbeds }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Donation Embeds', href: '/admin/donation-embeds' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus donation embed ini?')) {
            router.delete(`/admin/donation-embeds/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Donation Embeds" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Donation Embeds</h1>
                        <p className="text-muted-foreground mt-2">
                            Kelola campaign donasi yang ditampilkan di website
                        </p>
                    </div>
                    <Link href="/admin/donation-embeds/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Donation Embed
                        </Button>
                    </Link>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Target Amount</TableHead>
                                <TableHead>Collected</TableHead>
                                <TableHead>Donors</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donationEmbeds.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <Heart className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">Belum ada donation embed</p>
                                            <Link href="/admin/donation-embeds/create">
                                                <Button variant="outline">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Tambah Donation Embed Pertama
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                donationEmbeds.map((embed) => (
                                    <TableRow key={embed.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{embed.title}</div>
                                                <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                    {embed.description}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-muted rounded-full h-2">
                                                        <div 
                                                            className="bg-primary h-2 rounded-full transition-all"
                                                            style={{ width: `${Math.min(embed.progress_percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {embed.progress_percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {embed.formatted_target_amount}
                                        </TableCell>
                                        <TableCell className="text-green-600 font-medium">
                                            {embed.formatted_collected_amount}
                                        </TableCell>
                                        <TableCell>{embed.donors_count}</TableCell>
                                        <TableCell>
                                            <Badge variant={embed.is_active ? 'default' : 'secondary'}>
                                                {embed.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{embed.sort_order}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={embed.direct_url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/donation-embeds/${embed.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleDelete(embed.id)}
                                                    className="text-destructive hover:text-destructive"
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
