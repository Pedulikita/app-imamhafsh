import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string | null;
    category: 'Pembina' | 'Director' | 'Head' | 'Manager' | 'Staff';
    order: number;
    is_active: boolean;
}

interface Props {
    teamMembers: {
        Pembina: TeamMember[];
        Director: TeamMember[];
        Head: TeamMember[];
        Manager: TeamMember[];
        Staff: TeamMember[];
    };
}

const TeamCard = ({ member, size = 'normal' }: { member: TeamMember; size?: 'normal' | 'large' }) => (
    <div className="flex flex-col items-center text-center">
        <div
            className={`mb-4 overflow-hidden rounded-full border-4 border-slate-100 shadow-lg ${
                size === 'large' ? 'h-48 w-48' : 'h-32 w-32'
            }`}
        >
            <img 
                src={member.image ? `/${member.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} 
                alt={member.name} 
                className="h-full w-full object-cover" 
            />
        </div>
        <h3 className="text-sm font-bold text-blue-600 md:text-base">{member.name}</h3>
        {member.role && <p className="text-xs text-slate-600">{member.role}</p>}
    </div>
);

export default function Team({ teamMembers }: Props) {
    const pembina = teamMembers.Pembina?.[0];
    const directors = teamMembers.Director || [];
    const heads = teamMembers.Head || [];
    const managers = teamMembers.Manager || [];
    const staff = teamMembers.Staff || [];

    return (
        <PublicLayout>
            <Head title="Team - BQ Islamic Boarding School" />

            {/* Hero Image */}
            <div className="w-full">
                <img
                    src="/images/Banner-Page.png"
                    alt="Banner"
                    className="h-64 w-full object-cover object-top md:h-80 lg:h-96"
                />
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h1 className="text-2xl font-bold text-blue-600 md:text-3xl">
                        Team Bina Qurani Islamic Boarding School
                    </h1>
                    <p className="mt-2 text-lg font-semibold text-slate-600">
                        Sekolah Tahfidz Al-Qur'an, IT Dan Bahasa
                    </p>
                </div>

                <div className="space-y-20">
                    {/* 1. PELAKSANA HARIAN PEMBINA YAYASAN */}
                    {pembina && (
                        <section>
                            <h2 className="mb-10 text-center text-xl font-bold uppercase text-slate-700">
                                Pelaksana Harian Pembina Yayasan
                            </h2>
                            <div className="flex justify-center">
                                <TeamCard member={pembina} size="large" />
                            </div>
                        </section>
                    )}

                    {/* 2. DIREKTUR PENDIDIKAN DAN DIREKTUR UMUM */}
                    {directors.length > 0 && (
                        <section>
                            <h2 className="mb-10 text-center text-xl font-bold uppercase text-slate-700">
                                Direktur Pendidikan dan Direktur Umum
                            </h2>
                            <div className="flex flex-wrap justify-center gap-10 md:gap-20">
                                {directors.map((member) => (
                                    <TeamCard key={member.id} member={member} size="large" />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. KEPALA SEKOLAH DAN KEPALA KEPESANTRENAN */}
                    {heads.length > 0 && (
                        <section>
                            <h2 className="mb-10 text-center text-xl font-bold uppercase text-slate-700">
                                Kepala Sekolah dan Kepala Kepesantrenan
                            </h2>
                            <div className="flex flex-wrap justify-center gap-10 md:gap-20">
                                {heads.map((member) => (
                                    <TeamCard key={member.id} member={member} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 4. MANAGER */}
                    {managers.length > 0 && (
                        <section>
                            <h2 className="mb-10 text-center text-xl font-bold uppercase text-slate-700">
                                Manager
                            </h2>
                            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                                {managers.map((member) => (
                                    <TeamCard key={member.id} member={member} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 5. STAFF */}
                    {staff.length > 0 && (
                        <section>
                            <h2 className="mb-10 text-center text-xl font-bold uppercase text-slate-700">
                                Staff
                            </h2>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {staff.map((member) => (
                                    <TeamCard key={member.id} member={member} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
