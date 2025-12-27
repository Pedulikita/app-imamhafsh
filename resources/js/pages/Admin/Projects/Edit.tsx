import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Project {
    id: number;
    title: string;
    subtitle: string | null;
    image: string | null;
    category: string | null;
    badge: string | null;
    order: number;
    is_active: boolean;
}

interface Props {
    project: Project;
}

export default function Edit({ project }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Projects', href: '/admin/projects' },
        { label: 'Edit Project', href: `/admin/projects/${project.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: project.title || '',
        subtitle: project.subtitle || '',
        image: null as File | null,
        category: project.category || '',
        badge: project.badge || 'PROJECT',
        order: project.order || 0,
        is_active: project.is_active ?? true,
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
        post(`/admin/projects/${project.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${project.title}`} />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/projects">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Project</h1>
                        <p className="text-sm text-muted-foreground">
                            Update project: {project.title}
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
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input
                                id="subtitle"
                                value={data.subtitle}
                                onChange={(e) =>
                                    setData('subtitle', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Input
                                    id="category"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="badge">Badge</Label>
                                <Input
                                    id="badge"
                                    value={data.badge}
                                    onChange={(e) =>
                                        setData('badge', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Gambar</h3>

                        {project.image && !imagePreview && (
                            <div className="mb-4">
                                <Label>Gambar Saat Ini</Label>
                                <img
                                    src={project.image}
                                    alt={project.title}
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
                            <Link href="/admin/projects">
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
