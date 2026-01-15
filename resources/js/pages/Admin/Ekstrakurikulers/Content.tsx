import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/rich-text-editor';
import { ArrowLeft, CheckCircle, XCircle, Upload } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { update as updateRoute } from '@/routes/admin/ekstrakurikuler-content';
import axios from 'axios';

interface Props {
    content: {
        hero_title?: string;
        hero_subtitle?: string;
        content_description?: string;
        gallery_title?: string;
        gallery_subtitle?: string;
        collage_image_1?: string;
        collage_image_2?: string;
        collage_image_3?: string;
        collage_image_4?: string;
    };
}

export default function Content({ content }: Props) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploadingImage, setUploadingImage] = useState<number | null>(null);
    
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        hero_title: content.hero_title || '',
        hero_subtitle: content.hero_subtitle || '',
        content_description: content.content_description || '',
        gallery_title: content.gallery_title || '',
        gallery_subtitle: content.gallery_subtitle || '',
        collage_image_1: content.collage_image_1 || '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor21-300x200.jpg',
        collage_image_2: content.collage_image_2 || '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor24-300x200.jpg',
        collage_image_3: content.collage_image_3 || '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor2-300x200.jpg',
        collage_image_4: content.collage_image_4 || '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor3-300x200.jpg',
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageNumber: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(imageNumber);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post('/admin/ekstrakurikuler-content/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success && response.data.path) {
                setData(`collage_image_${imageNumber}` as any, response.data.path);
            } else {
                alert('Upload gagal: ' + (response.data.message || 'Silakan coba lagi.'));
            }
        } catch (error: any) {
            console.error('Upload failed:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Terjadi kesalahan';
            alert('Upload gagal. ' + errorMsg);
        } finally {
            setUploadingImage(null);
        }
    };

    useEffect(() => {
        if (recentlySuccessful || flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful, flash]);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Ekstrakurikuler', href: '/admin/ekstrakurikuler' },
        { label: 'Edit Content', href: '/admin/ekstrakurikuler-content' },
    ];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(updateRoute().url, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Content Ekstrakurikuler" />

            <div className="flex flex-col gap-4 p-4">
                {/* Success Alert */}
                {showSuccess && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                            <p className="font-semibold text-green-900">Berhasil!</p>
                            <p className="text-sm text-green-700">Content ekstrakurikuler berhasil diperbarui.</p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Error Alert */}
                {Object.keys(errors).length > 0 && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-semibold text-red-900">Terjadi Kesalahan</p>
                            <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Header with Back Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit Content Ekstrakurikuler</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola konten yang ditampilkan di halaman ekstrakurikuler publik
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/ekstrakurikuler">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Hero Section */}
                        <div className="border-b pb-6">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">Hero Section</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="hero_title" className="block text-sm font-medium text-slate-700">
                                        Judul Hero
                                    </label>
                                    <input
                                        id="hero_title"
                                        type="text"
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.hero_title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.hero_title}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="hero_subtitle" className="block text-sm font-medium text-slate-700">
                                        Subtitle Hero
                                    </label>
                                    <input
                                        id="hero_subtitle"
                                        type="text"
                                        value={data.hero_subtitle}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.hero_subtitle && (
                                        <p className="mt-1 text-sm text-red-600">{errors.hero_subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Description */}
                        <div className="border-b pb-6">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">Konten Deskripsi</h2>
                            <p className="mb-4 text-sm text-slate-600">
                                Gunakan editor untuk membuat paragraf, heading, list, dan format lainnya sesuai kebutuhan.
                            </p>
                            
                            <div>
                                <RichTextEditor
                                    content={data.content_description}
                                    onChange={(content) => setData('content_description', content)}
                                    placeholder="Masukkan deskripsi lengkap tentang ekstrakurikuler..."
                                />
                                {errors.content_description && (
                                    <p className="mt-2 text-sm text-red-600">{errors.content_description}</p>
                                )}
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="pb-6">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">Gallery Section</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="gallery_title" className="block text-sm font-medium text-slate-700">
                                        Judul Gallery
                                    </label>
                                    <input
                                        id="gallery_title"
                                        type="text"
                                        value={data.gallery_title}
                                        onChange={(e) => setData('gallery_title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.gallery_title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.gallery_title}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="gallery_subtitle" className="block text-sm font-medium text-slate-700">
                                        Subtitle Gallery
                                    </label>
                                    <input
                                        id="gallery_subtitle"
                                        type="text"
                                        value={data.gallery_subtitle}
                                        onChange={(e) => setData('gallery_subtitle', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.gallery_subtitle && (
                                        <p className="mt-1 text-sm text-red-600">{errors.gallery_subtitle}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Collage Images Section */}
                        <div className="border-t pt-6 pb-6">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900">Gambar Collage</h2>
                            <p className="mb-4 text-sm text-slate-600">
                                Upload gambar atau masukkan path gambar. File maksimal 2MB (jpeg, png, jpg, gif, webp).
                            </p>
                            
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Image 1 */}
                                <div>
                                    <label htmlFor="collage_image_1" className="block text-sm font-medium text-slate-700 mb-2">
                                        Gambar 1 (Kiri Atas)
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 1)}
                                            className="hidden"
                                            id="upload_image_1"
                                            disabled={uploadingImage === 1}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('upload_image_1')?.click()}
                                            disabled={uploadingImage === 1}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {uploadingImage === 1 ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </div>
                                    <input
                                        id="collage_image_1"
                                        type="text"
                                        value={data.collage_image_1}
                                        onChange={(e) => setData('collage_image_1', e.target.value)}
                                        placeholder="/images/gambar1.jpg atau /storage/ekstrakurikuler/..."
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {data.collage_image_1 && (
                                        <img 
                                            src={data.collage_image_1} 
                                            alt="Preview 1" 
                                            className="mt-2 h-32 w-auto rounded-md border object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    )}
                                    {errors.collage_image_1 && (
                                        <p className="mt-1 text-sm text-red-600">{errors.collage_image_1}</p>
                                    )}
                                </div>

                                {/* Image 2 */}
                                <div>
                                    <label htmlFor="collage_image_2" className="block text-sm font-medium text-slate-700 mb-2">
                                        Gambar 2 (Kanan Atas)
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 2)}
                                            className="hidden"
                                            id="upload_image_2"
                                            disabled={uploadingImage === 2}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('upload_image_2')?.click()}
                                            disabled={uploadingImage === 2}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {uploadingImage === 2 ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </div>
                                    <input
                                        id="collage_image_2"
                                        type="text"
                                        value={data.collage_image_2}
                                        onChange={(e) => setData('collage_image_2', e.target.value)}
                                        placeholder="/images/gambar2.jpg atau /storage/ekstrakurikuler/..."
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {data.collage_image_2 && (
                                        <img 
                                            src={data.collage_image_2} 
                                            alt="Preview 2" 
                                            className="mt-2 h-32 w-auto rounded-md border object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    )}
                                    {errors.collage_image_2 && (
                                        <p className="mt-1 text-sm text-red-600">{errors.collage_image_2}</p>
                                    )}
                                </div>

                                {/* Image 3 */}
                                <div>
                                    <label htmlFor="collage_image_3" className="block text-sm font-medium text-slate-700 mb-2">
                                        Gambar 3 (Kiri Bawah)
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 3)}
                                            className="hidden"
                                            id="upload_image_3"
                                            disabled={uploadingImage === 3}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('upload_image_3')?.click()}
                                            disabled={uploadingImage === 3}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {uploadingImage === 3 ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </div>
                                    <input
                                        id="collage_image_3"
                                        type="text"
                                        value={data.collage_image_3}
                                        onChange={(e) => setData('collage_image_3', e.target.value)}
                                        placeholder="/images/gambar3.jpg atau /storage/ekstrakurikuler/..."
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {data.collage_image_3 && (
                                        <img 
                                            src={data.collage_image_3} 
                                            alt="Preview 3" 
                                            className="mt-2 h-32 w-auto rounded-md border object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    )}
                                    {errors.collage_image_3 && (
                                        <p className="mt-1 text-sm text-red-600">{errors.collage_image_3}</p>
                                    )}
                                </div>

                                {/* Image 4 */}
                                <div>
                                    <label htmlFor="collage_image_4" className="block text-sm font-medium text-slate-700 mb-2">
                                        Gambar 4 (Kanan Bawah)
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 4)}
                                            className="hidden"
                                            id="upload_image_4"
                                            disabled={uploadingImage === 4}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('upload_image_4')?.click()}
                                            disabled={uploadingImage === 4}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {uploadingImage === 4 ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </div>
                                    <input
                                        id="collage_image_4"
                                        type="text"
                                        value={data.collage_image_4}
                                        onChange={(e) => setData('collage_image_4', e.target.value)}
                                        placeholder="/images/gambar4.jpg atau /storage/ekstrakurikuler/..."
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {data.collage_image_4 && (
                                        <img 
                                            src={data.collage_image_4} 
                                            alt="Preview 4" 
                                            className="mt-2 h-32 w-auto rounded-md border object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    )}
                                    {errors.collage_image_4 && (
                                        <p className="mt-1 text-sm text-red-600">{errors.collage_image_4}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4 border-t pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                            >
                                <Link href="/admin/ekstrakurikuler">
                                    Batal
                                </Link>
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
