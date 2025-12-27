<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('class_id');
            $table->date('enrollment_date');
            $table->enum('status', ['enrolled', 'completed', 'dropped'])->default('enrolled');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('class_id')->references('id')->on('student_classes')->onDelete('cascade');
            $table->index(['student_id', 'status']);
            $table->index(['class_id', 'status']);
            $table->index('enrollment_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_enrollments');
    }
};