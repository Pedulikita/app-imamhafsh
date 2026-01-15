import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Users,
    Calendar,
    Download,
    Filter,
    Eye,
    FileText,
    Award,
    Clock
} from 'lucide-react';

interface Props {
    reports: any[];
    student_progress: any[];
    class_analytics: any[];
    performance_metrics: {
        total_students: number;
        avg_attendance: number;
        avg_grade: number;
        improvement_rate: number;
    };
    charts_data: {
        attendance_trend: any[];
        grade_distribution: any[];
        subject_performance: any[];
    };
}

const TeacherReportsIndex: React.FC<Props> = ({ 
    reports, 
    student_progress, 
    class_analytics, 
    performance_metrics,
    charts_data
}) => {
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <AppLayout>
            <Head title="Progress Reports & Analytics" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Progress Reports & Analytics</h1>
                        <p className="text-gray-600 mt-1">
                            Monitor student performance and generate comprehensive reports
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                        <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-900">{performance_metrics.total_students}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="mt-2 flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-green-600">+5% from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                                    <p className="text-2xl font-bold text-gray-900">{performance_metrics.avg_attendance}%</p>
                                </div>
                                <Clock className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="mt-2 flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-green-600">+2% from last week</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                                    <p className="text-2xl font-bold text-gray-900">{performance_metrics.avg_grade}</p>
                                </div>
                                <Award className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="mt-2 flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-green-600">+0.3 from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Improvement Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">{performance_metrics.improvement_rate}%</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="mt-2 flex items-center text-sm">
                                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                <span className="text-red-600">-1% from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Period Selector */}
                <div className="flex gap-2">
                    {['weekly', 'monthly', 'quarterly', 'yearly'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                selectedPeriod === period
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { key: 'overview', label: 'Overview', icon: BarChart3 },
                            { key: 'student-progress', label: 'Student Progress', icon: TrendingUp },
                            { key: 'analytics', label: 'Class Analytics', icon: PieChart },
                            { key: 'reports', label: 'Generated Reports', icon: FileText }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                    activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Performance Chart Placeholder */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5" />
                                        Performance Trends
                                    </CardTitle>
                                    <CardDescription>Student performance over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">Performance chart will display here</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subject Performance */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="w-5 h-5" />
                                        Subject Performance
                                    </CardTitle>
                                    <CardDescription>Performance breakdown by subject</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <PieChart className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">Subject chart will display here</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'student-progress' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Individual Student Progress
                                </CardTitle>
                                <CardDescription>Detailed progress tracking for each student</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {student_progress.length === 0 ? (
                                    <div className="text-center py-12">
                                        <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No progress data</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Student progress data will appear here once available.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {student_progress.map((student, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-medium">{student.name}</h3>
                                                        <p className="text-sm text-gray-600">{student.class}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Download className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Attendance Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <Clock className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">Attendance analytics chart</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Grade Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">Grade distribution chart</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Generated Reports
                                </CardTitle>
                                <CardDescription>Previously generated and saved reports</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {reports.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No reports generated</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Generated reports will appear here for download and review.
                                        </p>
                                        <div className="mt-6">
                                            <Button>
                                                <FileText className="w-4 h-4 mr-2" />
                                                Generate Report
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reports.map((report, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-medium">{report.title}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            Generated: {report.created_at}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Download className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default TeacherReportsIndex;