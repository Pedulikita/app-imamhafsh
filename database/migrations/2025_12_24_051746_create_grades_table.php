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
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->string('exam_type'); // UH, UTS, UAS, dll
            $table->decimal('score', 5, 2); // Nilai (0.00 - 100.00)
            $table->string('grade_letter')->nullable(); // A, B, C, D
            $table->text('notes')->nullable();
            $table->date('exam_date');
            $table->string('semester'); // Ganjil/Genap
            $table->year('academic_year');
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['student_id', 'subject_id', 'academic_year', 'semester']);
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
