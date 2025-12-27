import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Plus, Eye, Users, BookOpen } from 'lucide-react';

interface ClassData {
    id: number;
    name: string;
    grade_name: string;
    subject_name: string;
    teacher_name: string;
    academic_year: string;
    semester: string;
    status: string;
    students_count: number;
    description?: string;
}

interface Props {
    classes: ClassData[];
    canCreateClasses: boolean;
}

export default function ClassIndex({ classes, canCreateClasses }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teacher Dashboard',
            href: '/teacher/dashboard',
        },
        {
            title: 'My Classes',
            href: '/teacher/classes',
        },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
            active: "default",
            inactive: "secondary",
            completed: "destructive"
        };
        return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Classes" />
            
            <div className="space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Kelasku</h1>
                        <p className="text-muted-foreground">Kelola kelas dan siswa Anda</p>
                    </div>
                    {canCreateClasses && (
                        <Link href="/teacher/classes/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Kelas Baru
                            </Button>
                        </Link>
                    )}
                </div>

                {classes.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {classes.map((classItem) => (
                            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                                        {getStatusBadge(classItem.status)}
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p className="flex items-center">
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            {classItem.subject_name}
                                        </p>
                                        <p>{classItem.grade_name}</p>
                                        <p>{classItem.academic_year} • Semester {classItem.semester}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {classItem.description && (
                                            <p className="text-sm text-gray-700">{classItem.description}</p>
                                        )}
                                        
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="w-4 h-4 mr-2" />
                                            {classItem.students_count} students
                                        </div>

                                        <div className="flex space-x-2">
                                            <Link href={`/teacher/classes/${classItem.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium  mb-2">Belum Ada Kelas</h3>
                            <p className="text-gray-600 mb-6">
                                Anda belum membuat kelas. Mulailah dengan membuat kelas pertama Anda.
                            </p>
                            {canCreateClasses && (
                                <Link href="/teacher/classes/create">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Buat Kelas Pertamamu
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}