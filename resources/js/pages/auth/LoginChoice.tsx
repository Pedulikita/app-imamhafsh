import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, UserCheck, Heart } from 'lucide-react';

export default function LoginChoice() {
    return (
        <>
            <Head title="Pilih Login" />
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Portal Login
                        </h1>
                        <p className="text-gray-600">
                            Pilih portal login sesuai dengan peran Anda
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Student Login */}
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                            <CardHeader className="text-center">
                                <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                                    <GraduationCap className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-xl">Login Siswa</CardTitle>
                                <CardDescription>
                                    Masuk menggunakan nama kelas dan nomor ID siswa
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="mb-4 text-sm text-gray-600">
                                    <p>• Tidak perlu registrasi</p>
                                    <p>• Gunakan nama kelas (contoh: 10A)</p>
                                    <p>• Gunakan nomor ID siswa sebagai password</p>
                                </div>
                                <Link href="/student/login">
                                    <Button className="w-full" size="lg">
                                        Login Sebagai Siswa
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Parent Login */}
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                            <CardHeader className="text-center">
                                <div className="bg-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-purple-700 transition-colors">
                                    <Heart className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-xl">Login Orang Tua</CardTitle>
                                <CardDescription>
                                    Masuk untuk memantau perkembangan anak
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="mb-4 text-sm text-gray-600">
                                    <p>• Untuk orang tua/wali siswa</p>
                                    <p>• Gunakan email dan password</p>
                                    <p>• Pantau nilai dan kehadiran anak</p>
                                </div>
                                <Link href="/login">
                                    <Button className="w-full" variant="outline" size="lg">
                                        Login Sebagai Orang Tua
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Teacher/Admin Login */}
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                            <CardHeader className="text-center">
                                <div className="bg-green-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-green-700 transition-colors">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-xl">Login Guru/Admin</CardTitle>
                                <CardDescription>
                                    Masuk menggunakan email dan password
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="mb-4 text-sm text-gray-600">
                                    <p>• Untuk guru dan administrator</p>
                                    <p>• Gunakan email dan password</p>
                                    <p>• Akses penuh ke sistem manajemen</p>
                                </div>
                                <Link href="/login">
                                    <Button className="w-full" variant="secondary" size="lg">
                                        Login Sebagai Guru/Admin
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            href="/"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}