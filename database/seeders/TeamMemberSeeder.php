<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TeamMember;

class TeamMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teamMembers = [
            // Pembina
            [
                'name' => 'Wahyu Budhi Prabowo, S.Si.',
                'role' => 'Pembina',
                'description' => 'Pendiri dan Pembina utama yang memiliki visi kuat dalam mengembangkan pendidikan Islam yang komprehensif dan berintegritas.',
                'image' => 'https://ui-avatars.com/api/?name=Wahyu+Budhi+Prabowo&background=random',
                'category' => 'Pembina',
                'order' => 1,
                'is_active' => true,
            ],
            // Directors
            [
                'name' => 'Muhammad Andrik Mizraqi, S.Pd.',
                'role' => 'Director',
                'description' => 'Memimpin dengan dedikasi penuh dalam mengembangkan kurikulum dan sistem pembelajaran yang inovatif dan berkualitas.',
                'image' => 'https://ui-avatars.com/api/?name=Muhammad+Andrik+Mizraqi&background=random',
                'category' => 'Director',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Ahmad Ade Triyono, S.Pd.',
                'role' => 'Director',
                'description' => 'Berpengalaman dalam manajemen pendidikan dan pengembangan karakter santri dengan pendekatan humanis.',
                'image' => 'https://ui-avatars.com/api/?name=Ahmad+Ade+Triyono&background=random',
                'category' => 'Director',
                'order' => 3,
                'is_active' => true,
            ],
            // Heads
            [
                'name' => 'M. Irfan Dadi, S.H., S.Pd.I.',
                'role' => 'Head',
                'image' => 'https://ui-avatars.com/api/?name=M+Irfan+Dadi&background=random',
                'category' => 'Head',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'M. Anas Mubarok, S.Pd.I.',
                'role' => 'Head',
                'image' => 'https://ui-avatars.com/api/?name=M+Anas+Mubarok&background=random',
                'category' => 'Head',
                'order' => 5,
                'is_active' => true,
            ],
            // Managers
            [
                'name' => 'Deni Kurniawan, S.Pd.',
                'role' => 'Manager',
                'image' => 'https://ui-avatars.com/api/?name=Deni+Kurniawan&background=random',
                'category' => 'Manager',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'M. Syaiful Anwar, S.E.',
                'role' => 'Manager',
                'image' => 'https://ui-avatars.com/api/?name=M+Syaiful+Anwar&background=random',
                'category' => 'Manager',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Hilman Isfahani, A.Md., Ak.',
                'role' => 'Manager',
                'image' => 'https://ui-avatars.com/api/?name=Hilman+Isfahani&background=random',
                'category' => 'Manager',
                'order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Achmad Mutta\'Ali Sari Lail',
                'role' => 'Manager',
                'image' => 'https://ui-avatars.com/api/?name=Achmad+Mutta+Ali+Sari+Lail&background=random',
                'category' => 'Manager',
                'order' => 9,
                'is_active' => true,
            ],
            // Staff
            [
                'name' => 'Jimmas Ibnu Farez',
                'role' => 'Staff',
                'image' => 'https://ui-avatars.com/api/?name=Jimmas+Ibnu+Farez&background=random',
                'category' => 'Staff',
                'order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Rayhan Juhada Al-Ghazyah',
                'role' => 'Staff',
                'image' => 'https://ui-avatars.com/api/?name=Rayhan+Juhada+Al-Ghazyah&background=random',
                'category' => 'Staff',
                'order' => 11,
                'is_active' => true,
            ],
            [
                'name' => 'Faqih Fodlan, S.H.',
                'role' => 'Staff',
                'image' => 'https://ui-avatars.com/api/?name=Faqih+Fodlan&background=random',
                'category' => 'Staff',
                'order' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'Randi Gana Aji, S.Pd.',
                'role' => 'Staff',
                'image' => 'https://ui-avatars.com/api/?name=Randi+Gana+Aji&background=random',
                'category' => 'Staff',
                'order' => 13,
                'is_active' => true,
            ],
            [
                'name' => 'Ardiansyah, S.Pd.',
                'role' => 'Staff',
                'image' => 'https://ui-avatars.com/api/?name=Ardiansyah&background=random',
                'category' => 'Staff',
                'order' => 14,
                'is_active' => true,
            ],
        ];

        foreach ($teamMembers as $member) {
            TeamMember::create($member);
        }
    }
}
