import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Award, TrendingUp, BookOpen } from 'lucide-react';

export default function StudentGrades() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Student Dashboard', href: '/student/dashboard' },
        { title: 'My Grades', href: '/student/grades' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Grades" />
            
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold  mb-2">Nilai saya</h1>
                    <p className="text-muted-foreground">Lihat kinerja akademik dan nilai Anda</p>
                </div>

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Award className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium  mb-2">
                            Segera Hadir
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Fitur nilai saat ini sedang dalam pengembangan. 
                            Anda akan dapat melihat skor ujian, nilai tugas, dan kinerja akademik secara keseluruhan di sini.
                        </p>
                        <Button className="mt-4" onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}