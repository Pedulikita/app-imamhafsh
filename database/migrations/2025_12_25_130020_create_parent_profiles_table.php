<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('father_phone')->nullable();
            $table->string('mother_phone')->nullable();
            $table->string('father_email')->nullable();
            $table->string('mother_email')->nullable();
            $table->string('father_occupation')->nullable();
            $table->string('mother_occupation')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relation')->nullable();
            $table->json('notification_preferences')->nullable(); // SMS, Email, WhatsApp preferences
            $table->boolean('receive_grade_notifications')->default(true);
            $table->boolean('receive_attendance_notifications')->default(true);
            $table->boolean('receive_behavior_notifications')->default(true);
            $table->boolean('receive_announcement_notifications')->default(true);
            $table->timestamps();

            $table->index(['father_phone', 'mother_phone']);
            $table->index(['father_email', 'mother_email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_profiles');
    }
};