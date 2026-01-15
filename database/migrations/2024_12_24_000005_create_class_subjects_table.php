<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends migration
{
    public function up(): void
    {
        Schema::create('class_subjects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('class_id');
            $table->unsignedBigInteger('subject_id');
            $table->unsignedBigInteger('teacher_id');
            $table->string('schedule')->nullable(); // e.g., "Monday 08:00-09:30"
            $table->timestamps();
            
            $table->foreign('class_id')->references('id')->on('student_classes')->onDelete('cascade');
            $table->foreign('subject_id')->references('id')->on('student_subjects')->onDelete('cascade');
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['class_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_subjects');
    }
};