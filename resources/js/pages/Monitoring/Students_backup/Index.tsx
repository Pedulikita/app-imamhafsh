import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Search, 
    Plus, 
    Users, 
    Filter,
    Eye,
    Edit,
    Trash2,
    Download,
    Upload,
    TrendingUp
} from 'lucide-react';

interface Student {
    id: number;
    student_id: string;
    name: string;
    email?: string;
    class: string;
    status: 'active' | 'inactive' | 'graduated' | 'transferred';
    academic_year: number;
    photo?: string;
    created_at: string;
}

interface PaginationData {
    data?: Student[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
}

interface StudentsIndexProps {
    students?: PaginationData;
    classes?: string[];
    statuses?: string[];
    filters?: {
        search?: string;
        class?: string;
        status?: string;
    };
}

export default function Index({ 
    students = { data: [], current_page: 1, last_page: 1, per_page: 20, total: 0 }, 
    classes = [], 
    statuses = [], 
    filters = {} 
}: StudentsIndexProps) {
    // Safe array conversion functions
    const safeArray = (data: any): any[] => {
        if (Array.isArray(data)) return data;
        if (data && typeof data === 'object' && data.length !== undefined) {
            return Array.from(data);
        }
        return [];
    };
    
    const safeClasses = safeArray(classes);
    const safeStatuses = safeArray(statuses);
    const safeStudentData = safeArray(students?.data);
    
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedClass, setSelectedClass] = useState(filters?.class || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleSearch = () => {
        router.get('/monitoring/students', {
            search: searchTerm,
            class: selectedClass,
            status: selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedClass('');
        setSelectedStatus('');
        router.get('/monitoring/students', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadgeProps = (status: string) => {
        switch (status) {
            case 'active':
                return { variant: 'default' as const, className: 'bg-green-500' };
            case 'inactive':
                return { variant: 'secondary' as const };
            case 'graduated':
                return { variant: 'default' as const, className: 'bg-blue-500' };
            case 'transferred':
                return { variant: 'destructive' as const };
            default:
                return { variant: 'outline' as const };
        }
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            active: 'Aktif',
            inactive: 'Tidak Aktif',
            graduated: 'Lulus',
            transferred: 'Pindah',
        };
        return statusMap[status] || status;
    };

    return (
        <AppLayout>
            <Head title="Daftar Siswa - Monitoring" />
            
            <div className="space-y-8 px-6 py-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold ">
                            Daftar Siswa
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Kelola dan monitor data siswa secara komprehensif
                        </p>
                    </div>
                    <div className="mt-4 lg:mt-0 flex gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Import
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                        <Button asChild className="flex items-center gap-2">
                            <Link href="/monitoring/students/create">
                                <Plus className="w-4 h-4" />
                                Tambah Siswa
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Cari nama, NIS, atau email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-muted-foreground"
                            >
                                <option value="">Semua Kelas</option>
                                {safeClasses.map((cls) => (
                                    <option key={cls} value={cls}>
                                        {cls}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-muted-foreground"
                            >
                                <option value="">Semua Status</option>
                                {safeStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {getStatusText(status)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <Button onClick={handleSearch} className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Terapkan Filter
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Siswa</p>
                                <p className="text-2xl font-bold">
                                    {students?.total || 0}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Siswa Aktif</p>
                                <p className="text-2xl font-bold">
                                    {safeStudentData.filter(s => s.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Users className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Kelas</p>
                                <p className="text-2xl font-bold">
                                    {safeClasses.length}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Lulusan</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {safeStudentData.filter(s => s.status === 'graduated').length}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Students Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Siswa
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        NIS
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Kelas
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Tahun Akademik
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {safeStudentData.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {student.photo ? (
                                                        <img 
                                                            className="h-10 w-10 rounded-full object-cover" 
                                                            src={`/storage/${student.photo}`} 
                                                            alt={student.name} 
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                            <Users className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-sm text-slate-500">
                                                        {student.email || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {student.student_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {student.class}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge {...getStatusBadgeProps(student.status)}>
                                                {getStatusText(student.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {student.academic_year}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                    title="Lihat Detail"
                                                >
                                                    <Link href={`/monitoring/students/${student.id}`}>
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:border-green-300"
                                                    asChild
                                                    title="Lihat Progress"
                                                >
                                                    <Link href={`/monitoring/students/${student.id}/progress`}>
                                                        <TrendingUp className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    asChild
                                                    title="Edit Data"
                                                >
                                                    <Link href={`/monitoring/students/${student.id}/edit`}>
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700"
                                                    title="Hapus Data"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {(students?.last_page || 0) > 1 && (
                        <div className="px-6 py-4 border-t">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-700">
                                    Menampilkan {(((students?.current_page || 1) - 1) * (students?.per_page || 20)) + 1} sampai{' '}
                                    {Math.min((students?.current_page || 1) * (students?.per_page || 20), students?.total || 0)} dari{' '}
                                    {students?.total || 0} siswa
                                </div>
                                <div className="flex gap-2">
                                    {(students?.current_page || 1) > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`/monitoring/students?page=${(students?.current_page || 1) - 1}`)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {(students?.current_page || 1) < (students?.last_page || 1) && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`/monitoring/students?page=${(students?.current_page || 1) + 1}`)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}