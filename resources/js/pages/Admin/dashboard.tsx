import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    FileText, 
    GraduationCap, 
    Settings, 
    TrendingUp, 
    TrendingDown,
    Eye,
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Activity,
    Database,
    HardDrive,
    Zap,
    GitBranch
} from 'lucide-react';

interface DashboardProps {
    user: any;
    stats: {
        users: {
            total: number;
            teachers: number;
            students: number;
            editors: number;
        };
        content: {
            articles: number;
            published_articles: number;
            draft_articles: number;
            pending_articles: number;
        };
        education: {
            subjects: number;
            teacher_profiles: number;
            active_classes: number;
            total_grades: number;
        };
        system: {
            roles: number;
            recent_logins: number;
            social_users: number;
        };
    };
    recentActivities: Array<{
        id: number;
        type: string;
        title: string;
        description: string;
        time: string;
        status: string;
        icon: string;
    }>;
    chartData: any;
}

export default function AdminDashboard({ user, stats, recentActivities, chartData }: DashboardProps) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'published': { variant: 'default', color: 'bg-green-100 text-green-800' },
            'draft': { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
            'pending': { variant: 'outline', color: 'bg-blue-100 text-blue-800' },
            'verified': { variant: 'default', color: 'bg-green-100 text-green-800' },
            'active': { variant: 'default', color: 'bg-green-100 text-green-800' },
        } as const;

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
        
        return (
            <Badge className={config.color}>
                {status}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin/dashboard' },
        ]}>
            <Head title="Admin Dashboard - Imam Hafsh Islamic Boarding School" />

            <div className="min-h-screen ">
                {/* Header */}
                
                    <div className="px-6 mx-auto sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                                <p className="text-muted-foreground text-sm mt-1">Selamat datang kembali, {user.name}</p>
                            </div>
                            <div className="flex space-x-3">
                                <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Site
                                </Button>
                                <Button size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                            </div>
                        </div>
                    </div>
                {/* Main Content */}

                <div className="mx-auto px-6 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Users Stats */}
                        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600  text-white border-0 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Users</p>
                                    <p className="text-3xl font-bold">{stats.users.total}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-200" />
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span className="text-blue-100">
                                    Teachers: {stats.users.teachers} | Students: {stats.users.students}
                                </span>
                            </div>
                        </Card>

                        {/* Content Stats */}
                        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Articles</p>
                                    <p className="text-3xl font-bold">{stats.content.articles}</p>
                                </div>
                                <FileText className="w-8 h-8 text-green-200" />
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-green-100">
                                    Published: {stats.content.published_articles}
                                </span>
                            </div>
                        </Card>

                        {/* Education Stats */}
                        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Classes</p>
                                    <p className="text-3xl font-bold">{stats.education.active_classes}</p>
                                </div>
                                <GraduationCap className="w-8 h-8 text-purple-200" />
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <Activity className="w-4 h-4 mr-1" />
                                <span className="text-purple-100">
                                    Subjects: {stats.education.subjects}
                                </span>
                            </div>
                        </Card>

                        {/* System Stats */}
                        <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm font-medium">Social Users</p>
                                    <p className="text-3xl font-bold">{stats.system.social_users}</p>
                                </div>
                                <Zap className="w-8 h-8 text-orange-200" />
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="text-orange-100">
                                    Recent logins: {stats.system.recent_logins}
                                </span>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activities */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold ">Recent Activities</h2>
                                <Button variant="outline" size="sm">
                                    View All
                                </Button>
                            </div>
                            
                            <div className="space-y-4">
                                {recentActivities.slice(0, 6).map((activity, index) => (
                                    <div key={activity.id || index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50/50 transition-colors">
                                        <div className="text-2xl">{activity.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium  truncate">
                                                {activity.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {activity.description}
                                            </p>
                                            <div className="flex items-center mt-2 space-x-2">
                                                {getStatusBadge(activity.status)}
                                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Quick Actions & System Health */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button className="h-20 flex-col space-y-2">
                                        <Users className="w-6 h-6" />
                                        <span>Manage Users</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col space-y-2">
                                        <FileText className="w-6 h-6" />
                                        <span>New Article</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col space-y-2">
                                        <GraduationCap className="w-6 h-6" />
                                        <span>Add Teacher</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col space-y-2">
                                        <Settings className="w-6 h-6" />
                                        <span>System Settings</span>
                                    </Button>
                                </div>
                            </Card>

                            {/* System Health */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-6">System Health</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Database className="w-5 h-5 text-green-500" />
                                            <span className="text-sm font-medium">Database</span>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <HardDrive className="w-5 h-5 text-green-500" />
                                            <span className="text-sm font-medium">Storage</span>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">OK</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Zap className="w-5 h-5 text-yellow-500" />
                                            <span className="text-sm font-medium">Cache</span>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <GitBranch className="w-5 h-5 text-green-500" />
                                            <span className="text-sm font-medium">Migrations</span>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">Updated</Badge>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold  mb-4">Content Overview</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Published Articles</span>
                                    <span className="font-semibold text-green-600">{stats.content.published_articles}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Draft Articles</span>
                                    <span className="font-semibold text-yellow-600">{stats.content.draft_articles}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Pending Review</span>
                                    <span className="font-semibold text-blue-600">{stats.content.pending_articles}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold  mb-4">Education Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Teacher Profiles</span>
                                    <span className="font-semibold">{stats.education.teacher_profiles}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Subjects</span>
                                    <span className="font-semibold">{stats.education.subjects}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Grades</span>
                                    <span className="font-semibold">{stats.education.total_grades}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">User Roles</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Teachers</span>
                                    <span className="font-semibold">{stats.users.teachers}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Editors</span>
                                    <span className="font-semibold">{stats.users.editors}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Students</span>
                                    <span className="font-semibold">{stats.users.students}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}