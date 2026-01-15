import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        name: '',
        email: '',
        birth_date: '',
        birth_place: '',
        gender: '',
        address: '',
        phone: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        class: '',
        academic_year: new Date().getFullYear(),
        enrollment_date: '',
        photo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/monitoring/students');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
        }
    };

    return (
        <AppLayout>
            <Head title="Tambah Siswa - Monitoring" />
            
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/monitoring/students">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Tambah Siswa Baru
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Lengkapi formulir untuk menambah data siswa
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6">Informasi Dasar</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="student_id">NIS/NISN *</Label>
                                <Input
                                    id="student_id"
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    placeholder="Masukkan NIS atau NISN"
                                    className="mt-2"
                                />
                                <InputError message={errors.student_id} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="name">Nama Lengkap *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama lengkap"
                                    className="mt-2"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="student@example.com"
                                    className="mt-2"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="08xxxxxxxxx"
                                    className="mt-2"
                                />
                                <InputError message={errors.phone} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="birth_date">Tanggal Lahir *</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    className="mt-2"
                                />
                                <InputError message={errors.birth_date} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="birth_place">Tempat Lahir *</Label>
                                <Input
                                    id="birth_place"
                                    value={data.birth_place}
                                    onChange={(e) => setData('birth_place', e.target.value)}
                                    placeholder="Kota tempat lahir"
                                    className="mt-2"
                                />
                                <InputError message={errors.birth_place} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="gender">Jenis Kelamin *</Label>
                                <select
                                    id="gender"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full mt-2 h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                                >
                                    <option value="">Pilih jenis kelamin</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                                <InputError message={errors.gender} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="photo">Foto Siswa</Label>
                                <div className="mt-2">
                                    <input
                                        id="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                <InputError message={errors.photo} className="mt-1" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="address">Alamat *</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Alamat lengkap siswa"
                                className="mt-2"
                                rows={3}
                            />
                            <InputError message={errors.address} className="mt-1" />
                        </div>
                    </Card>

                    {/* Parent Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6">Informasi Orang Tua/Wali</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="parent_name">Nama Orang Tua/Wali *</Label>
                                <Input
                                    id="parent_name"
                                    value={data.parent_name}
                                    onChange={(e) => setData('parent_name', e.target.value)}
                                    placeholder="Nama lengkap orang tua/wali"
                                    className="mt-2"
                                />
                                <InputError message={errors.parent_name} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="parent_phone">Nomor Telepon Orang Tua *</Label>
                                <Input
                                    id="parent_phone"
                                    value={data.parent_phone}
                                    onChange={(e) => setData('parent_phone', e.target.value)}
                                    placeholder="08xxxxxxxxx"
                                    className="mt-2"
                                />
                                <InputError message={errors.parent_phone} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="parent_email">Email Orang Tua</Label>
                                <Input
                                    id="parent_email"
                                    type="email"
                                    value={data.parent_email}
                                    onChange={(e) => setData('parent_email', e.target.value)}
                                    placeholder="parent@example.com"
                                    className="mt-2"
                                />
                                <InputError message={errors.parent_email} className="mt-1" />
                            </div>
                        </div>
                    </Card>

                    {/* Academic Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6">Informasi Akademik</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="class">Kelas *</Label>
                                <Input
                                    id="class"
                                    value={data.class}
                                    onChange={(e) => setData('class', e.target.value)}
                                    placeholder="VII A, VIII B, IX C, dll"
                                    className="mt-2"
                                />
                                <InputError message={errors.class} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="academic_year">Tahun Akademik *</Label>
                                <Input
                                    id="academic_year"
                                    type="number"
                                    min="2020"
                                    max="2030"
                                    value={data.academic_year}
                                    onChange={(e) => setData('academic_year', parseInt(e.target.value))}
                                    className="mt-2"
                                />
                                <InputError message={errors.academic_year} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="enrollment_date">Tanggal Masuk *</Label>
                                <Input
                                    id="enrollment_date"
                                    type="date"
                                    value={data.enrollment_date}
                                    onChange={(e) => setData('enrollment_date', e.target.value)}
                                    className="mt-2"
                                />
                                <InputError message={errors.enrollment_date} className="mt-1" />
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/monitoring/students">
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Data Siswa'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}