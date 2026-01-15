import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Bell, Save } from 'lucide-react';

interface Props {
    parent: {
        father_name: string | null;
        mother_name: string | null;
        father_phone: string | null;
        mother_phone: string | null;
        father_email: string | null;
        mother_email: string | null;
        father_occupation: string | null;
        mother_occupation: string | null;
        address: string | null;
        emergency_contact_name: string | null;
        emergency_contact_phone: string | null;
        emergency_contact_relation: string | null;
    };
    notification_preferences: {
        receive_grade_notifications: boolean;
        receive_attendance_notifications: boolean;
        receive_behavior_notifications: boolean;
        receive_announcement_notifications: boolean;
    };
}

export default function ProfileSettings({ parent, notification_preferences }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        father_name: parent.father_name || '',
        mother_name: parent.mother_name || '',
        father_phone: parent.father_phone || '',
        mother_phone: parent.mother_phone || '',
        father_email: parent.father_email || '',
        mother_email: parent.mother_email || '',
        father_occupation: parent.father_occupation || '',
        mother_occupation: parent.mother_occupation || '',
        address: parent.address || '',
        emergency_contact_name: parent.emergency_contact_name || '',
        emergency_contact_phone: parent.emergency_contact_phone || '',
        emergency_contact_relation: parent.emergency_contact_relation || '',
        receive_grade_notifications: notification_preferences.receive_grade_notifications,
        receive_attendance_notifications: notification_preferences.receive_attendance_notifications,
        receive_behavior_notifications: notification_preferences.receive_behavior_notifications,
        receive_announcement_notifications: notification_preferences.receive_announcement_notifications,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('parent.profile.update'));
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link href={route('parent.dashboard')}>
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Dashboard
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <User className="w-8 h-8" />
                            Pengaturan Profil
                        </h1>
                        <p className="text-slate-600">
                            Kelola informasi orang tua dan preferensi notifikasi
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Father Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Ayah</CardTitle>
                                <CardDescription>
                                    Data kontak dan profil ayah siswa
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-1">
                                        Nama Ayah
                                    </label>
                                    <input
                                        type="text"
                                        value={data.father_name}
                                        onChange={(e) => setData('father_name', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Masukkan nama ayah"
                                    />
                                    {errors.father_name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.father_name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 mb-1">
                                            Email Ayah
                                        </label>
                                        <input
                                            type="email"
                                            value={data.father_email}
                                            onChange={(e) => setData('father_email', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="email@example.com"
                                        />
                                        {errors.father_email && (
                                            <p className="text-sm text-red-600 mt-1">{errors.father_email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 mb-1">
                                            Nomor Telepon Ayah
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.father_phone}
                                            onChange={(e) => setData('father_phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="+62 812 3456 7890"
                                        />
                                        {errors.father_phone && (
                                            <p className="text-sm text-red-600 mt-1">{errors.father_phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-1">
                                        Pekerjaan Ayah
                                    </label>
                                    <input
                                        type="text"
                                        value={data.father_occupation}
                                        onChange={(e) => setData('father_occupation', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Pekerjaan ayah"
                                    />
                                    {errors.father_occupation && (
                                        <p className="text-sm text-red-600 mt-1">{errors.father_occupation}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mother Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Ibu</CardTitle>
                                <CardDescription>
                                    Data kontak dan profil ibu siswa
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-1">
                                        Nama Ibu
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mother_name}
                                        onChange={(e) => setData('mother_name', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Masukkan nama ibu"
                                    />
                                    {errors.mother_name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.mother_name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 mb-1">
                                            Email Ibu
                                        </label>
                                        <input
                                            type="email"
                                            value={data.mother_email}
                                            onChange={(e) => setData('mother_email', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="email@example.com"
                                        />
                                        {errors.mother_email && (
                                            <p className="text-sm text-red-600 mt-1">{errors.mother_email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 mb-1">
                                            Nomor Telepon Ibu
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.mother_phone}
                                            onChange={(e) => setData('mother_phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="+62 812 3456 7890"
                                        />
                                        {errors.mother_phone && (
                                            <p className="text-sm text-red-600 mt-1">{errors.mother_phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-1">
                                        Pekerjaan Ibu
                                    </label>
                                    <input
                                        type="text"
                                        value={data.mother_occupation}
                                        onChange={(e) => setData('mother_occupation', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Pekerjaan ibu"
                                    />
                                    {errors.mother_occupation && (
                                        <p className="text-sm text-red-600 mt-1">{errors.mother_occupation}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Tambahan</CardTitle>
                                <CardDescription>
                                    Alamat dan kontak darurat
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-1">
                                        Alamat
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Alamat lengkap keluarga"
                                        rows={3}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-900 mb-1">
                                        Nama Kontak Darurat
                                    </label>
                                    <input
                                        type="text"
                                        value={data.emergency_contact_name}
                                        onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Nama orang yang bisa dihubungi darurat"
                                    />
                                    {errors.emergency_contact_name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.emergency_contact_name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 mb-1">
                                            Nomor Telepon Kontak Darurat
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.emergency_contact_phone}
                                            onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="+62 812 3456 7890"
                                        />
                                        {errors.emergency_contact_phone && (
                                            <p className="text-sm text-red-600 mt-1">{errors.emergency_contact_phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-900 mb-1">
                                            Hubungan dengan Siswa
                                        </label>
                                        <input
                                            type="text"
                                            value={data.emergency_contact_relation}
                                            onChange={(e) => setData('emergency_contact_relation', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Contoh: Nenek, Paman, dll"
                                        />
                                        {errors.emergency_contact_relation && (
                                            <p className="text-sm text-red-600 mt-1">{errors.emergency_contact_relation}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notification Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    Preferensi Notifikasi
                                </CardTitle>
                                <CardDescription>
                                    Pilih jenis notifikasi yang ingin Anda terima
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="grade_notifications"
                                        checked={data.receive_grade_notifications}
                                        onChange={(e) => setData('receive_grade_notifications', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                                    />
                                    <label htmlFor="grade_notifications" className="flex-1 cursor-pointer">
                                        <p className="font-medium text-slate-900">Notifikasi Nilai</p>
                                        <p className="text-sm text-slate-600">Terima pemberitahuan saat ada nilai baru</p>
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="attendance_notifications"
                                        checked={data.receive_attendance_notifications}
                                        onChange={(e) => setData('receive_attendance_notifications', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                                    />
                                    <label htmlFor="attendance_notifications" className="flex-1 cursor-pointer">
                                        <p className="font-medium text-slate-900">Notifikasi Kehadiran</p>
                                        <p className="text-sm text-slate-600">Terima pemberitahuan tentang kehadiran anak</p>
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="behavior_notifications"
                                        checked={data.receive_behavior_notifications}
                                        onChange={(e) => setData('receive_behavior_notifications', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                                    />
                                    <label htmlFor="behavior_notifications" className="flex-1 cursor-pointer">
                                        <p className="font-medium text-slate-900">Notifikasi Perilaku</p>
                                        <p className="text-sm text-slate-600">Terima laporan tentang perilaku anak</p>
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="announcement_notifications"
                                        checked={data.receive_announcement_notifications}
                                        onChange={(e) => setData('receive_announcement_notifications', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                                    />
                                    <label htmlFor="announcement_notifications" className="flex-1 cursor-pointer">
                                        <p className="font-medium text-slate-900">Notifikasi Pengumuman</p>
                                        <p className="text-sm text-slate-600">Terima pengumuman penting dari sekolah</p>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <Button 
                                type="submit"
                                className="flex items-center gap-2"
                                disabled={processing}
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                            <Link href={route('parent.dashboard')}>
                                <Button variant="outline">
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
