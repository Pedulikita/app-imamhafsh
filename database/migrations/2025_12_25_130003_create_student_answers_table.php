<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_attempt_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->text('answer_text')->nullable(); // Jawaban siswa
            $table->json('selected_options')->nullable(); // Untuk multiple choice
            $table->decimal('points_earned', 8, 2)->default(0);
            $table->boolean('is_correct')->nullable();
            $table->text('teacher_feedback')->nullable(); // Feedback guru untuk essay
            $table->datetime('answered_at')->nullable();
            $table->timestamps();

            $table->unique(['exam_attempt_id', 'question_id']);
            $table->index(['question_id', 'is_correct']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_answers');
    }
};