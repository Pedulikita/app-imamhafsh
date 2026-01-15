<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 20)->unique();
            $table->text('description')->nullable();
            $table->integer('credits')->default(1);
            $table->unsignedBigInteger('teacher_id')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['status', 'teacher_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_subjects');
    }
};