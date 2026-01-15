import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Plus, Search, User, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Message {
    id: number;
    message: string;
    created_at: string;
    sender: User;
}

interface Conversation {
    id: number;
    teacher_id: number;
    parent_id: number;
    student_id: number;
    status: string;
    last_message_at: string;
    teacher: User;
    parent: User;
    student: User;
    messages: Message[];
    unread_count?: number;
}

interface Props {
    conversations: Conversation[];
    auth: {
        user: User;
    };
}

export default function Index({ conversations, auth }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredConversations, setFilteredConversations] = useState(conversations);

    useEffect(() => {
        const filtered = conversations.filter(conversation => {
            const participantName = conversation.teacher_id === auth.user.id 
                ? conversation.parent.name 
                : conversation.teacher.name;
            const studentName = conversation.student.name;
            
            return participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   studentName.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredConversations(filtered);
    }, [searchTerm, conversations]);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short'
            });
        }
    };

    const getParticipantInfo = (conversation: Conversation) => {
        if (conversation.teacher_id === auth.user.id) {
            return {
                name: conversation.parent.name,
                role: 'Orang Tua',
                email: conversation.parent.email,
            };
        } else {
            return {
                name: conversation.teacher.name,
                role: 'Guru',
                email: conversation.teacher.email,
            };
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Chat Real-time
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Komunikasi real-time antara guru dan orang tua
                        </p>
                    </div>
                    <Button
                        onClick={() => router.get('/users')} 
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Mulai Chat Baru
                    </Button>
                </div>
            }
        >
            <Head title="Chat - Komunikasi Real-time" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Cari percakapan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Conversations Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map((conversation) => {
                                const participant = getParticipantInfo(conversation);
                                const lastMessage = conversation.messages?.[0];
                                
                                return (
                                    <Card 
                                        key={conversation.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                                        onClick={() => router.get(`/chat/${conversation.id}`)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <CardTitle className="text-sm font-medium truncate">
                                                                {participant.name}
                                                            </CardTitle>
                                                            <Badge 
                                                                variant="secondary" 
                                                                className="text-xs"
                                                            >
                                                                {participant.role}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            Siswa: {conversation.student.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                {conversation.unread_count && conversation.unread_count > 0 && (
                                                    <Badge className="bg-red-500 text-white text-xs">
                                                        {conversation.unread_count}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        
                                        <CardContent className="pt-0">
                                            {lastMessage ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        <span className="font-medium">
                                                            {lastMessage.sender.name}:
                                                        </span>{' '}
                                                        {lastMessage.message}
                                                    </p>
                                                    <div className="flex items-center text-xs text-gray-400">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {formatTime(lastMessage.created_at)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">
                                                    Belum ada pesan
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada percakapan'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {searchTerm 
                                        ? 'Coba gunakan kata kunci lain untuk mencari percakapan.' 
                                        : 'Mulai percakapan baru dengan guru atau orang tua siswa.'}
                                </p>
                                {!searchTerm && (
                                    <Button
                                        onClick={() => router.get('/users')} 
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Mulai Chat Baru
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    {conversations.length > 0 && (
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {conversations.length}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Total Percakapan
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {conversations.filter(c => c.status === 'active').length}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Aktif
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Belum Dibaca
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {new Set(conversations.map(c => 
                                            c.teacher_id === auth.user.id ? c.parent_id : c.teacher_id
                                        )).size}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Kontak
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}