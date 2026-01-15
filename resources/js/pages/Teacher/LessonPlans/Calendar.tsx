import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight,
    Plus,
    Eye
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface LessonPlan {
    id: number;
    title: string;
    start: string;
    end: string;
    color: string;
    extendedProps: {
        status: 'draft' | 'published';
        class_name: string;
        subject_name: string;
        description: string;
    };
}

interface Props {
    lessonPlans: LessonPlan[];
    currentDate: string;
}

export default function Calendar({ lessonPlans, currentDate }: Props) {
    const [selectedDate, setSelectedDate] = useState(new Date(currentDate + '-01'));
    
    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        setSelectedDate(newDate);
        
        const formattedDate = format(newDate, 'yyyy-MM');
        router.get('/teacher/lesson-plans/calendar', { date: formattedDate }, { preserveState: true });
    };

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add empty cells for the days before the month starts
    const startDay = getDay(monthStart);
    const emptyDays = Array.from({ length: startDay === 0 ? 0 : startDay }, (_, i) => null);

    const getLessonPlansForDate = (date: Date) => {
        return lessonPlans.filter(plan => {
            const planDate = new Date(plan.start);
            return isSameDay(planDate, date);
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-500';
            case 'draft':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'published':
                return 'default';
            case 'draft':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout>
            <Head title="Calendar View - Lesson Plans" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <CalendarIcon className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
                            <p className="text-gray-600">View your lesson plans in calendar format</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => router.get('/teacher/lesson-plans')}
                        >
                            Back to List
                        </Button>
                        <Button onClick={() => router.get('/teacher/lesson-plans/create')}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Lesson Plan
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                                {format(selectedDate, 'MMMM yyyy', { locale: idLocale })}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateMonth('prev')}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedDate(new Date())}
                                >
                                    Today
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigateMonth('next')}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                            {/* Day headers */}
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                                <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                                    {day}
                                </div>
                            ))}
                            
                            {/* Empty cells for days before month starts */}
                            {emptyDays.map((_, index) => (
                                <div key={`empty-${index}`} className="bg-white p-2 h-24"></div>
                            ))}
                            
                            {/* Calendar days */}
                            {calendarDays.map((day) => {
                                const dayPlans = getLessonPlansForDate(day);
                                const isToday = isSameDay(day, new Date());
                                const isCurrentMonth = isSameMonth(day, selectedDate);
                                
                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={`bg-white p-2 h-24 border border-gray-100 relative ${
                                            !isCurrentMonth ? 'text-gray-400' : ''
                                        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-sm font-medium ${
                                                isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                                {format(day, 'd')}
                                            </span>
                                            {dayPlans.length > 0 && (
                                                <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                                                    {dayPlans.length}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-1 overflow-hidden">
                                            {dayPlans.slice(0, 2).map((plan) => (
                                                <div
                                                    key={plan.id}
                                                    className="group cursor-pointer"
                                                    onClick={() => router.get(`/teacher/lesson-plans/${plan.id}`)}
                                                >
                                                    <div className={`text-xs p-1 rounded text-white truncate ${getStatusColor(plan.extendedProps.status)} group-hover:opacity-80 transition-opacity`}>
                                                        <div className="font-medium truncate">{plan.title}</div>
                                                        <div className="opacity-90 truncate">{plan.extendedProps.class_name}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            {dayPlans.length > 2 && (
                                                <div className="text-xs text-gray-500">
                                                    +{dayPlans.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Legend */}
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                            <span className="font-medium text-gray-700">Status:</span>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span>Published</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                <span>Draft</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Lesson Plans */}
                {getLessonPlansForDate(new Date()).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Today's Lesson Plans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {getLessonPlansForDate(new Date()).map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                                                <Badge variant={getStatusBadgeVariant(plan.extendedProps.status)}>
                                                    {plan.extendedProps.status}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p><strong>Class:</strong> {plan.extendedProps.class_name}</p>
                                                <p><strong>Subject:</strong> {plan.extendedProps.subject_name}</p>
                                                <p><strong>Time:</strong> {format(new Date(plan.start), 'HH:mm')} - {format(new Date(plan.end), 'HH:mm')}</p>
                                                {plan.extendedProps.description && (
                                                    <p className="text-gray-500">{plan.extendedProps.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(`/teacher/lesson-plans/${plan.id}`)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}