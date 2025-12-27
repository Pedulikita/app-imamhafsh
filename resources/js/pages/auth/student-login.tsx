import React, { useEffect, FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, User, Lock } from 'lucide-react';

export default function StudentLogin({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        class_name: '',
        student_id: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('student_id');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/student/login');
    };

    return (
        <>
            <Head title="Login Siswa" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-blue-600 p-3 rounded-full">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center">Login Siswa</CardTitle>
                        <CardDescription className="text-center">
                            Masukkan nama kelas dan nomor ID siswa Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && (
                            <Alert className="mb-4">
                                <AlertDescription>{status}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="class_name">Nama Kelas</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="class_name"
                                        type="text"
                                        name="class_name"
                                        value={data.class_name}
                                        className={`pl-10 ${errors.class_name ? 'border-red-300' : ''}`}
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="Contoh: 10A, 11B, 12IPA1"
                                        onChange={(e) => setData('class_name', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.class_name && (
                                    <p className="text-sm text-red-600">{errors.class_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="student_id">Nomor ID Siswa</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="student_id"
                                        type="text"
                                        name="student_id"
                                        value={data.student_id}
                                        className={`pl-10 ${errors.student_id ? 'border-red-300' : ''}`}
                                        autoComplete="off"
                                        placeholder="Masukkan nomor ID siswa"
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.student_id && (
                                    <p className="text-sm text-red-600">{errors.student_id}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <Label htmlFor="remember" className="text-sm">
                                    Ingat saya
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing ? 'Masuk...' : 'Masuk'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Atau</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href="/login"
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    Login sebagai Guru/Admin
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}