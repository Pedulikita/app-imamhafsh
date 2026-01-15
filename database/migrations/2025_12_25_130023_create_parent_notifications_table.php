<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->enum('type', [
                'grade_update', 
                'attendance_alert', 
                'behavior_report', 
                'exam_result', 
                'assignment_due', 
                'announcement', 
                'payment_reminder',
                'schedule_change'
            ]);
            $table->json('data')->nullable(); // Additional data for the notification
            $table->boolean('is_read')->default(false);
            $table->datetime('read_at')->nullable();
            $table->boolean('is_sent')->default(false); // For tracking if SMS/Email was sent
            $table->json('delivery_status')->nullable(); // Track SMS, Email, Push delivery status
            $table->timestamps();

            $table->index(['parent_profile_id', 'is_read']);
            $table->index(['student_id', 'type']);
            $table->index(['created_at', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_notifications');
    }
};