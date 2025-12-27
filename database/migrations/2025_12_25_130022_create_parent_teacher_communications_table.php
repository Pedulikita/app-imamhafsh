<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_teacher_communications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('subject');
            $table->text('message');
            $table->text('teacher_reply')->nullable();
            $table->enum('status', ['sent', 'read', 'replied', 'closed'])->default('sent');
            $table->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $table->enum('category', ['academic', 'behavior', 'health', 'general', 'complaint', 'request']);
            $table->datetime('replied_at')->nullable();
            $table->timestamps();

            $table->index(['parent_profile_id', 'status']);
            $table->index(['teacher_id', 'status']);
            $table->index(['student_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_teacher_communications');
    }
};