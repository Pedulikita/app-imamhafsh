import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Testimony {
    id: number;
    name: string;
    role: string | null;
    text: string;
    rating: number;
    avatar: string | null;
    is_featured: boolean;
    platform: string | null;
    order: number;
    is_active: boolean;
}

interface Props {
    testimony: Testimony;
}

export default function Edit({ testimony }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Testimonies', href: '/admin/testimonies' },
        { label: 'Edit Testimony', href: `/admin/testimonies/${testimony.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: testimony.name || '',
        role: testimony.role || '',
        text: testimony.text || '',
        rating: testimony.rating || 5,
        avatar: null as File | null,
        is_featured: testimony.is_featured ?? false,
        platform: testimony.platform || '',
        order: testimony.order || 0,
        is_active: testimony.is_active ?? true,
        _method: 'PUT',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/testimonies/${testimony.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${testimony.name}`} />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/testimonies">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Testimony</h1>
                        <p className="text-sm text-muted-foreground">
                            Update testimony: {testimony.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="text">Teks Testimoni *</Label>
                            <Textarea
                                id="text"
                                value={data.text}
                                onChange={(e) =>
                                    setData('text', e.target.value)
                                }
                                rows={6}
                                required
                            />
                            {errors.text && (
                                <p className="text-sm text-red-500">
                                    {errors.text}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating (1-5) *</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={data.rating}
                                    onChange={(e) =>
                                        setData(
                                            'rating',
                                            parseInt(e.target.value) || 5,
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="platform">Platform</Label>
                                <Input
                                    id="platform"
                                    value={data.platform}
                                    onChange={(e) =>
                                        setData('platform', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Avatar Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Avatar</h3>

                        {testimony.avatar && !imagePreview && (
                            <div className="mb-4">
                                <Label>Avatar Saat Ini</Label>
                                <img
                                    src={testimony.avatar}
                                    alt={testimony.name}
                                    className="mt-2 h-32 w-32 rounded-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="avatar">Upload Avatar Baru</Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {errors.avatar && (
                                <p className="text-sm text-red-500">
                                    {errors.avatar}
                                </p>
                            )}
                        </div>

                        {imagePreview && (
                            <div className="mt-4">
                                <Label>Preview Avatar Baru</Label>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 h-32 w-32 rounded-full object-cover"
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
                                <Label>Opsi</Label>
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="is_featured"
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) =>
                                                setData('is_featured', e.target.checked)
                                            }
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="is_featured" className="!mt-0">
                                            Featured
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
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
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/testimonies">
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update Testimony'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
