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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_class_id')->constrained()->onDelete('cascade');
            $table->string('subject'); // Subject name
            $table->string('assessment_type'); // 'quiz', 'uts', 'uas'
            $table->decimal('score', 5, 2); // Score out of 100
            $table->text('notes')->nullable(); // Optional teacher notes
            $table->date('assessment_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
