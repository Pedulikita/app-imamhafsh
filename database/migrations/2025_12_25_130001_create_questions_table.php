<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->text('question_text');
            $table->enum('type', ['multiple_choice', 'essay', 'true_false', 'fill_blank']);
            $table->json('options')->nullable(); // Untuk multiple choice: ["A" => "jawaban1", "B" => "jawaban2"]
            $table->text('correct_answer')->nullable(); // Jawaban benar
            $table->decimal('points', 8, 2)->default(1); // Poin per soal
            $table->text('explanation')->nullable(); // Penjelasan jawaban
            $table->string('image')->nullable(); // Gambar soal
            $table->integer('order')->default(0); // Urutan soal
            $table->timestamps();

            $table->index(['exam_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};