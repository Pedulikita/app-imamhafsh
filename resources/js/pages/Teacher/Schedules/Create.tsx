import React, { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { 
    Calendar,
    Clock,
    MapPin,
    Save,
    X,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

interface TeacherClass {
    id: number;
    name: string;
    subject: string;
    grade: string;
}

interface Classroom {
    id: number;
    name: string;
    code: string;
    type: string;
    capacity: number;
    facilities: string[];
}

interface TimeSlot {
    id: number;
    name: string;
    time_range: string;
    start_time: string;
    end_time: string;
}

interface Props {
    teacher_classes: TeacherClass[];
    classrooms: Classroom[];
    time_slots: TimeSlot[];
    subjects: Array<{id: number; name: string}>;
    days: Record<string, string>;
}

const CreateSchedule: React.FC<Props> = ({ teacher_classes = [], classrooms = [], time_slots = [], subjects = [], days = {} }) => {
    const [conflicts, setConflicts] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const checkTimeoutRef = useRef<NodeJS.Timeout>();

    const { data, setData, post, processing, errors, reset } = useForm({
        teacher_class_id: '',
        classroom_id: '',
        time_slot_id: '',
        day_of_week: '',
        notes: ''
    });

    const checkConflicts = () => {
        if (!data.teacher_class_id || !data.classroom_id || !data.time_slot_id || !data.day_of_week) {
            return;
        }

        setIsChecking(true);
        
        // Clear previous timeout
        if (checkTimeoutRef.current) {
            clearTimeout(checkTimeoutRef.current);
        }

        // Debounced conflict check
        checkTimeoutRef.current = setTimeout(() => {
            fetch('/teacher/schedules/check-conflict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || ''
                },
                body: JSON.stringify({
                    teacher_class_id: data.teacher_class_id,
                    classroom_id: data.classroom_id,
                    time_slot_id: data.time_slot_id,
                    day_of_week: data.day_of_week
                })
            })
            .then(response => response.json())
            .then(result => {
                setConflicts(result.conflicts || []);
                setIsChecking(false);
            })
            .catch(() => {
                setIsChecking(false);
            });
        }, 500);
    };

    const handleInputChange = (field: string, value: string) => {
        setData(field as any, value);
        
        // Trigger conflict check after a brief delay
        setTimeout(checkConflicts, 100);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (conflicts.length > 0) {
            alert('Please resolve conflicts before submitting.');
            return;
        }

        post('/teacher/schedules', {
            onSuccess: () => {
                reset();
                setConflicts([]);
            }
        });
    };

    const selectedTimeSlot = time_slots?.find(ts => ts.id.toString() === data.time_slot_id);
    const selectedClass = teacher_classes?.find(tc => tc.id.toString() === data.teacher_class_id);
    const selectedClassroom = classrooms?.find(c => c.id.toString() === data.classroom_id);

    return (
        <AppLayout>
            <Head title="Create Schedule" />

            <div className="space-y-6 px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Buat Jadwal Baru</h1>
                        <p className="text-muted-foreground mt-1">
                            Tambahkan jadwal mengajar baru dengan deteksi konflik otomatis
                        </p>
                    </div>
                    <Link href="/teacher/schedules">
                        <Button variant="outline">
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule Information</CardTitle>
                                <CardDescription>
                                    Fill in the details for your new schedule
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Class Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="teacher_class_id">Class & Subject *</Label>
                                        <select
                                            id="teacher_class_id"
                                            value={data.teacher_class_id}
                                            onChange={(e) => handleInputChange('teacher_class_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Class & Subject</option>
                                            {teacher_classes?.map((tc) => (
                                                <option key={tc.id} value={tc.id}>
                                                    {tc.subject} - {tc.name} (Grade {tc.grade})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.teacher_class_id && (
                                            <p className="text-sm text-red-600">{errors.teacher_class_id}</p>
                                        )}
                                    </div>

                                    {/* Day Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="day_of_week">Day of Week *</Label>
                                        <select
                                            id="day_of_week"
                                            value={data.day_of_week}
                                            onChange={(e) => handleInputChange('day_of_week', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Day</option>
                                            {Object.entries(days).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.day_of_week && (
                                            <p className="text-sm text-red-600">{errors.day_of_week}</p>
                                        )}
                                    </div>

                                    {/* Time Slot Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="time_slot_id">Time Slot *</Label>
                                        <select
                                            id="time_slot_id"
                                            value={data.time_slot_id}
                                            onChange={(e) => handleInputChange('time_slot_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Time Slot</option>
                                            {time_slots?.map((ts) => (
                                                <option key={ts.id} value={ts.id}>
                                                    {ts.name} ({ts.time_range})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.time_slot_id && (
                                            <p className="text-sm text-red-600">{errors.time_slot_id}</p>
                                        )}
                                    </div>

                                    {/* Classroom Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="classroom_id">Classroom *</Label>
                                        <select
                                            id="classroom_id"
                                            value={data.classroom_id}
                                            onChange={(e) => handleInputChange('classroom_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Classroom</option>
                                            {classrooms?.map((classroom) => (
                                                <option key={classroom.id} value={classroom.id}>
                                                    {classroom.name} (Capacity: {classroom.capacity}, Type: {classroom.type})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.classroom_id && (
                                            <p className="text-sm text-red-600">{errors.classroom_id}</p>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes (Optional)</Label>
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Additional notes or instructions..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <Button 
                                            type="submit" 
                                            disabled={processing || conflicts.length > 0}
                                            className="w-full"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing ? 'Creating Schedule...' : 'Create Schedule'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview & Conflicts */}
                    <div className="space-y-6">
                        {/* Schedule Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Schedule Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedClass && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <p className="font-medium">{selectedClass.subject.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedClass.class_name}</p>
                                        </div>
                                    </div>
                                )}

                                {data.day_of_week && selectedTimeSlot && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="font-medium">
                                                {Object.entries(days).find(([key]) => key === data.day_of_week)?.[1] || data.day_of_week}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedTimeSlot.time_range}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {selectedClassroom && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-purple-600" />
                                        <div>
                                            <p className="font-medium">{selectedClassroom.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Kapasitas: {selectedClassroom.capacity}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {(!selectedClass && !data.day_of_week && !selectedTimeSlot && !selectedClassroom) && (
                                    <p className="text-muted-foreground text-center py-8">
                                        Isi formulir untuk melihat pratinjau jadwal
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Conflict Detection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Conflict Check</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isChecking && (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-sm text-muted-foreground mt-2">Memeriksa konflik...</p>
                                    </div>
                                )}

                                {!isChecking && conflicts.length === 0 && data.teacher_class_id && data.classroom_id && data.time_slot_id && data.day_of_week && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <div className="ml-2">
                                            <h4 className="text-green-800 font-medium">Tidak Ada Konflik</h4>
                                            <p className="text-green-700 text-sm">Jadwal ini tersedia.</p>
                                        </div>
                                    </Alert>
                                )}

                                {!isChecking && conflicts.length > 0 && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <div className="ml-2">
                                            <h4 className="text-red-800 font-medium">Konflik Ditemukan</h4>
                                            <ul className="text-red-700 text-sm mt-1 space-y-1">
                                                {conflicts.map((conflict, index) => (
                                                    <li key={index}>• {conflict}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Alert>
                                )}

                                {!isChecking && (!data.teacher_class_id || !data.classroom_id || !data.time_slot_id || !data.day_of_week) && (
                                    <p className="text-muted-foreground text-center py-4">
                                        Isi formulir untuk memeriksa konflik jadwal
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CreateSchedule;