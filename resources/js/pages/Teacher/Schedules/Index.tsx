import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    Filter, 
    Calendar, 
    Clock,
    MapPin,
    Users,
    BookOpen,
    Plus,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';

interface Schedule {
    id: number;
    subject: string;
    class: string;
    classroom: string;
    time_range: string;
    start_time: string;
    end_time: string;
    notes?: string;
}

interface Props {
    weekly_schedule: Record<string, Schedule[]>;
    today_schedule: Schedule[];
    next_class: Schedule | null;
    current_day: string;
    statistics: {
        total_classes_this_week: number;
        classes_today: number;
        unique_subjects: number;
        unique_classrooms: number;
    };
}

const ScheduleIndex: React.FC<Props> = ({ 
    weekly_schedule, 
    today_schedule, 
    next_class, 
    current_day, 
    statistics 
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getDayColor = (day: string) => {
        const colors = {
            'monday': 'bg-blue-100 text-blue-800',
            'tuesday': 'bg-green-100 text-green-800',
            'wednesday': 'bg-yellow-100 text-yellow-800',
            'thursday': 'bg-purple-100 text-purple-800',
            'friday': 'bg-red-100 text-red-800',
            'saturday': 'bg-gray-100 text-gray-800',
            'sunday': 'bg-orange-100 text-orange-800'
        };
        return colors[day.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getDayColorValue = (day: string) => {
        const colors = {
            'monday': '#3b82f6',
            'tuesday': '#10b981', 
            'wednesday': '#f59e0b',
            'thursday': '#8b5cf6',
            'friday': '#ef4444',
            'saturday': '#6b7280',
            'sunday': '#f97316'
        };
        return colors[day.toLowerCase() as keyof typeof colors] || '#6b7280';
    };

    const formatTime = (time: string) => {
        return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDayName = (day: string) => {
        const days = {
            'monday': 'Monday',
            'tuesday': 'Tuesday', 
            'wednesday': 'Wednesday',
            'thursday': 'Thursday',
            'friday': 'Friday',
            'saturday': 'Saturday',
            'sunday': 'Sunday'
        };
        return days[day.toLowerCase() as keyof typeof days] || day;
    };

    return (
        <AppLayout>
            <Head title="My Schedule" />

            <div className="space-y-6 px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Jadwal saya</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola jadwal mengajar dan tugas kelas Anda.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/teacher/schedules/weekly">
                            <Button variant="outline">
                                <Calendar className="w-4 h-4 mr-2" />
                                Tampilan Mingguan
                            </Button>
                        </Link>
                        <Link href="/teacher/schedules/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Jadwal
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Minggu Ini</p>
                                    <p className="text-2xl font-bold ">{statistics.total_classes_this_week}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Hari Ini</p>
                                    <p className="text-2xl font-bold ">{statistics.classes_today}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <BookOpen className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Mata Pelajaran</p>
                                    <p className="text-2xl font-bold ">{statistics.unique_subjects}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <MapPin className="h-8 w-8 text-orange-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Ruang Kelas</p>
                                    <p className="text-2xl font-bold ">{statistics.unique_classrooms}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Today's Schedule */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Jadwal Hari Ini ({getDayName(current_day)})</CardTitle>
                                <CardDescription>
                                    Kelas Anda untuk hari ini
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search schedules..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {today_schedule.length > 0 ? today_schedule
                                .filter(schedule => 
                                    !searchTerm || 
                                    schedule.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    schedule.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    schedule.classroom.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((schedule) => (
                                <div
                                    key={schedule.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge className={getDayColor(current_day)}>
                                                    {getDayName(current_day)}
                                                </Badge>
                                                <Badge variant="outline">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {schedule.time_range}
                                                </Badge>
                                                <Badge variant="outline">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {schedule.classroom}
                                                </Badge>
                                            </div>
                                            
                                            <h3 className="font-semibold  mb-2">
                                                {schedule.subject}
                                            </h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>{schedule.class}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{schedule.classroom}</span>
                                                </div>
                                            </div>
                                            
                                            {schedule.notes && (
                                                <p className="text-sm text-gray-500 mt-2">{schedule.notes}</p>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 ml-4">
                                            <Link href={`/teacher/schedules/${schedule.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/teacher/schedules/${schedule.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium ">Tidak ada kelas hari ini</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Anda tidak memiliki kelas yang dijadwalkan untuk hari ini.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Schedule Overview */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Weekly Overview</CardTitle>
                                <CardDescription>
                                    All your classes this week organized by day
                                </CardDescription>
                            </div>
                            <Link href="/teacher/schedules/weekly">
                                <Button variant="outline">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    View Calendar
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(weekly_schedule).map(([day, daySchedules]) => (
                                <Card key={day} className="border-l-4" style={{borderLeftColor: getDayColorValue(day)}}>
                                    <CardContent className="p-4">
                                        <h4 className="font-medium text-gray-900 mb-3 capitalize">
                                            {getDayName(day)} ({daySchedules.length} classes)
                                        </h4>
                                        {daySchedules.length > 0 ? (
                                            <div className="space-y-2">
                                                {daySchedules.slice(0, 3).map((schedule) => (
                                                    <div key={schedule.id} className="text-sm">
                                                        <div className="font-medium text-gray-800">
                                                            {schedule.subject}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            {schedule.time_range} • {schedule.class}
                                                        </div>
                                                    </div>
                                                ))}
                                                {daySchedules.length > 3 && (
                                                    <div className="text-xs text-gray-500">
                                                        +{daySchedules.length - 3} more classes
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No classes</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default ScheduleIndex;