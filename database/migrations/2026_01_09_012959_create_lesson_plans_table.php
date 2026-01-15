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
        Schema::create('lesson_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_class_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('lesson_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_minutes');
            $table->text('learning_objectives');
            $table->text('materials_needed')->nullable();
            $table->json('learning_activities'); // Array of activities with time allocations
            $table->text('assessment_methods')->nullable();
            $table->text('homework_assignment')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'published', 'completed', 'cancelled'])->default('draft');
            $table->json('attachments')->nullable(); // File attachments
            $table->text('reflection')->nullable(); // Post-lesson reflection
            $table->integer('attendance_count')->nullable();
            $table->boolean('is_template')->default(false);
            $table->timestamps();

            $table->index(['teacher_id', 'lesson_date']);
            $table->index(['teacher_class_id', 'status']);
            $table->index(['subject_id', 'lesson_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_plans');
    }
};
