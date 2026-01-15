import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { BarChart3, Users, ArrowLeft } from 'lucide-react';

interface ClassData {
    id: number;
    name: string;
    grade: { name: string };
    subject: { name: string };
    students: any[];
}

interface Props {
    classes: ClassData[];
    message?: string;
}

export default function GradesIndex({ classes, message }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teacher Dashboard',
            href: '/teacher/dashboard',
        },
        {
            title: 'Grade Management',
            href: '/teacher/grades',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grade Management" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Kelas</h1>
                        <p className="text-muted-foreground">Kelola nilai dan penilaian siswa</p>
                    </div>
                    <Link href="/teacher/dashboard">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Dasbor
                        </Button>
                    </Link>
                </div>

                {message && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">Manajemen Kelas</h3>
                            <p className="text-muted-foreground1 mb-6">{message}</p>
                        </CardContent>
                    </Card>
                )}

                {classes.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {classes.map((classItem) => (
                            <Card key={classItem.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {classItem.grade.name} • {classItem.subject.name}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Users className="w-4 h-4 mr-2" />
                                            {classItem.students.length} students
                                        </div>
                                        <Button size="sm" disabled>
                                            Kelola Nilai
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}