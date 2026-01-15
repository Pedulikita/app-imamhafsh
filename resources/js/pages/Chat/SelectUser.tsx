import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, User as UserIcon, GraduationCap, Heart, MessageCircle } from 'lucide-react';

interface ChatUser {
    id: number;
    name: string;
    email: string;
    role: string;
    can_chat_with: boolean;
}

interface Props {
    users: ChatUser[];
    currentUser: ChatUser;
}

export default function SelectUser({ users, currentUser }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startConversation = (userId: number) => {
        // For now, we'll create a simple conversation
        // In a more complete implementation, we'd also need to select a student
        router.post('/chat/conversations', {
            parent_id: currentUser.role === 'teacher' ? userId : currentUser.id,
            teacher_id: currentUser.role === 'teacher' ? currentUser.id : userId,
            student_id: 1 // For now, use a default student ID
        });
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'teacher':
                return <GraduationCap className="w-5 h-5" />;
            case 'parent':
                return <Heart className="w-5 h-5" />;
            default:
                return <UserIcon className="h-4 w-4" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'teacher':
                return 'bg-blue-100 text-blue-600';
            case 'parent':
                return 'bg-pink-100 text-pink-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.get('/chat')}
                        className="p-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Pilih Pengguna untuk Chat
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Pilih guru atau orang tua untuk memulai percakapan baru
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Pilih Pengguna - Chat" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Cari berdasarkan nama atau email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Users Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <Card 
                                    key={user.id}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => startConversation(user.id)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className={`w-12 h-12 ${getRoleColor(user.role)}`}>
                                                <AvatarFallback className={getRoleColor(user.role)}>
                                                    {getRoleIcon(user.role)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <CardTitle className="text-sm font-medium truncate">
                                                        {user.name}
                                                    </CardTitle>
                                                    <Badge 
                                                        variant="secondary" 
                                                        className="text-xs capitalize"
                                                    >
                                                        {user.role === 'teacher' ? 'Guru' : 'Orang Tua'}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="pt-0">
                                        <Button 
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startConversation(user.id);
                                            }}
                                        >
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Mulai Chat
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                <UserIcon className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {searchTerm ? 'Tidak ada hasil pencarian' : 'Tidak ada pengguna tersedia'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {searchTerm 
                                        ? 'Coba gunakan kata kunci lain untuk mencari pengguna.' 
                                        : 'Saat ini tidak ada guru atau orang tua yang tersedia untuk chat.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="mt-8">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-3">
                                    <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-blue-900 mb-1">
                                            Tentang Sistem Chat
                                        </h3>
                                        <p className="text-sm text-blue-700">
                                            Sistem chat ini memungkinkan komunikasi real-time antara guru dan orang tua 
                                            untuk membahas perkembangan siswa. Semua percakapan tersimpan dengan aman 
                                            dan dapat diakses kapan saja.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}