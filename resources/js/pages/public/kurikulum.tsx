import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { CloudDownload } from 'lucide-react';

export default function Kurikulum() {
    const qualityItems = [
        {
            title: 'Quran',
            image: '/images/Program-Unggulan.png',
            points: [
                'Teori Kuat',
                'Praktik Tepat',
                'Tahfidz Al-Qur\'an',
                'Sanad Al-Qur\'an',
                'Irama (Langgam)',
            ],
        },
        {
            title: 'Internalisasi Adab',
            image: '/images/Program-Unggulan-2.png',
            points: ['Knowing', 'Doing', 'Being'],
        },
        {
            title: 'Language',
            image: '/images/Program-Unggulan-3.png',
            points: [
                'Reading (fahm al-maqru\')',
                'Writing (al-kitabah wa al-imla)',
                'Speaking (muhadatsah)',
                'Grammar (ilm al-alat)',
            ],
        },
        {
            title: 'Informations Technology',
            image: '/images/Program-Unggulan-4.png',
            points: [
                'Computer Architecture',
                'Programming',
                'Mobile Application',
                'Web Developer',
                'Robotic',
                'Graphic Design',
                'Broadcasting',
            ],
        },
    ];

    return (
        <PublicLayout>
            <Head title="Kurikulum - BQ Islamic Boarding School" />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-2xl font-bold text-blue-600 md:text-3xl lg:max-w-4xl">
                        Kurikulum Dan Program Imam Hafsh Islamic Boarding School 
                    </h1>
                    <p className="mt-2 text-lg font-semibold text-slate-700">
                        Sekolah Tahfidz Al-Qur'an, IT Dan Bahasa
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content - Left Column */}
                    <div className="space-y-10 lg:col-span-2">
                        {/* Penerapan Kurikulum */}
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-orange-500">
                                Penerapan Kurikulum
                            </h2>
                            <p className="text-justify leading-relaxed text-slate-700">
                                BQ Islamic Boarding School memadukan Kurikulum Merdeka dan Kurikulum
                                khas Bina Qurani yaitu QUALITY (Quran, Adab, Language dan Informasi
                                Teknologi). Dengan kurikulum QUALITY yang dirancang sesuai dengan
                                perkembangan kebutuhan peserta didik dan perkembangan dunia IT maka
                                di BQ Islamic Boarding School bukan hanya mendidik siswa JAGO NGAJI
                                tapi juga JAGO CODING.
                            </p>
                        </section>

                        {/* Kurikulum Merdeka */}
                        <section>
                            <h2 className="mb-4 text-xl font-bold text-orange-500">
                                Kurikulum Merdeka
                            </h2>
                            <div className="space-y-4 text-justify leading-relaxed text-slate-700">
                                <p>
                                    Kurikulum Merdeka adalah kurikulum dengan pembelajaran
                                    intrakurikuler yang beragam di mana konten akan lebih optimal
                                    agar peserta didik memiliki cukup waktu untuk mendalami konsep
                                    dan menguatkan kompetensi. Guru memiliki keleluasaan untuk
                                    memilih berbagai perangkat ajar sehingga pembelajaran dapat
                                    disesuaikan dengan kebutuhan belajar dan minat peserta didik.
                                    Kurikulum Merdeka memberikan keleluasaan kepada pendidik untuk
                                    menciptakan pembelajaran berkualitas yang sesuai dengan
                                    kebutuhan dan lingkungan belajar peserta didik. Kurikulum
                                    Merdeka juga merupakan upaya untuk pemulihan pembelajaran yang
                                    lebih sederhana dan mendalam.
                                </p>
                                <p>
                                    Penerapan Kurikulum Merdeka salah satu terobosan baru dalam
                                    dunia pendidikan Indonesia, dirancang dengan fokus pada
                                    pengembangan karakter yang diharapkan mampu melahirkan
                                    insan-insan berpengetahuan luas. SMP BQ Islamic School menjadi
                                    salah satu sekolah yang sudah menerapkan Kurikulum Merdeka
                                    dengan mengikuti perkembangan Pendidikan di Indonesia. Sehingga
                                    siswa SMP BQ Islamic School dapat mengenal nilai-nilai
                                    kebudayaan dalam proses pembelajaran, menumbuhkan, dan
                                    mengembangkan rasa merdeka belajar serta membantu siswa
                                    mengembangkan kemandirian dan keterampilan belajar. Selain itu
                                    siswa juga diharapkan dapat merencanakan, mengatur waktu, dan
                                    mengevaluasi kemajuan sendiri, keterampilan yang sangat penting
                                    dalam kehidupan sehari-hari dan di masa depan. Prinsip dari
                                    Kurikulum Merdeka antara lain adalah sebagai berikut:
                                </p>

                                <div className="mt-6 space-y-6">
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            Fokus pada Muatan Esensial
                                        </h3>
                                        <p className="mt-1">
                                            Pembelajaran berpusat pada muatan yang paling diperlukan
                                            untuk mengembangkan kompetensi dan karakter murid agar
                                            pendidik memiliki waktu memadai untuk melakukan
                                            pembelajaran yang mendalam dan bermakna. Hal ini sebagai
                                            upaya untuk menjawab berbagai tantangan zaman dan isu
                                            terkini, seperti perubahan iklim, literasi finansial,
                                            literasi digital, literasi kesehatan, dan pentingnya
                                            sastra dalam memperdalam kemampuan literasi murid.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            Pengembangan Karakter
                                        </h3>
                                        <p className="mt-1">
                                            Pengembangan kompetensi spiritual, moral, sosial, dan
                                            emosional murid, baik dengan pengalokasian waktu khusus
                                            maupun secara terintegrasi dengan proses pembelajaran,
                                            seperti Projek Penguatan Profil Pelajar Pancasila (P5).
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Fleksibel</h3>
                                        <p className="mt-1">
                                            Pembelajaran dapat disesuaikan dengan kebutuhan
                                            pengembangan kompetensi murid, karakteristik satuan
                                            pendidikan, dan konteks lingkungan sosial budaya
                                            setempat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Download Section */}
                        <div className="flex flex-col items-start gap-4 pt-4 sm:flex-row sm:items-center sm:gap-8">
                            <h3 className="text-xl font-bold text-orange-500">
                                Struktur Muatan Kurikulum
                            </h3>
                            <Button className="gap-2 bg-blue-700 hover:bg-blue-800">
                                Download
                                <CloudDownload className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="rounded-3xl bg-slate-50 p-6 shadow-sm md:p-8">
                            <h2 className="mb-8 text-center text-xl font-bold uppercase text-blue-600">
                                Quality Curriculum
                            </h2>

                            <div className="space-y-8">
                                {qualityItems.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-20 w-20 items-center justify-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="mb-2 font-bold text-blue-600">
                                                {item.title}
                                            </h3>
                                            <ul className="list-inside space-y-1 text-sm text-slate-700">
                                                {item.points.map((point, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
