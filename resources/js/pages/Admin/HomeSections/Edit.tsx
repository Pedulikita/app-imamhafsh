import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Predefined section keys that are used in home page
const SECTION_KEYS = [
    { value: 'about', label: 'About - Tentang Sekolah' },
    { value: 'alasan', label: 'Alasan - Mengapa Memilih Kami' },
    { value: 'pendidikan', label: 'Pendidikan - Kebijakan & Norma' },
    { value: 'galeri', label: 'Galeri - Project Siswa' },
    { value: 'artikel', label: 'Artikel - Artikel Terbaru' },
];

interface HomeSection {
    id: number;
    section_key: string;
    title: string;
    subtitle: string | null;
    content: string | null;
    image: string | null;
    image_url: string | null; // Add image_url accessor
    image_alt: string | null;
    badge_text: string | null;
    button_text: string | null;
    button_link: string | null;
    order: number;
    is_active: boolean;
    meta?: {
        list_items?: string[];
    };
}

interface Props {
    section: HomeSection;
}

export default function Edit({ section }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Home Sections', href: '/admin/home-sections' },
        { label: 'Edit Section', href: `/admin/home-sections/${section.id}/edit` },
    ];

    const listItemsArray = section.meta?.list_items || [];
    const listItemsText = Array.isArray(listItemsArray) ? listItemsArray.join('\n') : '';

    const { data, setData, post, processing, errors } = useForm({
        section_key: section.section_key || '',
        title: section.title || '',
        subtitle: section.subtitle || '',
        content: section.content || '',
        image: null as File | null,
        image_alt: section.image_alt || '',
        badge_text: section.badge_text || '',
        button_text: section.button_text || '',
        button_link: section.button_link || '',
        list_items: listItemsText,
        order: section.order || 0,
        is_active: section.is_active ?? true,
        _method: 'PUT',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/admin/home-sections/${section.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${section.title}`} />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/home-sections">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Home Section</h1>
                        <p className="text-sm text-muted-foreground">
                            Update section: {section.title}
                        </p>
                    </div>
                </div>

                <Alert>
                    <AlertDescription>
                        <strong>Section Keys:</strong> Pilih section key yang sesuai dengan area pada halaman home yang ingin Anda atur.
                        Setiap section key hanya bisa digunakan sekali dan akan menggantikan konten default di halaman home.
                    </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="section_key">Section Key *</Label>
                                <Select
                                    value={data.section_key}
                                    onValueChange={(value) => setData('section_key', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih section untuk halaman home" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SECTION_KEYS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.section_key && (
                                    <p className="text-sm text-red-500">
                                        {errors.section_key}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="badge_text">Teks Badge</Label>
                                <Input
                                    id="badge_text"
                                    value={data.badge_text}
                                    onChange={(e) =>
                                        setData('badge_text', e.target.value)
                                    }
                                />
                            </div>
                        </div>

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

                        <div className="space-y-2">
                            <Label htmlFor="content">Konten</Label>
                            <Textarea
                                id="content"
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                rows={6}
                            />
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Gambar</h3>

                        {section.image && (
                            <div className="space-y-2">
                                <Label>Gambar Saat Ini</Label>
                                <div className="w-48 h-48 rounded-md overflow-hidden border">
                                    <img
                                        src={
                                            section.image_url || 
                                            (section.image.startsWith('/storage/') ? section.image : `/storage/${section.image}`)
                                        }
                                        alt={section.title}
                                        className="h-full w-full object-cover"
                                        onError={() => {}}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="image">
                                {section.image ? 'Ganti Gambar' : 'Upload Gambar'}
                            </Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                            {errors.image && (
                                <p className="text-sm text-red-500">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_alt">Alt Text Gambar</Label>
                            <Input
                                id="image_alt"
                                value={data.image_alt}
                                onChange={(e) =>
                                    setData('image_alt', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Button Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Tombol (Opsional)</h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="button_text">Teks Tombol</Label>
                                <Input
                                    id="button_text"
                                    value={data.button_text}
                                    onChange={(e) =>
                                        setData('button_text', e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="button_link">Link Tombol</Label>
                                <Input
                                    id="button_link"
                                    value={data.button_link}
                                    onChange={(e) =>
                                        setData('button_link', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* List Items Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">List Items (Opsional)</h3>
                        <p className="text-sm text-muted-foreground">
                            Masukkan satu item per baris. Akan ditampilkan sebagai list dengan icon centang hijau.
                        </p>

                        <div className="space-y-2">
                            <Label htmlFor="list_items">Items</Label>
                            <Textarea
                                id="list_items"
                                value={data.list_items}
                                onChange={(e) =>
                                    setData('list_items', e.target.value)
                                }
                                rows={10}
                                placeholder="Terakreditasi A&#10;Jago Ngaji, Jago Coding&#10;Program Unggulan Quality&#10;dll..."
                            />
                        </div>
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
                            <Link href="/admin/home-sections">
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Update Section'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
