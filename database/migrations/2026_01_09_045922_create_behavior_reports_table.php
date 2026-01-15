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
        Schema::create('behavior_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('behavior_category_id')->constrained()->onDelete('cascade');
            $table->string('title'); // Short title of the behavior
            $table->text('description'); // Detailed description
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('type', ['positive', 'negative', 'neutral'])->default('neutral');
            $table->date('incident_date');
            $table->time('incident_time')->nullable();
            $table->string('location')->nullable(); // Where the incident occurred
            $table->json('witnesses')->nullable(); // Array of witness names/IDs
            $table->text('context')->nullable(); // Additional context
            $table->text('immediate_action')->nullable(); // What was done immediately
            $table->text('follow_up_required')->nullable(); // Follow-up actions needed
            $table->boolean('parent_notified')->default(false);
            $table->timestamp('parent_notification_date')->nullable();
            $table->enum('status', ['draft', 'submitted', 'reviewed', 'closed'])->default('draft');
            $table->json('attachments')->nullable(); // File attachments
            $table->integer('points')->default(0); // Behavior points (positive or negative)
            $table->text('student_response')->nullable(); // Student's explanation/response
            $table->text('parent_response')->nullable(); // Parent's response
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['student_id', 'incident_date']);
            $table->index(['teacher_id', 'created_at']);
            $table->index(['status', 'created_at']);
            $table->index(['type', 'severity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('behavior_reports');
    }
};
