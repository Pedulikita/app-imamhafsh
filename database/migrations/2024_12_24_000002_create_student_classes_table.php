<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('grade', 20);
            $table->integer('academic_year');
            $table->integer('capacity')->default(30);
            $table->integer('current_students')->default(0);
            $table->unsignedBigInteger('homeroom_teacher_id')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->foreign('homeroom_teacher_id')->references('id')->on('users')->onDelete('set null');
            $table->unique(['name', 'academic_year']);
            $table->index(['grade', 'academic_year']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_classes');
    }
};