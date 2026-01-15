import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    MessageSquare,
    Plus,
    Search,
    Send,
    User,
    Clock,
    Filter
} from 'lucide-react';

interface Props {
    messages: any[];
    conversations: any[];
    stats: {
        total_messages: number;
        unread_messages: number;
        new_messages_today: number;
    };
}

const MessageIndex: React.FC<Props> = ({ messages, conversations, stats }) => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AppLayout>
            <Head title="Messages" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold ">Pesan</h1>
                        <p className="text-muted-foreground mt-1">
                            Berkomunikasi dengan siswa, orang tua, dan rekan kerja
                        </p>
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Message
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <MessageSquare className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Pesan</p>
                                    <p className="text-2xl font-bold ">{stats.total_messages}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <MessageSquare className="h-8 w-8 text-red-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Pesan Belum Dibaca</p>
                                    <p className="text-2xl font-bold ">{stats.unread_messages}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Baru Hari Ini</p>
                                    <p className="text-2xl font-bold ">{stats.new_messages_today}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Percakapan
                                </CardTitle>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search conversations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {conversations.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500">Belum ada percakapan</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {conversations.map((conversation, index) => (
                                            <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm font-medium truncate">
                                                                {conversation.participant_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {conversation.last_message_time}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {conversation.last_message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Message Content */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Message Center
                                </CardTitle>
                                <CardDescription>
                                    Select a conversation to start messaging
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-2 text-sm font-semibold ">Start a conversation</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Select a conversation from the sidebar or create a new message.
                                    </p>
                                    <div className="mt-6">
                                        <Button>
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Message
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default MessageIndex;