import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

export default function Create() {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Home Sections', href: '/admin/home-sections' },
        { label: 'Tambah Section', href: '/admin/home-sections/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        section_key: '',
        title: '',
        subtitle: '',
        content: '',
        image: null as File | null,
        image_alt: '',
        badge_text: '',
        button_text: '',
        button_link: '',
        list_items: '',
        order: 0,
        is_active: true,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/home-sections');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Home Section" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/home-sections">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Tambah Home Section</h1>
                        <p className="text-sm text-muted-foreground">
                            Buat section baru untuk halaman beranda
                        </p>
                    </div>
                </div>

                <Alert>
                    <AlertDescription>
                        <strong>Section Keys:</strong> Gunakan key seperti 'about',
                        'alasan', 'pendidikan', 'galeri' untuk identifikasi section.
                        Key harus unik.
                    </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="section_key">Section Key *</Label>
                                <Input
                                    id="section_key"
                                    value={data.section_key}
                                    onChange={(e) =>
                                        setData('section_key', e.target.value)
                                    }
                                    placeholder="about"
                                    required
                                />
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
                                    placeholder="About Us"
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
                                placeholder="Judul section"
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
                                placeholder="Subtitle opsional"
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
                                placeholder="Konten teks section..."
                                rows={6}
                            />
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Gambar</h3>

                        <div className="space-y-2">
                            <Label htmlFor="image">Upload Gambar</Label>
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
                                placeholder="Deskripsi gambar"
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
                                    placeholder="Lihat Selengkapnya"
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
                                    placeholder="/about"
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
                            {processing ? 'Menyimpan...' : 'Simpan Section'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
