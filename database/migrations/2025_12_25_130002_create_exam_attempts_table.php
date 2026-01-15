<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->integer('attempt_number')->default(1);
            $table->datetime('started_at');
            $table->datetime('submitted_at')->nullable();
            $table->datetime('expires_at'); // Kapan attempt ini kedaluwarsa
            $table->decimal('score', 8, 2)->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->enum('status', ['in_progress', 'submitted', 'expired', 'graded'])->default('in_progress');
            $table->integer('time_spent_minutes')->default(0); // Waktu yang dihabiskan
            $table->json('metadata')->nullable(); // Data tambahan (IP, browser, etc)
            $table->timestamps();

            $table->unique(['exam_id', 'student_id', 'attempt_number']);
            $table->index(['student_id', 'status']);
            $table->index(['exam_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_attempts');
    }
};