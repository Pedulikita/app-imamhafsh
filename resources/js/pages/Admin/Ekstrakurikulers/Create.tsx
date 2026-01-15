import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

export default function Create() {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Ekstrakurikuler', href: '/admin/ekstrakurikuler' },
        { label: 'Tambah Ekstrakurikuler', href: '/admin/ekstrakurikuler/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        order: 0,
        is_active: true,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/ekstrakurikuler');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Ekstrakurikuler" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/ekstrakurikuler">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Tambah Ekstrakurikuler</h1>
                        <p className="text-sm text-muted-foreground">
                            Buat ekstrakurikuler baru
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Ekstrakurikuler *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Sepak Bola, Pramuka, dll"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
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
                            <Link href="/admin/ekstrakurikuler">
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Ekstrakurikuler'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
