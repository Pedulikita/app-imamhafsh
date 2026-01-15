import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Settings,
    Globe,
    FileText,
    Image,
    RefreshCw,
    Save,
    Tag
} from 'lucide-react';

interface Setting {
    id: number;
    key: string;
    type: string;
    group: string;
    label: string;
    value: string;
    description?: string;
    order: number;
    is_active: boolean;
}

interface Props {
    settings: Setting[];
}

const General: React.FC<Props> = ({ settings }) => {
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    
    const { data, setData, post, processing } = useForm({
        bulk_update: '1',
        settings: settings.reduce((acc, setting) => {
            acc[setting.id] = {
                value: setting.value || '',
                is_active: setting.is_active
            };
            return acc;
        }, {} as Record<number, { value: string; is_active: boolean }>)
    });

    const handleSettingChange = (settingId: number, field: 'value' | 'is_active', value: string | boolean) => {
        setData('settings', {
            ...data.settings,
            [settingId]: {
                ...data.settings[settingId],
                [field]: value
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        post('/admin/settings', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setMessage({type: 'success', text: 'Pengaturan umum berhasil disimpan'});
                // Auto-hide success message after 3 seconds
                setTimeout(() => setMessage(null), 3000);
            },
            onError: (errors) => {
                console.error(errors);
                setMessage({type: 'error', text: 'Gagal menyimpan pengaturan umum'});
            },
            onFinish: () => {
                // Force reload the page data to ensure footer updates
                router.reload({ only: ['settings'] });
            }
        });
    };

    const initializeDefaults = () => {
        setMessage(null);
        router.post('/admin/settings/initialize-defaults', {}, {
            onSuccess: () => {
                setMessage({type: 'success', text: 'Pengaturan default berhasil diinisialisasi'});
            },
            onError: () => {
                setMessage({type: 'error', text: 'Gagal menginisialisasi pengaturan default'});
            }
        });
    };

    const getIcon = (key: string) => {
        switch (key) {
            case 'site_name':
                return <Globe className="h-4 w-4" />;
            case 'site_tagline':
                return <Tag className="h-4 w-4" />;
            case 'site_description':
                return <FileText className="h-4 w-4" />;
            case 'site_logo':
                return <Image className="h-4 w-4" />;
            default:
                return <Settings className="h-4 w-4" />;
        }
    };

    const getInputType = (type: string) => {
        switch (type) {
            case 'email':
                return 'email';
            case 'phone':
                return 'tel';
            case 'url':
                return 'url';
            default:
                return 'text';
        }
    };

    const getPlaceholder = (setting: Setting) => {
        switch (setting.key) {
            case 'site_name':
                return 'Nama website atau sekolah';
            case 'site_tagline':
                return 'Tagline atau motto';
            case 'site_description':
                return 'Deskripsi singkat tentang website';
            case 'site_logo':
                return '/images/logo.png';
            default:
                return `Masukkan ${setting.label.toLowerCase()}`;
        }
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Umum" />
            
            <div className="space-y-6">
                {message && (
                    <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                            {message.text}
                        </AlertDescription>
                    </Alert>
                )}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Pengaturan Umum</h1>
                        <p className="text-muted-foreground">Kelola informasi umum website</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/admin/settings/contact')}
                        >
                            Kontak
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/admin/settings/social')}
                        >
                            Media Sosial
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={initializeDefaults}
                            disabled={processing}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Inisialisasi Default
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Umum Website</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Perbarui informasi umum yang akan ditampilkan di website
                        </p>
                    </CardHeader>
                    <CardContent>
                        {settings.length > 0 ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {settings.map((setting) => (
                                    <div key={setting.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                        {/* Label & Description */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                {getIcon(setting.key)}
                                                <Label className="font-medium">
                                                    {setting.label}
                                                    <span className="text-xs text-muted-foreground ml-1">
                                                        ({setting.type === 'textarea' ? 'Textarea' : 'Teks'})
                                                    </span>
                                                </Label>
                                            </div>
                                            {setting.description && (
                                                <p className="text-xs text-muted-foreground">
                                                    {setting.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Input Field */}
                                        <div className="lg:col-span-2 space-y-3">
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    {setting.type === 'textarea' ? (
                                                        <Textarea
                                                            value={data.settings[setting.id]?.value || ''}
                                                            onChange={(e) => handleSettingChange(setting.id, 'value', e.target.value)}
                                                            placeholder={getPlaceholder(setting)}
                                                            rows={3}
                                                        />
                                                    ) : (
                                                        <Input
                                                            type={getInputType(setting.type)}
                                                            value={data.settings[setting.id]?.value || ''}
                                                            onChange={(e) => handleSettingChange(setting.id, 'value', e.target.value)}
                                                            placeholder={getPlaceholder(setting)}
                                                        />
                                                    )}
                                                </div>
                                                
                                                {/* Active Toggle */}
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={data.settings[setting.id]?.is_active || false}
                                                        onCheckedChange={(checked) => handleSettingChange(setting.id, 'is_active', checked)}
                                                    />
                                                    <Label className="text-xs text-muted-foreground">
                                                        Aktif
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end pt-6 border-t">
                                    <Button type="submit" disabled={processing}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-12">
                                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-medium">Tidak ada pengaturan umum</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Klik tombol "Inisialisasi Default" untuk membuat pengaturan umum default.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default General;
