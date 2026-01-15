import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Facility {
    id: number;
    title: string;
    image: string;
    category: string;
    is_active: boolean;
}

interface Props {
    facility: Facility;
    categories: string[];
}

export default function Edit({ facility, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Facilities', href: '/admin/facilities' },
        { label: facility.title, href: `/admin/facilities/${facility.id}/edit` },
    ];

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        title: facility.title,
        category: facility.category,
        is_active: facility.is_active,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(facility.image);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleImageChange = (file: File) => {
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const submitFormData = new FormData();
        submitFormData.append('_method', 'PUT');
        submitFormData.append('title', formData.title);
        submitFormData.append('category', formData.category);
        submitFormData.append('is_active', formData.is_active ? '1' : '0');
        if (imageFile) {
            submitFormData.append('image', imageFile);
        }

        router.post(`/admin/facilities/${facility.id}`, submitFormData, {
            onError: (errors) => {
                console.error('Form errors:', errors);
                setErrors(errors as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                console.log('Success! Redirecting...');
                router.visit('/admin/facilities');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${facility.title}`} />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/facilities">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Fasilitas</h1>
                        <p className="text-sm text-muted-foreground">
                            Ubah informasi fasilitas
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
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="Nama fasilitas"
                                className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori *</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger id="category" className={errors.category ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category}</p>
                            )}
                        </div>
                    </div>

                    {/* Image */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Gambar</h3>

                        <div className="space-y-2">
                            <Label htmlFor="image">Upload Gambar</Label>
                            <input
                                ref={fileInputRef}
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.currentTarget.files?.[0];
                                    if (file) {
                                        handleImageChange(file);
                                    }
                                }}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Ubah Gambar
                            </Button>
                            {imageFile && (
                                <p className="text-sm text-muted-foreground">
                                    File: {imageFile.name}
                                </p>
                            )}
                            {errors.image && (
                                <p className="text-sm text-red-500">{errors.image}</p>
                            )}
                        </div>

                        {imagePreview && (
                            <div className="space-y-2">
                                <Label>Preview</Label>
                                <div className="h-48 w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Status</h3>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) =>
                                    setFormData({ ...formData, is_active: e.target.checked })
                                }
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="is_active">Fasilitas Aktif</Label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button disabled={processing} type="submit">
                            Update Fasilitas
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/facilities">Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
