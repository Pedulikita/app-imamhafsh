import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, GripVertical, Save } from 'lucide-react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface FacilityCategory {
    id: number;
    name: string;
    slug: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    categories: FacilityCategory[];
}

export default function Categories({ categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Dashboard', href: dashboard() },
        { label: 'Facilities', href: '/admin/facilities' },
        { label: 'Kategori', href: '/admin/facilities/categories' },
    ];

    const [showDialog, setShowDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<FacilityCategory | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        order: categories.length,
        is_active: true,
    });

    const openCreateDialog = () => {
        setEditingCategory(null);
        reset();
        setData({ name: '', order: categories.length, is_active: true });
        setShowDialog(true);
    };

    const openEditDialog = (category: FacilityCategory) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            order: category.order,
            is_active: category.is_active,
        });
        setShowDialog(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingCategory) {
            put(`/admin/facilities/categories/${editingCategory.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDialog(false);
                    setMessage({ type: 'success', text: 'Kategori berhasil diperbarui' });
                    setTimeout(() => setMessage(null), 3000);
                },
                onError: () => {
                    setMessage({ type: 'error', text: 'Gagal memperbarui kategori' });
                }
            });
        } else {
            post('/admin/facilities/categories', {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDialog(false);
                    setMessage({ type: 'success', text: 'Kategori berhasil ditambahkan' });
                    setTimeout(() => setMessage(null), 3000);
                },
                onError: () => {
                    setMessage({ type: 'error', text: 'Gagal menambahkan kategori' });
                }
            });
        }
    };

    const handleDelete = (category: FacilityCategory) => {
        if (confirm(`Yakin ingin menghapus kategori "${category.name}"?`)) {
            router.delete(`/admin/facilities/categories/${category.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setMessage({ type: 'success', text: 'Kategori berhasil dihapus' });
                    setTimeout(() => setMessage(null), 3000);
                },
                onError: (errors) => {
                    setMessage({ type: 'error', text: errors.error || 'Gagal menghapus kategori' });
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Fasilitas" />

            <div className="flex flex-col gap-4 p-4">
                {message && (
                    <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                            {message.text}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Kategori Fasilitas</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kategori untuk pengklasifikasian fasilitas
                        </p>
                    </div>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Urutan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                    <TableCell>{category.order}</TableCell>
                                    <TableCell>
                                        {category.is_active ? (
                                            <span className="text-green-600 text-sm">Aktif</span>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Nonaktif</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditDialog(category)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(category)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        Belum ada kategori. Klik tombol "Tambah Kategori" untuk membuat kategori baru.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Dialog Create/Edit */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCategory
                                    ? 'Perbarui informasi kategori fasilitas'
                                    : 'Buat kategori baru untuk mengklasifikasikan fasilitas'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Kategori *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Eksterior, Asrama, Kelas & Office"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Urutan</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Semakin kecil angka, semakin awal urutan tampil
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Kategori Aktif</Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {editingCategory ? 'Perbarui' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
