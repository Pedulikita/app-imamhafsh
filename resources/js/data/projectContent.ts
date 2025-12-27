// Project page content configuration
export const projectPageContent = {
    hero: {
        title: 'Project - BQ Islamic Boarding School',
        bannerImage: '/images/Banner-Page.png',
        bannerAlt: 'Banner',
    },
    sections: {
        categories: {
            badge: 'Student Project',
            title: 'Siswa Imam Hafsh Islamic Boarding School',
            defaultIcon: '/images/icons/Information-Technology.png',
        },
        description: {
            title: 'Apa Itu Project Siswa?',
            content: [
                'Project siswa Imam Hafsh Islamic Boarding School merupakan pembelajaran IT yang berbasis proyek dengan inovasi kreatif. Dengan memanfaatkan media dan pengalaman secara langsung. Melalui metode pembelajaran ini, kegiatan belajar mengajar siswa Imam Hafsh Islamic Boarding School bukan hanya dilaksanakan di dalam kelas, akan tetapi melalui pendalaman materi secara langsung dalam bentuk project siswa sebagai sarana pembelajaran.',
                'Project siswa merupakan karya anak bangsa, fokus dalam proyek ini adalah bertujuan agar setiap peserta didik dapat mengembangkan minat dan bakat, serta keterampilan melalui proses perencanaan dan perancangan project siswa dengan terlibat secara langsung.',
            ],
        },
        gallery: {
            tabs: {
                latest: 'Latest Project',
                all: 'All Project',
            },
            readMore: 'Read More →',
        },
    },
    fallbacks: {
        categories: [
            'Web Development',
            'Mobile Apps',
            'Robotics',
            'Graphic Design',
            'Quality Club',
        ],
        projects: [
            {
                id: 1,
                title: 'Website Sekolah',
                subtitle: 'Platform informasi sekolah berbasis web',
                image: 'images/PRESTAS.png',
                category: 'Web Development',
                badge: 'NEW',
                order: 1,
                is_active: true,
            },
            {
                id: 2,
                title: 'Aplikasi Mobile',
                subtitle: 'Aplikasi pembelajaran untuk santri',
                image: 'images/PRESTAS.png',
                category: 'Mobile Apps',
                badge: 'POPULAR',
                order: 2,
                is_active: true,
            },
            {
                id: 3,
                title: 'Robot Otomatis',
                subtitle: 'Robot pembersih otomatis',
                image: 'images/PRESTAS.png',
                category: 'Robotics',
                badge: 'FEATURED',
                order: 3,
                is_active: true,
            },
        ],
    },
    categoryIcons: {
        'Web Development': '/images/icons/Information-Technology.png',
        'Mobile Apps': '/images/icons/UIUX.png',
        Robotics: '/images/icons/Robotics.png',
        'Graphic Design': '/images/icons/DKV.png',
        'Data Science': '/images/icons/Information-Technology.png',
        Programming: '/images/icons/Information-Technology.png',
        'AI & Machine Learning': '/images/icons/Information-Technology.png',
        IoT: '/images/icons/Robotics.png',
        'Quality Club': '/images/icons/Quality-Club.png',
        DKV: '/images/icons/DKV.png',
        'UI/UX': '/images/icons/UIUX.png',
        IT: '/images/icons/Information-Technology.png',
    },
};
