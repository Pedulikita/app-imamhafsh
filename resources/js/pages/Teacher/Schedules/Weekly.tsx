import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Calendar,
    Clock,
    MapPin,
    Users,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter
} from 'lucide-react';

interface ScheduleSlot {
    id: number;
    subject: string;
    class: string;
    classroom: string;
    has_conflict: boolean;
}

interface TimeSlot {
    id: number;
    name: string;
    time_range: string;
}

interface ScheduleGridRow {
    time_slot: TimeSlot;
    monday?: ScheduleSlot | null;
    tuesday?: ScheduleSlot | null;
    wednesday?: ScheduleSlot | null;
    thursday?: ScheduleSlot | null;
    friday?: ScheduleSlot | null;
    saturday?: ScheduleSlot | null;
}

interface Props {
    schedule_grid: ScheduleGridRow[];
    week_start: string;
    week_end: string;
    time_slots: TimeSlot[];
    days: Record<string, string>;
}

const WeeklySchedule: React.FC<Props> = ({ 
    schedule_grid, 
    week_start, 
    week_end, 
    time_slots, 
    days 
}) => {
    const [selectedWeek, setSelectedWeek] = useState(week_start);
    
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const getDayColor = (day: string) => {
        const colors = {
            'monday': 'border-l-blue-500',
            'tuesday': 'border-l-green-500',
            'wednesday': 'border-l-yellow-500',
            'thursday': 'border-l-purple-500',
            'friday': 'border-l-red-500',
            'saturday': 'border-l-gray-500'
        };
        return colors[day.toLowerCase() as keyof typeof colors] || 'border-l-gray-500';
    };

    return (
        <AppLayout>
            <Head title="Weekly Schedule" />

            <div className="space-y-6 px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Jadwal Mingguan</h1>
                        <p className="text-muted-foreground mt-1">
                            Minggu tanggal {new Date(week_start).toLocaleDateString()} - {new Date(week_end).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Minggu Sebelumnya
                        </Button>
                        <Button variant="outline">
                            Minggu Berikutnya
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Link href="/teacher/schedules/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Jadwal Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Weekly Calendar Grid */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Tampilan Kalender Mingguan</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                                <Link href="/teacher/schedules">
                                    <Button variant="outline" size="sm">
                                        Tampilan Daftar
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <div className="min-w-full">
                                {/* Header with days */}
                                <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-3 text-center font-medium text-gray-900">
                                        Waktu
                                    </div>
                                    {dayKeys.map((day) => (
                                        <div key={day} className="bg-gray-50 p-3 text-center font-medium text-gray-900">
                                            {days[day]}
                                        </div>
                                    ))}
                                </div>

                                {/* Time slots and schedule cells */}
                                <div className="bg-white">
                                    {schedule_grid.map((row, index) => (
                                        <div key={index} className="grid grid-cols-7 gap-px border-b border-gray-100">
                                            {/* Time label */}
                                            <div className="p-2 text-sm text-gray-600 bg-gray-50 text-center font-medium">
                                                {row.time_slot.time_range}
                                            </div>
                                            
                                            {/* Schedule cells for each day */}
                                            {dayKeys.map((day) => {
                                                const schedule = row[day as keyof ScheduleGridRow] as ScheduleSlot | null;
                                                return (
                                                    <div key={`${day}-${row.time_slot.id}`} className="p-1 min-h-[60px]">
                                                        {schedule && (
                                                            <div className={`h-full rounded border-l-4 ${getDayColor(day)} ${schedule.has_conflict ? 'bg-red-50 border-l-red-500' : 'bg-blue-50'} p-2 hover:bg-blue-100 transition-colors cursor-pointer`}>
                                                                <div className="text-xs font-semibold text-blue-900 mb-1">
                                                                    {schedule.subject}
                                                                </div>
                                                                <div className="text-xs text-blue-700 mb-1">
                                                                    {schedule.class}
                                                                </div>
                                                                <div className="flex items-center text-xs text-blue-600">
                                                                    <MapPin className="w-3 h-3 mr-1" />
                                                                    {schedule.classroom}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">This Week</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {schedule_grid.reduce((total, row) => {
                                            return total + dayKeys.filter(day => row[day as keyof ScheduleGridRow]).length;
                                        }, 0)} classes
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Hours</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {schedule_grid.reduce((total, row) => {
                                            return total + dayKeys.filter(day => row[day as keyof ScheduleGridRow]).length;
                                        }, 0)}h
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <BookOpen className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Time Slots</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {time_slots.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Legend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Color Legend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4 text-sm">
                            {dayKeys.map((day) => (
                                <div key={day} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 border-l-4 ${getDayColor(day)} bg-blue-50`}></div>
                                    <span>{days[day]}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default WeeklySchedule;