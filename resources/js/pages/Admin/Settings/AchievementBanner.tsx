import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Trophy, Upload, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { useRef } from 'react';

interface Setting {
    id: number;
    key: string;
    value: string | null;
    label: string;
    type: string;
    group: string;
    order: number;
}

interface PageProps {
    settings: Setting[];
}

export default function AchievementBanner() {
    const { settings } = usePage<PageProps>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Convert settings array to object for easy access
    const settingValues = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
    }, {} as Record<string, string>);

    const { data, setData, post, processing, errors, reset, isDirty } = useForm({
        achievement_banner_title: settingValues.achievement_banner_title || 'Selamat & Sukses',
        achievement_banner_subtitle: settingValues.achievement_banner_subtitle || '',
        achievement_banner_description: settingValues.achievement_banner_description || '',
        achievement_banner_image: settingValues.achievement_banner_image || '/images/PRESTAS.png',
        achievement_banner_bg_color: settingValues.achievement_banner_bg_color || 'emerald-50',
        achievement_banner_header_color: settingValues.achievement_banner_header_color || 'emerald-600',
        achievement_banner_enabled: settingValues.achievement_banner_enabled || 'true',
        achievement_banner_image_file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Add text data
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'achievement_banner_image_file' && value !== null) {
                formData.append(key, value as string);
            }
        });

        // Add file if uploaded
        if (data.achievement_banner_image_file) {
            formData.append('achievement_banner_image_file', data.achievement_banner_image_file);
        }

        // Add group information
        formData.append('group', 'achievement_banner');

        post('/admin/settings', {
            data: formData,
            forceFormData: true,
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('achievement_banner_image_file', file);
            
            // Preview image
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setData('achievement_banner_image', result);
            };
            reader.readAsDataURL(file);
        }
    };

    const colorOptions = [
        { value: 'blue-50', label: 'Blue Light', bg: 'bg-blue-50', header: 'bg-blue-600' },
        { value: 'emerald-50', label: 'Emerald Light', bg: 'bg-emerald-50', header: 'bg-emerald-600' },
        { value: 'purple-50', label: 'Purple Light', bg: 'bg-purple-50', header: 'bg-purple-600' },
        { value: 'orange-50', label: 'Orange Light', bg: 'bg-orange-50', header: 'bg-orange-600' },
        { value: 'red-50', label: 'Red Light', bg: 'bg-red-50', header: 'bg-red-600' },
        { value: 'yellow-50', label: 'Yellow Light', bg: 'bg-yellow-50', header: 'bg-yellow-600' },
        { value: 'green-50', label: 'Green Light', bg: 'bg-green-50', header: 'bg-green-600' },
        { value: 'pink-50', label: 'Pink Light', bg: 'bg-pink-50', header: 'bg-pink-600' },
    ];

    return (
        <AppLayout>
            <Head title="Achievement Banner Settings" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Achievement Banner Settings</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Kelola tampilan achievement banner yang ditampilkan di halaman About Us
                        </p>
                    </div>
                    <Trophy className="h-8 w-8 text-emerald-600" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Settings Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Achievement Banner</CardTitle>
                            <CardDescription>
                                Ubah konten dan tampilan achievement banner
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Enable/Disable */}
                                <div className="space-y-2">
                                    <Label htmlFor="achievement_banner_enabled">Status</Label>
                                    <select
                                        id="achievement_banner_enabled"
                                        value={data.achievement_banner_enabled}
                                        onChange={(e) => setData('achievement_banner_enabled', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                    >
                                        <option value="true">Aktif</option>
                                        <option value="false">Nonaktif</option>
                                    </select>
                                    {errors.achievement_banner_enabled && (
                                        <p className="text-sm text-red-600">{errors.achievement_banner_enabled}</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="achievement_banner_title">Judul</Label>
                                    <Input
                                        id="achievement_banner_title"
                                        type="text"
                                        value={data.achievement_banner_title}
                                        onChange={(e) => setData('achievement_banner_title', e.target.value)}
                                        placeholder="Contoh: Selamat & Sukses"
                                    />
                                    {errors.achievement_banner_title && (
                                        <p className="text-sm text-red-600">{errors.achievement_banner_title}</p>
                                    )}
                                </div>

                                {/* Subtitle */}
                                <div className="space-y-2">
                                    <Label htmlFor="achievement_banner_subtitle">Subjudul (Opsional)</Label>
                                    <Input
                                        id="achievement_banner_subtitle"
                                        type="text"
                                        value={data.achievement_banner_subtitle}
                                        onChange={(e) => setData('achievement_banner_subtitle', e.target.value)}
                                        placeholder="Contoh: 2024-2025"
                                    />
                                    {errors.achievement_banner_subtitle && (
                                        <p className="text-sm text-red-600">{errors.achievement_banner_subtitle}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="achievement_banner_description">Deskripsi (Opsional)</Label>
                                    <Textarea
                                        id="achievement_banner_description"
                                        value={data.achievement_banner_description}
                                        onChange={(e) => setData('achievement_banner_description', e.target.value)}
                                        placeholder="Deskripsi singkat tentang achievement"
                                        rows={3}
                                    />
                                    {errors.achievement_banner_description && (
                                        <p className="text-sm text-red-600">{errors.achievement_banner_description}</p>
                                    )}
                                </div>

                                {/* Color Theme */}
                                <div className="space-y-2">
                                    <Label>Tema Warna</Label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => {
                                                    setData('achievement_banner_bg_color', color.value);
                                                    setData('achievement_banner_header_color', color.value.replace('-50', '-600'));
                                                }}
                                                className={`relative flex h-12 w-full items-center justify-center rounded-lg border-2 transition-colors ${
                                                    data.achievement_banner_bg_color === color.value
                                                        ? 'border-blue-500'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                } ${color.bg}`}
                                            >
                                                <div className={`h-3 w-3 rounded ${color.header}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="achievement_banner_image">Gambar Achievement</Label>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Upload Gambar
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        {data.achievement_banner_image_file && (
                                            <span className="text-sm text-green-600">
                                                File baru dipilih: {data.achievement_banner_image_file.name}
                                            </span>
                                        )}
                                    </div>
                                    {errors.achievement_banner_image && (
                                        <p className="text-sm text-red-600">{errors.achievement_banner_image}</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => reset()}
                                        disabled={!isDirty}
                                        className="flex items-center gap-2"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>
                                Pratinjau achievement banner sesuai pengaturan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.achievement_banner_enabled === 'true' ? (
                                <div className={`overflow-hidden rounded-xl bg-${data.achievement_banner_bg_color} text-center shadow-lg`}>
                                    <div className={`bg-${data.achievement_banner_header_color} py-3 text-white`}>
                                        <h3 className="font-bold">{data.achievement_banner_title}</h3>
                                        {data.achievement_banner_subtitle && (
                                            <p className="text-sm opacity-90">{data.achievement_banner_subtitle}</p>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        {data.achievement_banner_image && (
                                            <img 
                                                src={data.achievement_banner_image} 
                                                alt="Achievement Preview" 
                                                className="mx-auto mb-4 h-32 w-auto object-contain"
                                            />
                                        )}
                                        {data.achievement_banner_description && (
                                            <p className="text-sm text-slate-600">
                                                {data.achievement_banner_description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                                    <div className="text-center">
                                        <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500">
                                            Achievement Banner Nonaktif
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}