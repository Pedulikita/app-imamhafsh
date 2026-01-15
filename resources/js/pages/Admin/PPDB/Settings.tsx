import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Upload } from 'lucide-react';
import axios from 'axios';

interface PPDBSetting {
    id: number;
    section_key: string;
    content: any;
    is_active: boolean;
    order: number;
}

interface Props {
    settings: Record<string, PPDBSetting>;
}

export default function PPDBSettings({ settings }: Props) {
    const [activeTab, setActiveTab] = useState('hero');
    const [showSuccess, setShowSuccess] = useState(false);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    const heroForm = useForm({
        content: settings.hero?.content || {
            title: 'Penerimaan Peserta Didik Baru',
            description: 'Bergabung bersama IMAM HAFSH Islamic Boarding School. Proses pendaftaran dibantu admin PPDB untuk memastikan data dan jadwal seleksi rapi.',
            registration_url: 'https://kolaborasitemanbaik.com/ppdb/imam-hafsh-p6swYI',
            banner_image: '/images/Banner-Page.png',
        },
        is_active: settings.hero?.is_active ?? true,
        order: settings.hero?.order ?? 0,
    });

    const programsForm = useForm({
        content: settings.programs?.content || {
            items: [
                { title: 'Tahfidz Bersanad', subtitle: 'Irama & langgam', icon: 'GraduationCap' },
                { title: 'Program Leadership & Character Building', subtitle: 'Knowing • Being • Doing', icon: 'ShieldCheck' },
                { title: 'Arabic & English', subtitle: 'Native speaker', icon: 'BookOpen' },
                { title: 'IT & Sains', subtitle: 'Project-based learning', icon: 'Building2' },
            ],
        },
        is_active: settings.programs?.is_active ?? true,
        order: settings.programs?.order ?? 1,
    });

    const flowStepsForm = useForm({
        content: settings.flow_steps?.content || {
            items: [
                { title: 'Konsultasi & Info', description: 'Tanyakan kuota, program, dan persyaratan melalui admin PPDB.', icon: 'ClipboardList' },
                { title: 'Pengisian Data', description: 'Kirim data calon siswa sesuai format yang diberikan admin.', icon: 'Users' },
                { title: 'Seleksi & Observasi', description: 'Jadwal seleksi/observasi diinformasikan setelah data diverifikasi.', icon: 'CalendarDays' },
                { title: 'Pengumuman', description: 'Hasil seleksi disampaikan melalui WhatsApp atau email resmi.', icon: 'BadgeCheck' },
            ],
        },
        is_active: settings.flow_steps?.is_active ?? true,
        order: settings.flow_steps?.order ?? 2,
    });

    const feesForm = useForm({
        content: settings.fees?.content || {
            items: [
                { title: 'Biaya Pendaftaran', price: 'Hubungi admin', note: 'Termasuk proses administrasi & berkas.', icon: 'CreditCard' },
                { title: 'SPP Bulanan', price: 'Hubungi admin', note: 'Menyesuaikan program & fasilitas.', icon: 'CheckCircle2' },
                { title: 'Uang Pangkal', price: 'Hubungi admin', note: 'Pembayaran sesuai ketentuan PPDB.', icon: 'Building2' },
            ],
        },
        is_active: settings.fees?.is_active ?? true,
        order: settings.fees?.order ?? 3,
    });

    const faqsForm = useForm({
        content: settings.faqs?.content || {
            items: [
                { question: 'Apakah pendaftaran bisa dilakukan online?', answer: 'Bisa. Proses awal dapat dilakukan melalui admin PPDB untuk konsultasi dan pengisian data.' },
                { question: 'Dokumen apa saja yang diperlukan?', answer: 'Umumnya Kartu Keluarga, Akta Kelahiran, dan rapor/surat keterangan sekolah. Detail akan diinformasikan admin PPDB.' },
                { question: 'Apakah ada tes seleksi?', answer: 'Ada tahapan seleksi/observasi sesuai program. Jadwal dan ketentuan diinformasikan setelah data diverifikasi.' },
                { question: 'Bagaimana sistem pembayaran?', answer: 'Admin PPDB akan memberikan rincian biaya dan metode pembayaran resmi setelah proses pendaftaran berjalan.' },
            ],
        },
        is_active: settings.faqs?.is_active ?? true,
        order: settings.faqs?.order ?? 4,
    });

    const galleryForm = useForm({
        content: settings.gallery?.content || {
            images: [
                '/images/PRESTAS.png',
                '/images/Banner-Page.png',
                '/images/Program-Unggulan.png',
                '/images/Program-Unggulan-2.png',
            ],
        },
        is_active: settings.gallery?.is_active ?? true,
        order: settings.gallery?.order ?? 5,
    });

    const [uploadingGallery, setUploadingGallery] = useState(false);

    const welcomeForm = useForm({
        content: settings.welcome?.content || {
            badge: 'Sambutan',
            title: 'Selamat Datang di IMAM HAFSH',
            description: 'Kami berkomitmen menghadirkan pendidikan yang menumbuhkan cinta Al-Qur\'an, adab, dan prestasi. PPDB disiapkan agar orang tua mendapatkan informasi yang jelas sebelum bergabung.',
            image: '/images/logo.png',
            items: [
                'Pendampingan harian di asrama',
                'Pembiasaan ibadah dan adab',
                'Kegiatan akademik dan non-akademik',
                'Lingkungan aman dan kondusif',
            ],
        },
        is_active: settings.welcome?.is_active ?? true,
        order: settings.welcome?.order ?? 6,
    });

    const [uploadingWelcome, setUploadingWelcome] = useState(false);

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingBanner(true);

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to server using axios (has built-in CSRF handling)
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post('/admin/ppdb/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success && response.data.path) {
                // Update form data with the server path
                heroForm.setData('content', { ...heroForm.data.content, banner_image: response.data.path });
            } else {
                alert('Upload gagal: ' + (response.data.message || 'Silakan coba lagi.'));
            }
        } catch (error: any) {
            console.error('Upload failed:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Terjadi kesalahan';
            alert('Upload gagal. ' + errorMsg);
        } finally {
            setUploadingBanner(false);
        }
    };

    const handleSubmit = (form: any, section: string) => {
        form.post(`/admin/ppdb/settings/${section}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="PPDB Settings - Admin" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">PPDB Settings</h2>
                    <p className="text-muted-foreground">
                        Manage content for the PPDB (Student Registration) page
                    </p>
                </div>

                {showSuccess && (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Settings updated successfully!
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="hero">Hero Section</TabsTrigger>
                        <TabsTrigger value="programs">Programs</TabsTrigger>
                        <TabsTrigger value="flow">Flow Steps</TabsTrigger>
                        <TabsTrigger value="fees">Fees</TabsTrigger>
                        <TabsTrigger value="faqs">FAQs</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        <TabsTrigger value="welcome">Welcome</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Section</CardTitle>
                                <CardDescription>Main banner content for PPDB page</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(heroForm, 'hero'); }} className="space-y-4">
                                    <div>
                                        <Label htmlFor="hero_title">Title</Label>
                                        <Input
                                            id="hero_title"
                                            value={heroForm.data.content.title}
                                            onChange={(e) => heroForm.setData('content', { ...heroForm.data.content, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="hero_description">Description</Label>
                                        <Textarea
                                            id="hero_description"
                                            value={heroForm.data.content.description}
                                            onChange={(e) => heroForm.setData('content', { ...heroForm.data.content, description: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="hero_url">Registration URL</Label>
                                        <Input
                                            id="hero_url"
                                            type="url"
                                            value={heroForm.data.content.registration_url}
                                            onChange={(e) => heroForm.setData('content', { ...heroForm.data.content, registration_url: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="hero_banner">Banner Image</Label>
                                        <div className="mt-2 space-y-3">
                                            {heroForm.data.content.banner_image && (
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                                    <img
                                                        src={bannerPreview || heroForm.data.content.banner_image}
                                                        alt="Banner preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <Input
                                                        id="hero_banner_upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleBannerUpload}
                                                        disabled={uploadingBanner}
                                                        className="cursor-pointer"
                                                    />
                                                    {uploadingBanner && (
                                                        <span className="text-sm text-muted-foreground">Uploading...</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="hero_banner_path" className="text-sm text-muted-foreground">Or enter image path manually:</Label>
                                                    <Input
                                                        id="hero_banner_path"
                                                        value={heroForm.data.content.banner_image}
                                                        onChange={(e) => heroForm.setData('content', { ...heroForm.data.content, banner_image: e.target.value })}
                                                        placeholder="/images/banner.png"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={heroForm.processing || uploadingBanner}>
                                        {heroForm.processing ? 'Saving...' : 'Save Hero Section'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="programs">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Programs</CardTitle>
                                <CardDescription>Featured programs displayed in hero section</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(programsForm, 'programs'); }} className="space-y-6">
                                    {programsForm.data.content.items.map((item: any, index: number) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-3">
                                            <h4 className="font-semibold">Program {index + 1}</h4>
                                            <div className="grid gap-3">
                                                <div>
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const newItems = [...programsForm.data.content.items];
                                                            newItems[index].title = e.target.value;
                                                            programsForm.setData('content', { ...programsForm.data.content, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Subtitle</Label>
                                                    <Input
                                                        value={item.subtitle}
                                                        onChange={(e) => {
                                                            const newItems = [...programsForm.data.content.items];
                                                            newItems[index].subtitle = e.target.value;
                                                            programsForm.setData('content', { ...programsForm.data.content, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button type="submit" disabled={programsForm.processing}>
                                        {programsForm.processing ? 'Saving...' : 'Save Programs'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="flow">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registration Flow Steps</CardTitle>
                                <CardDescription>Steps in the registration process</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(flowStepsForm, 'flow_steps'); }} className="space-y-6">
                                    {flowStepsForm.data.content.items.map((item: any, index: number) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-3">
                                            <h4 className="font-semibold">Step {index + 1}</h4>
                                            <div className="grid gap-3">
                                                <div>
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const newItems = [...flowStepsForm.data.content.items];
                                                            newItems[index].title = e.target.value;
                                                            flowStepsForm.setData('content', { ...flowStepsForm.data.content, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <Textarea
                                                        value={item.description}
                                                        onChange={(e) => {
                                                            const newItems = [...flowStepsForm.data.content.items];
                                                            newItems[index].description = e.target.value;
                                                            flowStepsForm.setData('content', { ...flowStepsForm.data.content, items: newItems });
                                                        }}
                                                        rows={2}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button type="submit" disabled={flowStepsForm.processing}>
                                        {flowStepsForm.processing ? 'Saving...' : 'Save Flow Steps'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="fees">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fee Information</CardTitle>
                                <CardDescription>Registration and payment information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(feesForm, 'fees'); }} className="space-y-6">
                                    {feesForm.data.content.items.map((item: any, index: number) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-3">
                                            <h4 className="font-semibold">Fee Item {index + 1}</h4>
                                            <div className="grid gap-3">
                                                <div>
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const newItems = [...feesForm.data.content.items];
                                                            newItems[index].title = e.target.value;
                                                            feesForm.setData('content', { ...feesForm.data.content, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Price</Label>
                                                    <Input
                                                        value={item.price}
                                                        onChange={(e) => {
                                                            const newItems = [...feesForm.data.content.items];
                                                            newItems[index].price = e.target.value;
                                                            feesForm.setData('content', { ...feesForm.data.content, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Note</Label>
                                                    <Input
                                                        value={item.note}
                                                        onChange={(e) => {
                                                            const newItems = [...feesForm.data.content.items];
                                                            newItems[index].note = e.target.value;
                                                            feesForm.setData('content', { ...feesForm.data.content, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button type="submit" disabled={feesForm.processing}>
                                        {feesForm.processing ? 'Saving...' : 'Save Fees'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="faqs">
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                                <CardDescription>Common questions and answers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(faqsForm, 'faqs'); }} className="space-y-6">
                                    {faqsForm.data.content.items.map((item: any, index: number) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-3">
                                            <h4 className="font-semibold">FAQ {index + 1}</h4>
                                            <div className="grid gap-3">
                                                <div>
                                                    <Label>Question</Label>
                                                    <Input
                                                        value={item.question}
                                                        onChange={(e) => {
                                                            const newItems = [...faqsForm.data.content.items];
                                                            newItems[index].question = e.target.value;
                                                            faqsForm.setData('content', { ...faqsForm.data.content, items: newItems });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Answer</Label>
                                                    <Textarea
                                                        value={item.answer}
                                                        onChange={(e) => {
                                                            const newItems = [...faqsForm.data.content.items];
                                                            newItems[index].answer = e.target.value;
                                                            faqsForm.setData('content', { ...faqsForm.data.content, items: newItems });
                                                        }}
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button type="submit" disabled={faqsForm.processing}>
                                        {faqsForm.processing ? 'Saving...' : 'Save FAQs'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="gallery">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gallery Images</CardTitle>
                                <CardDescription>
                                    Upload images for the PPDB gallery section (recommended: 8 images, aspect ratio 4:3)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(galleryForm, 'gallery'); }} className="space-y-4">
                                    <div>
                                        <Label>Current Gallery Images</Label>
                                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            {galleryForm.data.content.images.map((src: string, index: number) => (
                                                <div key={index} className="group relative overflow-hidden rounded-lg border">
                                                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                                                        <img
                                                            src={src}
                                                            alt={`Gallery ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                                        <Input
                                                            value={src}
                                                            onChange={(e) => {
                                                                const newImages = [...galleryForm.data.content.images];
                                                                newImages[index] = e.target.value;
                                                                galleryForm.setData('content', { ...galleryForm.data.content, images: newImages });
                                                            }}
                                                            className="h-8 text-xs bg-white/90"
                                                            placeholder="Image path"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => {
                                                            const newImages = galleryForm.data.content.images.filter((_: string, i: number) => i !== index);
                                                            galleryForm.setData('content', { ...galleryForm.data.content, images: newImages });
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Add New Image</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    setUploadingGallery(true);
                                                    try {
                                                        const formData = new FormData();
                                                        formData.append('image', file);

                                                        const response = await axios.post('/admin/ppdb/upload-image', formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' },
                                                        });

                                                        if (response.data.success && response.data.path) {
                                                            const newImages = [...galleryForm.data.content.images, response.data.path];
                                                            galleryForm.setData('content', { ...galleryForm.data.content, images: newImages });
                                                        }
                                                    } catch (error: any) {
                                                        console.error('Upload failed:', error);
                                                        alert('Upload gagal: ' + (error.response?.data?.message || error.message));
                                                    } finally {
                                                        setUploadingGallery(false);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                disabled={uploadingGallery}
                                            />
                                            {uploadingGallery && <span className="text-sm text-muted-foreground">Uploading...</span>}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Or add image path manually below
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="/images/gallery-new.png"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const input = e.target as HTMLInputElement;
                                                        if (input.value) {
                                                            const newImages = [...galleryForm.data.content.images, input.value];
                                                            galleryForm.setData('content', { ...galleryForm.data.content, images: newImages });
                                                            input.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={(e) => {
                                                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                                    if (input.value) {
                                                        const newImages = [...galleryForm.data.content.images, input.value];
                                                        galleryForm.setData('content', { ...galleryForm.data.content, images: newImages });
                                                        input.value = '';
                                                    }
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={galleryForm.processing || uploadingGallery}>
                                        {galleryForm.processing ? 'Saving...' : 'Save Gallery'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="welcome">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome Section</CardTitle>
                                <CardDescription>
                                    Edit the welcome/greeting section content
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(welcomeForm, 'welcome'); }} className="space-y-4">
                                    <div>
                                        <Label>Badge Text</Label>
                                        <Input
                                            value={welcomeForm.data.content.badge}
                                            onChange={(e) => welcomeForm.setData('content', { ...welcomeForm.data.content, badge: e.target.value })}
                                            placeholder="Sambutan"
                                        />
                                    </div>

                                    <div>
                                        <Label>Title</Label>
                                        <Input
                                            value={welcomeForm.data.content.title}
                                            onChange={(e) => welcomeForm.setData('content', { ...welcomeForm.data.content, title: e.target.value })}
                                            placeholder="Selamat Datang di IMAM HAFSH"
                                        />
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            value={welcomeForm.data.content.description}
                                            onChange={(e) => welcomeForm.setData('content', { ...welcomeForm.data.content, description: e.target.value })}
                                            rows={4}
                                            placeholder="Description text..."
                                        />
                                    </div>

                                    <div>
                                        <Label>Welcome Image</Label>
                                        <div className="mt-2 space-y-3">
                                            {welcomeForm.data.content.image && (
                                                <div className="overflow-hidden rounded-lg border">
                                                    <img
                                                        src={welcomeForm.data.content.image}
                                                        alt="Welcome"
                                                        className="h-48 w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        setUploadingWelcome(true);
                                                        try {
                                                            const formData = new FormData();
                                                            formData.append('image', file);

                                                            const response = await axios.post('/admin/ppdb/upload-image', formData, {
                                                                headers: { 'Content-Type': 'multipart/form-data' },
                                                            });

                                                            if (response.data.success && response.data.path) {
                                                                welcomeForm.setData('content', { ...welcomeForm.data.content, image: response.data.path });
                                                            }
                                                        } catch (error: any) {
                                                            console.error('Upload failed:', error);
                                                            alert('Upload gagal: ' + (error.response?.data?.message || error.message));
                                                        } finally {
                                                            setUploadingWelcome(false);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    disabled={uploadingWelcome}
                                                />
                                                {uploadingWelcome && <span className="text-sm text-muted-foreground">Uploading...</span>}
                                            </div>
                                            <Input
                                                value={welcomeForm.data.content.image}
                                                onChange={(e) => welcomeForm.setData('content', { ...welcomeForm.data.content, image: e.target.value })}
                                                placeholder="/images/logo.png"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Welcome Items (4 items)</Label>
                                        <div className="mt-2 space-y-3">
                                            {welcomeForm.data.content.items.map((item: string, index: number) => (
                                                <div key={index}>
                                                    <Input
                                                        value={item}
                                                        onChange={(e) => {
                                                            const newItems = [...welcomeForm.data.content.items];
                                                            newItems[index] = e.target.value;
                                                            welcomeForm.setData('content', { ...welcomeForm.data.content, items: newItems });
                                                        }}
                                                        placeholder={`Item ${index + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={welcomeForm.processing || uploadingWelcome}>
                                        {welcomeForm.processing ? 'Saving...' : 'Save Welcome Section'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
