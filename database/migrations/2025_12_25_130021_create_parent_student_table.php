<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->enum('relation', ['father', 'mother', 'guardian', 'step_parent', 'grandparent', 'other']);
            $table->boolean('is_primary_contact')->default(false);
            $table->boolean('can_pickup')->default(true);
            $table->boolean('emergency_contact')->default(false);
            $table->timestamps();

            $table->unique(['parent_profile_id', 'student_id']);
            $table->index(['student_id', 'is_primary_contact']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_student');
    }
};