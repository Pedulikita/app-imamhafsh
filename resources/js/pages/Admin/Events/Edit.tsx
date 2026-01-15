import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
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

interface Props {
    event: Event;
}

export default function Edit({ event }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Events', href: '/admin/events' },
        { label: 'Edit Event', href: `/admin/events/${event.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: event.title || '',
        image: null as File | null,
        category: event.category || 'Event',
        order: event.order || 0,
        is_active: event.is_active ?? true,
        _method: 'PUT',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/events/${event.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${event.title}`} />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/events">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Event</h1>
                        <p className="text-sm text-muted-foreground">
                            Update event: {event.title}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul *</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori *</Label>
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="Event">Event</option>
                                <option value="Poster">Poster</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Gambar</h3>

                        {event.image && !imagePreview && (
                            <div className="mb-4">
                                <Label>Gambar Saat Ini</Label>
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="mt-2 max-h-64 rounded-lg object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="image">Upload Gambar Baru</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {errors.image && (
                                <p className="text-sm text-red-500">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        {imagePreview && (
                            <div className="mt-4">
                                <Label>Preview Gambar Baru</Label>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 max-h-64 rounded-lg object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Settings Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Pengaturan</h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="order">Urutan Tampil</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) =>
                                        setData(
                                            'order',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="is_active">Status</Label>
                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData('is_active', e.target.checked)
                                        }
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="is_active" className="!mt-0">
                                        Aktif
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/events">
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update Event'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
