import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
    ClipboardCheck, 
    ArrowLeft, 
    Edit,
    Calendar,
    MapPin,
    User,
    Eye,
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    Users,
    MessageSquare,
    CheckSquare,
    AlertCircle,
    Trash2,
    Download
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface BehaviorReportAction {
    id: number;
    action_type: string;
    description: string;
    taken_by: string;
    taken_at: string;
}

interface BehaviorReport {
    id: number;
    student: Student;
    category: BehaviorCategory;
    incident_date: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    status: 'pending' | 'reviewed' | 'resolved';
    location?: string;
    witnesses?: string;
    action_taken?: string;
    parent_notified: boolean;
    follow_up_required: boolean;
    notes?: string;
    teacher_name: string;
    reviewer_name?: string;
    reviewed_at?: string;
    resolution_notes?: string;
    created_at: string;
    updated_at: string;
    actions: BehaviorReportAction[];
}

interface Props {
    behavior_report: BehaviorReport;
    can_edit: boolean;
    can_delete: boolean;
}

export default function Show({ behavior_report, can_edit, can_delete }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this behavior report? This action cannot be undone.')) {
            router.delete(`/teacher/behavior-reports/${behavior_report.id}`, {
                onSuccess: () => {
                    router.get('/teacher/behavior-reports');
                }
            });
        }
    };

    const handleUpdateStatus = (status: string) => {
        router.patch(`/behavior-reports/${behavior_report.id}/status`, { status });
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

    const getCategoryIcon = (type: string) => {
        switch (type) {
            case 'positive':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'negative':
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'neutral':
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-orange-500" />;
            case 'reviewed':
                return <Eye className="h-5 w-5 text-blue-500" />;
            case 'resolved':
                return <CheckSquare className="h-5 w-5 text-green-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

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
                        <ClipboardCheck className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                Detail Laporan Perilaku
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: #{behavior_report.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {can_edit && (
                            <Link href={`/behavior-reports/${behavior_report.id}/edit`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF
                        </Button>
                        {can_delete && (
                            <Button variant="destructive" size="sm" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Laporan Perilaku - ${behavior_report.student.name}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Status Update Actions */}
                {behavior_report.status !== 'resolved' && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {getStatusIcon(behavior_report.status)}
                                    <div>
                                        <h3 className="font-medium">Status Actions</h3>
                                        <p className="text-sm text-gray-600">Update status laporan ini</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {behavior_report.status === 'pending' && (
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleUpdateStatus('reviewed')}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Mark as Reviewed
                                        </Button>
                                    )}
                                    {behavior_report.status === 'reviewed' && (
                                        <Button 
                                            size="sm"
                                            onClick={() => handleUpdateStatus('resolved')}
                                        >
                                            <CheckSquare className="h-4 w-4 mr-2" />
                                            Mark as Resolved
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Student Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Informasi Siswa
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                {behavior_report.student.avatar ? (
                                    <AvatarImage src={behavior_report.student.avatar} />
                                ) : (
                                    <AvatarFallback>
                                        <User className="h-8 w-8" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <h3 className="text-xl font-semibold">{behavior_report.student.name}</h3>
                                <p className="text-gray-600">{behavior_report.student.class}</p>
                                <p className="text-sm text-gray-500">ID: {behavior_report.student.id}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ClipboardCheck className="h-5 w-5 mr-2" />
                                Overview Laporan
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge className={getCategoryColor(behavior_report.category.type)}>
                                    {getCategoryIcon(behavior_report.category.type)}
                                    <span className="ml-1">{behavior_report.category.name}</span>
                                </Badge>
                                <Badge className={getSeverityColor(behavior_report.severity)}>
                                    {behavior_report.severity.toUpperCase()}
                                </Badge>
                                <Badge className={getStatusColor(behavior_report.status)}>
                                    {getStatusIcon(behavior_report.status)}
                                    <span className="ml-1">{behavior_report.status.toUpperCase()}</span>
                                </Badge>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Tanggal Kejadian:</span>
                                <span className="font-medium">
                                    {new Date(behavior_report.incident_date).toLocaleDateString('id-ID')}
                                </span>
                            </div>
                            {behavior_report.location && (
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Lokasi:</span>
                                    <span className="font-medium">{behavior_report.location}</span>
                                </div>
                            )}
                            <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Dilaporkan oleh:</span>
                                <span className="font-medium">{behavior_report.teacher_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Dibuat:</span>
                                <span className="font-medium">
                                    {new Date(behavior_report.created_at).toLocaleDateString('id-ID')}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="font-medium mb-2 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Deskripsi Kejadian
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {behavior_report.description}
                            </p>
                        </div>

                        {behavior_report.witnesses && (
                            <div>
                                <h4 className="font-medium mb-2 flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Saksi
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {behavior_report.witnesses}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Taken */}
                {behavior_report.action_taken && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CheckSquare className="h-5 w-5 mr-2" />
                                Tindakan yang Diambil
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {behavior_report.action_taken}
                            </p>
                            
                            <div className="grid gap-4 md:grid-cols-2 mt-4 pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Orang tua diberitahu:</span>
                                    <Badge variant={behavior_report.parent_notified ? 'default' : 'secondary'}>
                                        {behavior_report.parent_notified ? 'Ya' : 'Belum'}
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Perlu tindak lanjut:</span>
                                    <Badge variant={behavior_report.follow_up_required ? 'destructive' : 'secondary'}>
                                        {behavior_report.follow_up_required ? 'Ya' : 'Tidak'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Review Information */}
                {behavior_report.reviewed_at && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Eye className="h-5 w-5 mr-2" />
                                Informasi Review
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Direview oleh:</span>
                                    <span className="font-medium">{behavior_report.reviewer_name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Tanggal review:</span>
                                    <span className="font-medium">
                                        {new Date(behavior_report.reviewed_at).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                            </div>
                            {behavior_report.resolution_notes && (
                                <div>
                                    <h4 className="font-medium mb-2">Catatan Resolusi</h4>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {behavior_report.resolution_notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Additional Notes */}
                {behavior_report.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Catatan Tambahan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {behavior_report.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Action History */}
                {behavior_report.actions && behavior_report.actions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="h-5 w-5 mr-2" />
                                Riwayat Tindakan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {behavior_report.actions.map((action, index) => (
                                    <div key={action.id} className="flex space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 text-sm font-medium">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {action.action_type}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(action.taken_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1">
                                                {action.description}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Oleh: {action.taken_by}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Follow-up Alert */}
                {behavior_report.follow_up_required && behavior_report.status !== 'resolved' && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                            <strong>Perhatian:</strong> Laporan ini memerlukan tindak lanjut. 
                            Pastikan untuk mengambil langkah-langkah yang diperlukan dan memperbarui status laporan.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </AppLayout>
    );
}