import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Users,
    MessageSquare,
    Send,
    Search,
    User,
    Clock,
    Phone,
    Mail,
    Plus,
    Eye,
    Calendar,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface Props {
    communications: any[];
    students_with_parents: any[];
    recent_activities: any[];
    stats: {
        total_parents: number;
        active_communications: number;
        pending_responses: number;
        messages_this_month: number;
    };
}

const ParentCommunicationIndex: React.FC<Props> = ({ 
    communications, 
    students_with_parents, 
    recent_activities, 
    stats 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <AppLayout>
            <Head title="Parent Communication" />

            <div className="space-y-6 px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Komunikasi Orang Tua</h1>
                        <p className="text-muted-foreground mt-1">
                            Terhubung dan berkomunikasi dengan orang tua tentang kemajuan siswa
                        </p>
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Komunikasi Baru
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Parents</p>
                                    <p className="text-2xl font-bold ">{stats.total_parents}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <MessageSquare className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Active Communications</p>
                                    <p className="text-2xl font-bold ">{stats.active_communications}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <AlertCircle className="h-8 w-8 text-orange-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Pending Responses</p>
                                    <p className="text-2xl font-bold ">{stats.pending_responses}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                                    <p className="text-2xl font-bold ">{stats.messages_this_month}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'dashboard'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('parents')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'parents'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Parent Directory
                        </button>
                        <button
                            onClick={() => setActiveTab('communications')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'communications'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Recent Communications
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Activities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Recent Activities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recent_activities.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Clock className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">No recent activities</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recent_activities.map((activity, index) => (
                                                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <MessageSquare className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{activity.title}</p>
                                                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Common communication tasks</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button className="w-full justify-start" variant="outline">
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Class Announcement
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <Users className="w-4 h-4 mr-2" />
                                        Schedule Parent Meeting
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Send Individual Message
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Create Event Notification
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'parents' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Parent Directory
                                </CardTitle>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search parents or students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {students_with_parents.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No parent contacts</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Parent contact information will appear here once available.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {students_with_parents.map((student, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <User className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-sm">{student.name}</h3>
                                                            <p className="text-xs text-gray-600">Student</p>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="outline">
                                                        <MessageSquare className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <div className="mt-3 space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <User className="w-3 h-3" />
                                                        {student.parent_name}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Phone className="w-3 h-3" />
                                                        {student.parent_phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Mail className="w-3 h-3" />
                                                        {student.parent_email}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'communications' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Recent Communications
                                </CardTitle>
                                <CardDescription>
                                    View and manage your communications with parents
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {communications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No communications yet</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Start communicating with parents about student progress.
                                        </p>
                                        <div className="mt-6">
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                New Communication
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {communications.map((comm, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-medium">{comm.subject}</h3>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                comm.status === 'sent' ? 'bg-green-100 text-green-800' :
                                                                comm.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {comm.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">{comm.excerpt}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>To: {comm.recipient}</span>
                                                            <span>•</span>
                                                            <span>{comm.sent_at}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <MessageSquare className="w-3 h-3" />
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

export default ParentCommunicationIndex;