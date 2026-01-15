<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FeeType;

class FeeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $feeTypes = [
            [
                'name' => 'SPP (Sumbangan Pembinaan Pendidikan)',
                'description' => 'Biaya bulanan untuk kegiatan belajar mengajar',
                'amount' => 350000.00,
                'frequency' => 'monthly',
                'payment_type' => 'mandatory',
                'applicable_grades' => null, // All grades
                'is_active' => true,
                'allow_installments' => true,
                'max_installments' => 1,
            ],
            [
                'name' => 'Uang Buku dan Alat Tulis',
                'description' => 'Biaya untuk buku pelajaran dan alat tulis per semester',
                'amount' => 500000.00,
                'frequency' => 'semester',
                'payment_type' => 'mandatory',
                'applicable_grades' => null,
                'is_active' => true,
                'allow_installments' => true,
                'max_installments' => 2,
            ],
            [
                'name' => 'Uang Kegiatan Ekstrakurikuler',
                'description' => 'Biaya untuk kegiatan ekstrakurikuler per semester',
                'amount' => 200000.00,
                'frequency' => 'semester',
                'payment_type' => 'optional',
                'applicable_grades' => null,
                'is_active' => true,
                'allow_installments' => false,
                'max_installments' => 1,
            ],
            [
                'name' => 'Uang Ujian Semester',
                'description' => 'Biaya untuk pelaksanaan ujian semester',
                'amount' => 150000.00,
                'frequency' => 'semester',
                'payment_type' => 'mandatory',
                'applicable_grades' => null,
                'is_active' => true,
                'allow_installments' => false,
                'max_installments' => 1,
            ],
            [
                'name' => 'Uang Praktikum',
                'description' => 'Biaya untuk kegiatan praktikum laboratorium',
                'amount' => 100000.00,
                'frequency' => 'semester',
                'payment_type' => 'mandatory',
                'applicable_grades' => [4, 5, 6], // Only for grades 4-6
                'is_active' => true,
                'allow_installments' => false,
                'max_installments' => 1,
            ],
            [
                'name' => 'Uang Wisuda',
                'description' => 'Biaya untuk acara wisuda atau kelulusan',
                'amount' => 300000.00,
                'frequency' => 'one_time',
                'payment_type' => 'mandatory',
                'applicable_grades' => [6], // Only for grade 6
                'is_active' => true,
                'allow_installments' => true,
                'max_installments' => 2,
            ],
            [
                'name' => 'Uang Seragam',
                'description' => 'Biaya untuk seragam sekolah',
                'amount' => 400000.00,
                'frequency' => 'yearly',
                'payment_type' => 'mandatory',
                'applicable_grades' => null,
                'is_active' => true,
                'allow_installments' => true,
                'max_installments' => 3,
            ],
            [
                'name' => 'Uang Study Tour',
                'description' => 'Biaya untuk kegiatan study tour atau karyawisata',
                'amount' => 750000.00,
                'frequency' => 'one_time',
                'payment_type' => 'optional',
                'applicable_grades' => [5, 6],
                'is_active' => true,
                'allow_installments' => true,
                'max_installments' => 3,
            ]
        ];

        foreach ($feeTypes as $feeType) {
            FeeType::create($feeType);
        }
    }
}
