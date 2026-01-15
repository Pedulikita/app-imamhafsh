import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

interface Props {
    content: string;
}

export default function Privacy({ content }: Props) {
    return (
        <PublicLayout>
            <Head title="Kebijakan Privasi" />

            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 py-20">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative mx-auto max-w-7xl px-4">
                    <h1 className="text-4xl font-bold text-white md:text-5xl">
                        Kebijakan Privasi
                    </h1>
                    <p className="mt-4 text-lg text-white/90">
                        Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-16">
                {content ? (
                    <div 
                        className="prose prose-slate prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    <div className="prose prose-slate prose-lg max-w-none">
                        <p className="text-slate-500 text-center py-12">
                            Konten kebijakan privasi belum tersedia. Silakan hubungi administrator untuk menambahkan konten.
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
