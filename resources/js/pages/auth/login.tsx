import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Facebook, Github, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex">
            <Head title="Masuk - BQ Islamic Boarding School" />
            
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Modern gradient background with mesh effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-600/20" />
                
                
                {/* Dark gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />
                
                {/* Decorative elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                <div className="absolute bottom-32 left-16 w-24 h-24 bg-blue-400/10 rounded-full blur-lg" />
                
                <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                    <div className="mb-8 backdrop-blur-sm bg-white/10 rounded-2xl p-6 lg:p-8 border border-white/20 max-w-sm">
                        <img 
                            src="/images/logo.png" 
                            alt="BQ Logo" 
                            className="w-16 h-16 lg:w-20 lg:h-20 mb-4 lg:mb-6 drop-shadow-lg"
                        />
                        <h1 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-3 text-white drop-shadow-lg">
                            Imam Hafsh Islamic Boarding School
                        </h1>
                        <p className="text-blue-100 text-lg lg:text-xl font-medium">
                            Sekolah Tahfidz Al-Qur'an, IT Dan Bahasa
                        </p>
                    </div>
                    <div className="space-y-5">
                        <div className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full shadow-lg" />
                            <span className="text-white font-medium">Sistem pembelajaran modern dan berkualitas</span>
                        </div>
                        <div className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full shadow-lg" />
                            <span className="text-white font-medium">Pendidikan karakter Islami</span>
                        </div>
                        <div className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full shadow-lg" />
                            <span className="text-white font-medium">Teknologi informasi terdepan</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Selamat Datang Kembali
                        </h2>
                        <p className="text-slate-600">
                            Masuk ke akun Anda untuk melanjutkan
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            {status}
                        </div>
                    )}

                    {/* Social Login Buttons */}
                    <div className="mb-8 space-y-3">
                        <Button 
                            type="button"
                            variant="outline" 
                            className="w-full h-12 border-slate-200 hover:bg-slate-50"
                            onClick={() => window.location.href = '/auth/google'}
                        >
                            <img src="/images/icons/google.png" alt="Google" className="w-5 h-5 mr-3" />
                            Masuk dengan Google
                        </Button>
                        
                        <Button 
                            type="button"
                            variant="outline" 
                            className="w-full h-12 border-slate-200 hover:bg-slate-50"
                            onClick={() => window.location.href = '/auth/facebook'}
                        >
                            <img src="/images/icons/facebook.png" alt="Facebook" className="w-5 h-5 mr-3" />
                            Masuk dengan Facebook
                        </Button>
                        
                        <Button 
                            type="button"
                            variant="outline" 
                            className="w-full h-12 border-slate-200 hover:bg-slate-50"
                            onClick={() => window.location.href = '/auth/github'}
                        >
                            <img src="/images/icons/github.png" alt="Github" className="w-5 h-5 mr-3" />
                            Masuk dengan Github
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-slate-500">atau masuk dengan email</span>
                        </div>
                    </div>

                    {/* Login Form */}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            className="mt-2 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="nama@email.com"
                                        />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>

                                    <div>
                                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                            Password
                                        </Label>
                                        <div className="relative mt-2">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                required
                                                className="h-12 pr-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Masukkan password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="remember" name="remember" />
                                            <Label htmlFor="remember" className="text-sm text-slate-600">
                                                Ingat saya
                                            </Label>
                                        </div>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                Lupa password?
                                            </TextLink>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    Masuk
                                </Button>

                                {canRegister && (
                                    <div className="text-center">
                                        <span className="text-sm text-slate-600">
                                            Belum punya akun?{' '}
                                        </span>
                                        <TextLink 
                                            href={register()} 
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            Daftar sekarang
                                        </TextLink>
                                    </div>
                                )}

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
                                        <TextLink
                                            href="/student/login"
                                            className="text-sm font-medium text-green-600 hover:text-green-700"
                                        >
                                            Login sebagai Siswa
                                        </TextLink>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}
