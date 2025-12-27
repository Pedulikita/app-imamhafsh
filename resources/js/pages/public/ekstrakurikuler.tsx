import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

interface EkstrakurikulerItem {
    id: number;
    name: string;
    order: number;
    is_active: boolean;
}

interface Props {
    items: EkstrakurikulerItem[];
}

// Mock images for the gallery
const galleryImages = [
    '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor2-300x200.jpg',
    '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor3-300x200.jpg',
    '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor16-300x200.jpg',
    '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor21-300x200.jpg',
    '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor24-300x200.jpg',
    '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor2-300x200.jpg',
    '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor3-300x200.jpg',
    '/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor16-300x200.jpg',
];

export default function Ekstrakurikuler({ items = [] }: Props) {
    return (
        <PublicLayout>
            <Head title="Ekstrakurikuler - BQ Islamic Boarding School" />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Column: Text Content */}
                    <div>
                        <h1 className="mb-2 text-2xl font-bold text-blue-600 md:text-3xl">
                            Imam hafsh Islamic Boarding School
                        </h1>
                        <p className="mb-8 text-lg font-medium text-slate-600">
                            Sekolah Tahfidz Al-Qur'an, IT Dan Bahasa
                        </p>

                        <div className="space-y-6 text-slate-600 leading-relaxed text-justify">
                            <p>
                                Bina Qurani Islamic Boarding School memberikan keleluasaan kepada seluruh peserta
                                didik untuk mengikuti kegiatan-kegiatan ekstrakurikuler. Tujuan dari kegiatan-
                                kegiatan tersebut adalah untuk memfasilitasi minat dan bakat peserta didik yang
                                cukup variatif, sehingga output Bina Qurani ini tidak hanya mumpuni dari sisi
                                kognitif dan afektif tetapi juga secara psikomotorik mampu berkompetisi dengan
                                lulusan-lulusan sekolah lainnya.
                            </p>
                            <p>
                                Selain itu, kegiatan ekstrakurikuler merupakan bagian integral dari pengalaman
                                siswa di sekolah menengah pertama (SMP) yang dapat memberikan manfaat yang
                                signifikan. Diantaranya adalah untuk pengembangan keterampilan di luar
                                lingkungan kelas untuk dapat berbicara di depan umum dalam logika
                                berargumentasi; Menentukan bakat dan minat melalui berbagai kegiatan
                                ekstrakurikuler sehingga siswa dapat memiliki kesempatan untuk menemukan
                                bakat dan minat yang mungkin belum mereka sadari sebelumnya;
                            </p>
                            <p>
                                Serta dapat meningkatkan prestasi akademik melalui kegiatan ekstrakurikuler diharapkan membantu meningkatkan keterampilan manajemen
                                waktu, disiplin, dan konsentrasi dalam meraih kesuksesan akademik. Kegiatan ekstrakurikuler Bina Qurani Islamic Boarding School merupakan
                                kegiatan wajib yang harus diikuti oleh setiap peserta didik. Kegiatan ekstrakurikuler tersebut diantaranya adalah:
                            </p>
                        </div>

                        <ul className="mt-8 space-y-2 pl-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-center text-slate-700">
                                    <span className="mr-3 h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: Collage Image */}
                    <div className="flex items-center justify-center">
                        <div className="relative">
                            {/* We'll use a placeholder for the collage or construct one if individual images are available. 
                                For now, using a single image representing the collage as per usual practice if no specific assets.
                                Or we can try to recreate the collage layout with CSS grid/flex.
                                Let's assume we don't have the exact collage image, so we'll make a simple grid of students.
                            */}
                            <div className="grid grid-cols-2 gap-4">
                                <img 
                                    src="/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor21-300x200.jpg" 
                                    alt="Student Activity" 
                                    className="rounded-lg shadow-md mt-12"
                                />
                                <img 
                                    src="/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor24-300x200.jpg" 
                                    alt="Student Activity" 
                                    className="rounded-lg shadow-md"
                                />
                                <img 
                                    src="/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor2-300x200.jpg" 
                                    alt="Student Activity" 
                                    className="rounded-lg shadow-md -mt-12"
                                />
                                 <img 
                                    src="/images/Kegiatan-siswa-bq-islamic-boarding-school-kota-bogor3-300x200.jpg" 
                                    alt="Student Activity" 
                                    className="rounded-lg shadow-md"
                                />
                            </div>
                             {/* Central larger image overlay attempt (optional, might be complex without exact assets) */}
                        </div>
                    </div>
                </div>

                {/* Bottom Gallery Section */}
                <div className="mt-20">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {galleryImages.map((src, index) => (
                            <div key={index} className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <img
                                    src={src}
                                    alt={`Gallery ${index + 1}`}
                                    className="h-48 w-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                     <div className="mt-4 flex justify-center gap-2">
                        {/* Pagination dots simulation */}
                        <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                        <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                        <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                     </div>
                </div>
            </div>
        </PublicLayout>
    );
}
