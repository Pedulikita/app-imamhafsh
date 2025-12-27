import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
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
}

interface Props {
    donationEmbed: DonationEmbed;
}

export default function Edit({ donationEmbed }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Donation Embeds', href: '/admin/donation-embeds' },
        { label: 'Edit', href: `/admin/donation-embeds/${donationEmbed.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: donationEmbed.title,
        description: donationEmbed.description,
        embed_url: donationEmbed.embed_url,
        direct_url: donationEmbed.direct_url,
        target_amount: donationEmbed.target_amount.toString(),
        collected_amount: donationEmbed.collected_amount.toString(),
        donors_count: donationEmbed.donors_count.toString(),
        image: null as File | null,
        additional_info: donationEmbed.additional_info || '',
        is_active: donationEmbed.is_active,
        sort_order: donationEmbed.sort_order.toString(),
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/donation-embeds/${donationEmbed.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${donationEmbed.title}`} />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Edit Donation Embed</h1>
                        <p className="text-muted-foreground mt-2">
                            Update campaign donasi: {donationEmbed.title}
                        </p>
                    </div>
                    <Link href="/admin/donation-embeds">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Donation Embed Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input type="hidden" name="_method" value="PUT" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter donation title"
                                        required
                                    />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="target_amount">Target Amount *</Label>
                                    <Input
                                        id="target_amount"
                                        type="number"
                                        value={data.target_amount}
                                        onChange={(e) => setData('target_amount', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        step="1000"
                                        required
                                    />
                                    {errors.target_amount && <p className="text-sm text-destructive">{errors.target_amount}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter donation description"
                                    rows={4}
                                    required
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="embed_url">Embed URL *</Label>
                                    <Input
                                        id="embed_url"
                                        type="url"
                                        value={data.embed_url}
                                        onChange={(e) => setData('embed_url', e.target.value)}
                                        placeholder="https://temenbaik.com/campaign/embed/..."
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Hanya URL dari temenbaik.com yang diizinkan
                                    </p>
                                    {errors.embed_url && <p className="text-sm text-destructive">{errors.embed_url}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="direct_url">Direct URL *</Label>
                                    <Input
                                        id="direct_url"
                                        type="url"
                                        value={data.direct_url}
                                        onChange={(e) => setData('direct_url', e.target.value)}
                                        placeholder="https://temenbaik.com/campaign/..."
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Hanya URL dari temenbaik.com yang diizinkan
                                    </p>
                                    {errors.direct_url && <p className="text-sm text-destructive">{errors.direct_url}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="collected_amount">Collected Amount</Label>
                                    <Input
                                        id="collected_amount"
                                        type="number"
                                        value={data.collected_amount}
                                        onChange={(e) => setData('collected_amount', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        step="1000"
                                    />
                                    {errors.collected_amount && <p className="text-sm text-destructive">{errors.collected_amount}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="donors_count">Donors Count</Label>
                                    <Input
                                        id="donors_count"
                                        type="number"
                                        value={data.donors_count}
                                        onChange={(e) => setData('donors_count', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.donors_count && <p className="text-sm text-destructive">{errors.donors_count}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.sort_order && <p className="text-sm text-destructive">{errors.sort_order}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image</Label>
                                {donationEmbed.image_url && (
                                    <div className="mb-2">
                                        <p className="text-sm text-muted-foreground mb-2">Current image:</p>
                                        <img 
                                            src={donationEmbed.image_url} 
                                            alt="Current donation image" 
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('image', file);
                                    }}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload gambar baru untuk campaign donation (jpg, png, webp). Kosongkan jika tidak ingin mengubah.
                                </p>
                                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="additional_info">Additional Information</Label>
                                <Textarea
                                    id="additional_info"
                                    value={data.additional_info}
                                    onChange={(e) => setData('additional_info', e.target.value)}
                                    placeholder="Any additional information about this donation campaign"
                                    rows={3}
                                    maxLength={2000}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {data.additional_info.length}/2000 characters
                                </p>
                                {errors.additional_info && <p className="text-sm text-destructive">{errors.additional_info}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Updating...' : 'Update Donation Embed'}
                                </Button>
                                <Link href="/admin/donation-embeds">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}