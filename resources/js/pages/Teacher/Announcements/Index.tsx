import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Newspaper,
    Plus,
    Edit,
    Trash2,
    Eye,
    Calendar,
    BarChart3
} from 'lucide-react';

interface Props {
    announcements: any[];
    stats: {
        total_announcements: number;
        published_announcements: number;
        draft_announcements: number;
    };
}

const AnnouncementIndex: React.FC<Props> = ({ announcements, stats }) => {
    return (
        <AppLayout>
            <Head title="Announcements" />

            <div className="space-y-6 px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Pengumuman</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola pengumuman dan notifikasi kelas Anda
                        </p>
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Pengumuman Baru
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Newspaper className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Pengumuman</p>
                                    <p className="text-2xl font-bold ">{stats.total_announcements}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Eye className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Dipublikasikan</p>
                                    <p className="text-2xl font-bold ">{stats.published_announcements}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Edit className="h-8 w-8 text-orange-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                                    <p className="text-2xl font-bold ">{stats.draft_announcements}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Announcements List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Newspaper className="w-5 h-5" />
                            Recent Announcements
                        </CardTitle>
                        <CardDescription>
                            Manage and view your announcements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {announcements.length === 0 ? (
                            <div className="text-center py-12">
                                <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">Tidak ada pengumuman</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Mulailah dengan membuat pengumuman baru.</p>
                                <div className="mt-6">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Pengumuman Baru
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {announcements.map((announcement, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{announcement.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{announcement.excerpt}</p>
                                                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {announcement.created_at}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default AnnouncementIndex;