<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_class_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('subject');
            $table->enum('type', ['quiz', 'mid_exam', 'final_exam', 'assignment']);
            $table->integer('duration_minutes'); // Durasi ujian dalam menit
            $table->integer('total_questions')->default(0);
            $table->decimal('total_points', 8, 2)->default(0);
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->boolean('is_published')->default(false);
            $table->boolean('show_results')->default(true); // Tampilkan hasil setelah selesai
            $table->boolean('allow_retake')->default(false); // Izinkan mengulang
            $table->integer('max_attempts')->default(1); // Maksimal percobaan
            $table->json('settings')->nullable(); // Pengaturan tambahan (shuffle questions, etc)
            $table->timestamps();

            $table->index(['teacher_class_id', 'subject']);
            $table->index(['start_time', 'end_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};