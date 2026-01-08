import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Facebook,
    Instagram,
    Youtube,
    Twitter,
    Linkedin,
    Play,
    RefreshCw,
    Save,
    ExternalLink
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

const Social: React.FC<Props> = ({ settings }) => {
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
            onSuccess: () => {
                setMessage({type: 'success', text: 'Pengaturan media sosial berhasil disimpan'});
            },
            onError: (errors) => {
                console.error(errors);
                setMessage({type: 'error', text: 'Gagal menyimpan pengaturan media sosial'});
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
            case 'social_facebook':
                return <Facebook className="h-4 w-4" />;
            case 'social_instagram':
                return <Instagram className="h-4 w-4" />;
            case 'social_youtube':
                return <Youtube className="h-4 w-4" />;
            case 'social_twitter':
                return <Twitter className="h-4 w-4" />;
            case 'social_linkedin':
                return <Linkedin className="h-4 w-4" />;
            case 'social_tiktok':
                return <Play className="h-4 w-4" />;
            default:
                return <ExternalLink className="h-4 w-4" />;
        }
    };

    const getBrandColor = (key: string) => {
        switch (key) {
            case 'social_facebook':
                return 'text-blue-600';
            case 'social_instagram':
                return 'text-pink-600';
            case 'social_youtube':
                return 'text-red-600';
            case 'social_twitter':
                return 'text-blue-400';
            case 'social_linkedin':
                return 'text-blue-700';
            case 'social_tiktok':
                return 'text-black';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Media Sosial" />
            
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
                        <h1 className="text-3xl font-bold">Pengaturan Media Sosial</h1>
                        <p className="text-muted-foreground">Kelola akun media sosial institusi</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/admin/settings/contact')}
                        >
                            Kontak
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
                        <CardTitle>Akun Media Sosial</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Tambahkan link ke akun media sosial resmi institusi
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
                                                <span className={getBrandColor(setting.key)}>
                                                    {getIcon(setting.key)}
                                                </span>
                                                <Label className="font-medium">
                                                    {setting.label}
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
                                                <div className="flex-1 relative">
                                                    <Input
                                                        type="url"
                                                        value={data.settings[setting.id]?.value || ''}
                                                        onChange={(e) => handleSettingChange(setting.id, 'value', e.target.value)}
                                                        placeholder={`https://www.${setting.label.toLowerCase()}.com/username`}
                                                        className="pr-10"
                                                    />
                                                    {data.settings[setting.id]?.value && (
                                                        <a
                                                            href={data.settings[setting.id].value}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </div>
                                                
                                                {/* Active Toggle */}
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={data.settings[setting.id]?.is_active || false}
                                                        onCheckedChange={(checked) => handleSettingChange(setting.id, 'is_active', checked)}
                                                    />
                                                    <Label className="text-xs text-muted-foreground">
                                                        Tampilkan
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
                                <Instagram className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-medium">Tidak ada pengaturan media sosial</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Klik tombol "Inisialisasi Default" untuk membuat pengaturan media sosial default.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Social;