<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('teacher_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('grade_id')->constrained('grades')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->string('academic_year', 9); // Format: 2024/2025
            $table->enum('semester', ['1', '2']);
            $table->enum('status', ['active', 'inactive', 'completed'])->default('active');
            $table->text('description')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['teacher_id', 'status']);
            $table->index(['grade_id', 'status']);
            $table->index(['academic_year', 'semester']);
        });

        // Junction table for class-student relationship
        Schema::create('class_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('teacher_classes')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->date('enrollment_date');
            $table->enum('status', ['active', 'inactive', 'transferred'])->default('active');
            $table->timestamps();

            // Prevent duplicate enrollments
            $table->unique(['class_id', 'student_id']);
            $table->index(['class_id', 'status']);
        });

        // Update attendance table to reference teacher_classes
        Schema::table('attendances', function (Blueprint $table) {
            $table->foreignId('class_id')->nullable()->constrained('teacher_classes')->onDelete('cascade');
            $table->index(['class_id', 'date']);
        });

        // Update activities table to reference teacher_classes  
        Schema::table('activities', function (Blueprint $table) {
            $table->foreignId('class_id')->nullable()->constrained('teacher_classes')->onDelete('cascade');
        });
    }

    public function down()
    {
        // Remove foreign key constraints first
        Schema::table('activities', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropColumn('class_id');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropColumn('class_id');
        });

        Schema::dropIfExists('class_students');
        Schema::dropIfExists('teacher_classes');
    }
};