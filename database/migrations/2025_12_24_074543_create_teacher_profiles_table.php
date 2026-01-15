<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('teacher_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nip')->unique()->nullable(); // Nomor Induk Pegawai
            $table->string('employee_id')->unique()->nullable(); // Employee ID
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('education_level')->nullable(); // S1, S2, S3
            $table->string('major')->nullable(); // Jurusan
            $table->enum('employment_status', ['permanent', 'contract', 'temporary', 'honorary'])->default('contract');
            $table->date('start_date')->nullable(); // Tanggal mulai kerja
            $table->json('certifications')->nullable(); // Sertifikasi yang dimiliki
            $table->json('teaching_subjects')->nullable(); // Mata pelajaran yang diampu
            $table->json('grade_levels_taught')->nullable(); // Tingkat kelas yang diajar
            $table->integer('max_classes_capacity')->default(5); // Maksimal kelas yang bisa diajar
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->string('profile_photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_profiles');
    }
};
