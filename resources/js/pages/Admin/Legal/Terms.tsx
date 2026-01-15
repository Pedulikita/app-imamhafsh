import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { update as updateRoute } from '@/routes/admin/legal-content/terms';

interface Props {
    content: string;
}

export default function Terms({ content }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        content: content || '',
    });

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        put(updateRoute(), {
            onSuccess: () => {
                setSuccessMessage('Syarat & Ketentuan berhasil diperbarui');
                setErrorMessage('');
                setTimeout(() => setSuccessMessage(''), 5000);
            },
            onError: () => {
                setErrorMessage('Gagal memperbarui data. Silakan coba lagi.');
                setSuccessMessage('');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Syarat & Ketentuan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Syarat & Ketentuan</h1>
                    <p className="mt-2 text-slate-600">
                        Kelola konten Syarat & Ketentuan yang ditampilkan pada website
                    </p>
                </div>

                {successMessage && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {successMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {errorMessage && (
                    <Alert className="border-red-200 bg-red-50">
                        <XCircle className="size-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Konten Syarat & Ketentuan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                    Konten Lengkap
                                </label>
                                <RichTextEditor
                                    content={data.content}
                                    onChange={(value) => setData('content', value)}
                                    placeholder="Tulis konten syarat & ketentuan di sini..."
                                />
                                {errors.content && (
                                    <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                                )}
                                <p className="mt-2 text-sm text-slate-500">
                                    Gunakan editor untuk memformat teks, menambahkan heading, list, dan styling lainnya.
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
