import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
    ClipboardCheck, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Eye,
    Edit,
    Trash2,
    Calendar,
    User,
    AlertTriangle,
    CheckCircle,
    Clock,
    BarChart3
} from 'lucide-react';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Student {
    id: number;
    name: string;
    class: string;
    avatar?: string;
}

interface BehaviorCategory {
    id: number;
    name: string;
    type: 'positive' | 'negative' | 'neutral';
    description?: string;
}

interface BehaviorReport {
    id: number;
    student: Student;
    category: BehaviorCategory;
    incident_date: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    status: 'pending' | 'reviewed' | 'resolved';
    teacher_name: string;
    created_at: string;
}

interface Props {
    behavior_reports: {
        data: BehaviorReport[];
        links: any[];
        meta: any;
    };
    behavior_categories: BehaviorCategory[];
    filters: {
        search?: string;
        status?: string;
        category?: string;
        severity?: string;
        date_from?: string;
        date_to?: string;
    };
    stats: {
        total: number;
        pending: number;
        reviewed: number;
        resolved: number;
        positive: number;
        negative: number;
        neutral: number;
    };
}

export default function Index({ behavior_reports, behavior_categories, filters, stats }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || 'all');
    const [selectedSeverity, setSelectedSeverity] = useState(filters?.severity || 'all');

    const handleFilter = () => {
        const params = {
            search: searchTerm || undefined,
            status: selectedStatus && selectedStatus !== 'all' ? selectedStatus : undefined,
            category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
            severity: selectedSeverity && selectedSeverity !== 'all' ? selectedSeverity : undefined,
        };

        router.get('/behavior-reports', params, {
            preserveState: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this behavior report?')) {
            router.delete(`/behavior-reports/${id}`);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            case 'reviewed':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (type: string) => {
        switch (type) {
            case 'positive':
                return 'bg-green-100 text-green-800';
            case 'negative':
                return 'bg-red-100 text-red-800';
            case 'neutral':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <ClipboardCheck className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Laporan Perilaku Siswa
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Kelola dan pantau laporan perilaku siswa
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link href="/behavior-reports/analytics">
                            <Button variant="outline" size="sm">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Analytics
                            </Button>
                        </Link>
                        <Link href="/behavior-reports/create">
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Buat Laporan
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Laporan Perilaku Siswa" />

            <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
                            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats?.pending || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Perilaku Positif</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats?.positive || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats?.negative || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <div>
                                <Input
                                    placeholder="Cari siswa atau deskripsi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {behavior_categories?.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    )) || []}
                                </SelectContent>
                            </Select>
                            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tingkat</SelectItem>
                                    <SelectItem value="low">Rendah</SelectItem>
                                    <SelectItem value="medium">Sedang</SelectItem>
                                    <SelectItem value="high">Tinggi</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter} className="w-full">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports List */}
                <div className="grid gap-4">
                    {behavior_reports?.data?.length > 0 ? (
                        behavior_reports?.data?.map((report) => (
                            <Card key={report.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-12 w-12">
                                                {report.student.avatar ? (
                                                    <AvatarImage src={report.student.avatar} />
                                                ) : (
                                                    <AvatarFallback>
                                                        <User className="h-6 w-6" />
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div>
                                                <h3 className="text-lg font-semibold">{report.student.name}</h3>
                                                <p className="text-sm text-gray-500">{report.student.class}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className={getCategoryColor(report.category.type)}>
                                                {report.category.name}
                                            </Badge>
                                            <Badge className={getSeverityColor(report.severity)}>
                                                {report.severity.toUpperCase()}
                                            </Badge>
                                            <Badge className={getStatusColor(report.status)}>
                                                {report.status.toUpperCase()}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link href={`/behavior-reports/${report.id}`}>
                                                        <DropdownMenuItem>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Detail
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <Link href={`/behavior-reports/${report.id}/edit`}>
                                                        <DropdownMenuItem>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDelete(report.id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                                        {report.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {new Date(report.incident_date).toLocaleDateString('id-ID')}
                                            </div>
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 mr-1" />
                                                {report.teacher_name}
                                            </div>
                                        </div>
                                        <span>
                                            {new Date(report.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <ClipboardCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        Belum ada laporan perilaku
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        Mulai buat laporan perilaku siswa untuk memantau perkembangan mereka.
                                    </p>
                                    <Link href="/behavior-reports/create">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Buat Laporan Pertama
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {behavior_reports?.meta?.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Menampilkan {behavior_reports?.meta?.from || 0} - {behavior_reports?.meta?.to || 0} dari {behavior_reports?.meta?.total || 0} laporan
                        </div>
                        <div className="flex items-center space-x-2">
                            {behavior_reports?.links?.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}