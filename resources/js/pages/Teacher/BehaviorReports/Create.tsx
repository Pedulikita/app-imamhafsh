import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    ClipboardCheck, 
    ArrowLeft, 
    Save,
    User,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Minus
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Student {
    id: number;
    name: string;
    class: string;
}

interface BehaviorCategory {
    id: number;
    name: string;
    type: 'positive' | 'negative' | 'neutral';
    description?: string;
}

interface Props {
    students: Student[];
    behavior_categories: BehaviorCategory[];
    selected_student?: Student;
}

interface FormData {
    student_id: string;
    behavior_category_id: string;
    incident_date: string;
    description: string;
    severity: string;
    location: string;
    witnesses: string;
    action_taken: string;
    parent_notified: boolean;
    follow_up_required: boolean;
    notes: string;
}

export default function Create({ students, behavior_categories, selected_student }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        student_id: selected_student?.id.toString() || '',
        behavior_category_id: '',
        incident_date: new Date().toISOString().split('T')[0],
        description: '',
        severity: 'medium',
        location: '',
        witnesses: '',
        action_taken: '',
        parent_notified: false,
        follow_up_required: false,
        notes: '',
    });

    const [selectedCategory, setSelectedCategory] = useState<BehaviorCategory | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/behavior-reports', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleCategoryChange = (categoryId: string) => {
        setData('behavior_category_id', categoryId);
        const category = behavior_categories?.find(c => c.id.toString() === categoryId);
        setSelectedCategory(category || null);
    };

    const getCategoryIcon = (type: string) => {
        switch (type) {
            case 'positive':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'negative':
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'neutral':
                return <Minus className="h-5 w-5 text-gray-500" />;
            default:
                return <Minus className="h-5 w-5 text-gray-500" />;
        }
    };

    const getCategoryColor = (type: string) => {
        switch (type) {
            case 'positive':
                return 'border-green-200 bg-green-50';
            case 'negative':
                return 'border-red-200 bg-red-50';
            case 'neutral':
                return 'border-gray-200 bg-gray-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link href="/behavior-reports">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <ClipboardCheck className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Buat Laporan Perilaku Siswa
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Dokumentasikan perilaku siswa untuk evaluasi dan tindak lanjut
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Buat Laporan Perilaku Siswa" />

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Student Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                Informasi Siswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="student_id">Pilih Siswa *</Label>
                                <Select
                                    value={data.student_id}
                                    onValueChange={(value) => setData('student_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih siswa..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((student) => (
                                            <SelectItem key={student.id} value={student.id.toString()}>
                                                {student.name} - {student.class}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.student_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="incident_date">Tanggal Kejadian *</Label>
                                <Input
                                    id="incident_date"
                                    type="date"
                                    value={data.incident_date}
                                    onChange={(e) => setData('incident_date', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                {errors.incident_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.incident_date}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="location">Lokasi Kejadian</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="Contoh: Kelas 5A, Kantin, Lapangan..."
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Behavior Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <ClipboardCheck className="h-5 w-5 mr-2" />
                                Detail Perilaku
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Kategori Perilaku *</Label>
                                <div className="grid gap-3 mt-2">
                                    {['positive', 'negative', 'neutral'].map((type) => (
                                        <div key={type}>
                                            <div className="text-sm font-medium capitalize text-gray-700 mb-2">
                                                {type === 'positive' && 'Perilaku Positif'}
                                                {type === 'negative' && 'Perilaku Perlu Perhatian'}
                                                {type === 'neutral' && 'Perilaku Netral'}
                                            </div>
                                            <div className="grid gap-2 md:grid-cols-2">
                                                {behavior_categories
                                                    ?.filter(cat => cat.type === type)
                                                    ?.map((category) => (
                                                    <div
                                                        key={category.id}
                                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                            data.behavior_category_id === category.id.toString()
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : getCategoryColor(category.type)
                                                        }`}
                                                        onClick={() => handleCategoryChange(category.id.toString())}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            {getCategoryIcon(category.type)}
                                                            <span className="font-medium">{category.name}</span>
                                                        </div>
                                                        {category.description && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {category.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.behavior_category_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.behavior_category_id}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="severity">Tingkat Keparahan</Label>
                                <Select
                                    value={data.severity}
                                    onValueChange={(value) => setData('severity', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Rendah</SelectItem>
                                        <SelectItem value="medium">Sedang</SelectItem>
                                        <SelectItem value="high">Tinggi</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.severity && (
                                    <p className="text-red-500 text-sm mt-1">{errors.severity}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">Deskripsi Detail *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Jelaskan secara detail apa yang terjadi, konteks, dan hal-hal penting lainnya..."
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="witnesses">Saksi (jika ada)</Label>
                                <Textarea
                                    id="witnesses"
                                    value={data.witnesses}
                                    onChange={(e) => setData('witnesses', e.target.value)}
                                    placeholder="Nama saksi yang melihat kejadian..."
                                    rows={2}
                                />
                                {errors.witnesses && (
                                    <p className="text-red-500 text-sm mt-1">{errors.witnesses}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Taken */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tindakan yang Diambil</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="action_taken">Tindakan yang Dilakukan</Label>
                                <Textarea
                                    id="action_taken"
                                    value={data.action_taken}
                                    onChange={(e) => setData('action_taken', e.target.value)}
                                    placeholder="Jelaskan tindakan yang sudah dilakukan terhadap siswa..."
                                    rows={3}
                                />
                                {errors.action_taken && (
                                    <p className="text-red-500 text-sm mt-1">{errors.action_taken}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="parent_notified"
                                        checked={data.parent_notified}
                                        onChange={(e) => setData('parent_notified', e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor="parent_notified">Orang tua sudah diberitahu</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="follow_up_required"
                                        checked={data.follow_up_required}
                                        onChange={(e) => setData('follow_up_required', e.target.checked)}
                                        className="rounded"
                                    />
                                    <Label htmlFor="follow_up_required">Perlu tindak lanjut</Label>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">Catatan Tambahan</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Catatan atau informasi tambahan yang relevan..."
                                    rows={3}
                                />
                                {errors.notes && (
                                    <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview Selected Category */}
                    {selectedCategory && (
                        <Alert className={getCategoryColor(selectedCategory.type)}>
                            <div className="flex items-center">
                                {getCategoryIcon(selectedCategory.type)}
                                <AlertDescription className="ml-2">
                                    <strong>Kategori dipilih:</strong> {selectedCategory.name}
                                    {selectedCategory.description && (
                                        <span className="block text-sm mt-1">{selectedCategory.description}</span>
                                    )}
                                </AlertDescription>
                            </div>
                        </Alert>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-between">
                        <Link href="/behavior-reports">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Laporan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}