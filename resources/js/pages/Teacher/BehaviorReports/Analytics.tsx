import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    BarChart3, 
    ArrowLeft, 
    TrendingUp,
    TrendingDown,
    Users,
    ClipboardCheck,
    Calendar,
    Filter,
    Download,
    AlertTriangle,
    CheckCircle,
    Clock,
    Minus,
    PieChart,
    Activity
} from 'lucide-react';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AnalyticsData {
    total_reports: number;
    pending_reports: number;
    reviewed_reports: number;
    resolved_reports: number;
    positive_behaviors: number;
    negative_behaviors: number;
    neutral_behaviors: number;
    high_severity: number;
    medium_severity: number;
    low_severity: number;
    this_month_reports: number;
    last_month_reports: number;
    trend_percentage: number;
    top_categories: Array<{
        name: string;
        count: number;
        type: 'positive' | 'negative' | 'neutral';
    }>;
    monthly_trends: Array<{
        month: string;
        positive: number;
        negative: number;
        neutral: number;
        total: number;
    }>;
    class_statistics: Array<{
        class_name: string;
        total_reports: number;
        positive_percentage: number;
        negative_percentage: number;
        average_severity: string;
    }>;
    recent_reports: Array<{
        id: number;
        student_name: string;
        class_name: string;
        category_name: string;
        category_type: string;
        severity: string;
        status: string;
        incident_date: string;
    }>;
}

interface Props {
    analytics?: AnalyticsData;
    date_range: string;
    selected_class?: string;
    classes: Array<{ id: number; name: string; }>;
}

export default function Analytics({ analytics, date_range, selected_class, classes }: Props) {
    const [selectedDateRange, setSelectedDateRange] = useState(date_range || 'this_month');
    const [selectedClassFilter, setSelectedClassFilter] = useState(selected_class || 'all');

    const handleFilterChange = () => {
        const params = new URLSearchParams();
        if (selectedDateRange) params.append('date_range', selectedDateRange);
        if (selectedClassFilter && selectedClassFilter !== 'all') params.append('class', selectedClassFilter);
        
        window.location.href = `/behavior-reports/analytics?${params.toString()}`;
    };

    const getTrendIcon = () => {
        if ((analytics?.trend_percentage || 0) > 0) {
            return <TrendingUp className="h-4 w-4 text-red-500" />;
        } else if ((analytics?.trend_percentage || 0) < 0) {
            return <TrendingDown className="h-4 w-4 text-green-500" />;
        }
        return <Minus className="h-4 w-4 text-gray-500" />;
    };

    const getTrendColor = () => {
        if ((analytics?.trend_percentage || 0) > 0) {
            return 'text-red-600';
        } else if ((analytics?.trend_percentage || 0) < 0) {
            return 'text-green-600';
        }
        return 'text-gray-600';
    };

    const getCategoryColor = (type: string) => {
        switch (type) {
            case 'positive':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'negative':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'neutral':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'reviewed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'resolved':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Loading state when analytics data is not available
    if (!analytics) {
        return (
            <AppLayout
                header={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/behavior-reports">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                            <h2 className="text-xl font-semibold">Analytics Laporan Perilaku</h2>
                        </div>
                    </div>
                }
            >
                <Head title="Analytics Laporan Perilaku" />
                <div className="max-w-7xl mx-auto space-y-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-muted-foreground">Memuat data analytics...</div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/behavior-reports">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Analytics Perilaku Siswa
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Analisis dan tren laporan perilaku siswa
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            }
        >
            <Head title="Analytics Perilaku Siswa" />

            <div className="space-y-6">
                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Periode waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="this_week">Minggu Ini</SelectItem>
                                    <SelectItem value="this_month">Bulan Ini</SelectItem>
                                    <SelectItem value="last_month">Bulan Lalu</SelectItem>
                                    <SelectItem value="this_quarter">Kuartal Ini</SelectItem>
                                    <SelectItem value="this_year">Tahun Ini</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    {classes?.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>
                                            {cls.name}
                                        </SelectItem>
                                    )) || []}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilterChange}>
                                <Filter className="h-4 w-4 mr-2" />
                                Apply Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
                            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics?.total_reports || 0}</div>
                            <div className={`text-xs ${getTrendColor()} flex items-center`}>
                                {getTrendIcon()}
                                <span className="ml-1">
                                    {Math.abs(analytics?.trend_percentage || 0)}% dari bulan lalu
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Perilaku Positif</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {analytics?.positive_behaviors || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {(analytics?.total_reports || 0) > 0 
                                    ? Math.round(((analytics?.positive_behaviors || 0) / (analytics?.total_reports || 1)) * 100)
                                    : 0
                                }% dari total laporan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {analytics?.negative_behaviors || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {(analytics?.total_reports || 0) > 0 
                                    ? Math.round(((analytics?.negative_behaviors || 0) / (analytics?.total_reports || 1)) * 100)
                                    : 0
                                }% dari total laporan
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {analytics?.pending_reports || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Perlu ditinjau segera
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Severity Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <PieChart className="h-5 w-5 mr-2" />
                            Distribusi Tingkat Keparahan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">{analytics?.high_severity || 0}</div>
                                <Badge className={getSeverityColor('high')}>Tinggi</Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(analytics?.total_reports || 0) > 0 
                                        ? Math.round(((analytics?.high_severity || 0) / (analytics?.total_reports || 1)) * 100)
                                        : 0
                                    }%
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">{analytics?.medium_severity || 0}</div>
                                <Badge className={getSeverityColor('medium')}>Sedang</Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(analytics?.total_reports || 0) > 0 
                                        ? Math.round(((analytics?.medium_severity || 0) / (analytics?.total_reports || 1)) * 100)
                                        : 0
                                    }%
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{analytics?.low_severity || 0}</div>
                                <Badge className={getSeverityColor('low')}>Rendah</Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(analytics?.total_reports || 0) > 0 
                                        ? Math.round(((analytics?.low_severity || 0) / (analytics?.total_reports || 1)) * 100)
                                        : 0
                                    }%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Categories */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Activity className="h-5 w-5 mr-2" />
                            Kategori Perilaku Teratas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {(analytics?.top_categories || []).map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{category.name}</p>
                                            <Badge className={getCategoryColor(category.type)} variant="outline">
                                                {category.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">{category.count}</div>
                                        <div className="text-xs text-muted-foreground">laporan</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Class Statistics */}
                {(analytics?.class_statistics?.length || 0) > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                Statistik per Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2">Kelas</th>
                                            <th className="text-center py-2">Total Laporan</th>
                                            <th className="text-center py-2">Positif</th>
                                            <th className="text-center py-2">Negatif</th>
                                            <th className="text-center py-2">Rata-rata Keparahan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(analytics?.class_statistics || []).map((classStats, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="py-2 font-medium">{classStats.class_name}</td>
                                                <td className="text-center py-2">{classStats.total_reports}</td>
                                                <td className="text-center py-2">
                                                    <span className="text-green-600 font-medium">
                                                        {Math.round(classStats.positive_percentage)}%
                                                    </span>
                                                </td>
                                                <td className="text-center py-2">
                                                    <span className="text-red-600 font-medium">
                                                        {Math.round(classStats.negative_percentage)}%
                                                    </span>
                                                </td>
                                                <td className="text-center py-2">
                                                    <Badge className={getSeverityColor(classStats.average_severity)}>
                                                        {classStats.average_severity}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Monthly Trends */}
                {(analytics?.monthly_trends?.length || 0) > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2" />
                                Tren Bulanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {(analytics?.monthly_trends || []).map((trend, index) => (
                                    <div key={index} className="grid gap-4 md:grid-cols-5 items-center">
                                        <div className="font-medium">{trend.month}</div>
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-green-600">{trend.positive}</div>
                                            <div className="text-xs text-muted-foreground">Positif</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-red-600">{trend.negative}</div>
                                            <div className="text-xs text-muted-foreground">Negatif</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-gray-600">{trend.neutral}</div>
                                            <div className="text-xs text-muted-foreground">Netral</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold">{trend.total}</div>
                                            <div className="text-xs text-muted-foreground">Total</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Reports */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 mr-2" />
                                Laporan Terbaru
                            </div>
                            <Link href="/behavior-reports">
                                <Button variant="outline" size="sm">
                                    Lihat Semua
                                </Button>
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(analytics?.recent_reports?.length || 0) > 0 ? (
                            <div className="space-y-3">
                                {(analytics?.recent_reports || []).slice(0, 5).map((report) => (
                                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{report.student_name}</span>
                                                <span className="text-gray-500">({report.class_name})</span>
                                                <Badge className={getCategoryColor(report.category_type)}>
                                                    {report.category_name}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(report.incident_date).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className={getSeverityColor(report.severity)}>
                                                {report.severity}
                                            </Badge>
                                            <Badge className={getStatusColor(report.status)}>
                                                {report.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">
                                Belum ada laporan untuk periode ini.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}