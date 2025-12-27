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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'late', 'excused', 'sick'])->default('present');
            $table->time('time_in')->nullable();
            $table->time('time_out')->nullable();
            $table->text('notes')->nullable();
            $table->string('semester'); // Ganjil/Genap
            $table->year('academic_year');
            $table->timestamps();
            
            // Prevent duplicate attendance for same student, subject, and date
            $table->unique(['student_id', 'subject_id', 'date']);
            
            // Indexes for performance
            $table->index(['date', 'status']);
            $table->index(['student_id', 'academic_year', 'semester']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
