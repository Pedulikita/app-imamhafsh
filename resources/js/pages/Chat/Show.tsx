import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEcho } from '@laravel/echo-react';
import { 
    ArrowLeft, 
    Send, 
    User, 
    GraduationCap,
    Heart,
    MoreVertical,
    Phone,
    Video,
    Info
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    message: string;
    message_type: string;
    read_at: string | null;
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
}

interface Props {
    conversation: Conversation;
    messages: Message[];
    auth: {
        user: User;
    };
}

export default function Show({ conversation, messages, auth }: Props) {
    const [newMessage, setNewMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<Message[]>(messages);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const echo = useEcho();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Set up real-time message listening
    useEffect(() => {
        // Set up Echo listener for new messages
        const channel = echo?.private(`conversation.${conversation.id}`)
            .listen('MessageSent', (e: any) => {
                console.log('New message received:', e);
                setChatMessages(prev => [...prev, e.message]);
            });

        // Mark messages as read when viewing conversation
        fetch(`/chat/${conversation.id}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        });

        return () => {
            // Leave channel when component unmounts
            echo?.leave(`conversation.${conversation.id}`);
        };
    }, [conversation.id, echo]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newMessage.trim() || isLoading) return;

        setIsLoading(true);
        
        try {
            const response = await fetch(`/chat/${conversation.id}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: newMessage,
                    message_type: 'text',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setChatMessages(prev => [...prev, data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hari ini';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Kemarin';
        } else {
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    const getParticipantInfo = () => {
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

    const participant = getParticipantInfo();

    // Group messages by date
    const groupedMessages = chatMessages.reduce((groups, message) => {
        const date = new Date(message.created_at).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {} as Record<string, Message[]>);

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
                    
                    <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                {participant.role === 'Guru' ? (
                                    <GraduationCap className="w-5 h-5" />
                                ) : (
                                    <Heart className="w-5 h-5" />
                                )}
                            </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                                    {participant.name}
                                </h2>
                                <Badge variant="secondary" className="text-xs">
                                    {participant.role}
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                Membahas: {conversation.student.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                            <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Info className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={`Chat dengan ${participant.name}`} />

            <div className="flex flex-col h-[calc(100vh-200px)]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                    {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                        <div key={date}>
                            {/* Date Separator */}
                            <div className="flex items-center justify-center my-4">
                                <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(dayMessages[0].created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Messages for this date */}
                            {dayMessages.map((message, index) => {
                                const isOwnMessage = message.sender_id === auth.user.id;
                                const showAvatar = index === dayMessages.length - 1 || 
                                    dayMessages[index + 1]?.sender_id !== message.sender_id;

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
                                    >
                                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                                            isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                                        }`}>
                                            {!isOwnMessage && (
                                                <Avatar className={`w-8 h-8 ${showAvatar ? 'visible' : 'invisible'}`}>
                                                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                                        {message.sender.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            
                                            <div
                                                className={`rounded-2xl px-4 py-2 ${
                                                    isOwnMessage
                                                        ? 'bg-blue-600 text-white rounded-br-md'
                                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md shadow-sm'
                                                }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap break-words">
                                                    {message.message}
                                                </p>
                                                <p className={`text-xs mt-1 ${
                                                    isOwnMessage 
                                                        ? 'text-blue-100' 
                                                        : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                    {formatTime(message.created_at)}
                                                    {isOwnMessage && message.read_at && (
                                                        <span className="ml-1">✓✓</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                    <form onSubmit={sendMessage} className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder={`Kirim pesan ke ${participant.name}...`}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={!newMessage.trim() || isLoading}
                            className="bg-blue-600 hover:bg-blue-700 px-4"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </form>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                            Tekan Enter untuk mengirim
                        </span>
                        <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Online</span>
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}