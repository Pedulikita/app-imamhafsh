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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique(); // NIS/NISN
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->date('birth_date');
            $table->string('birth_place');
            $table->enum('gender', ['male', 'female']);
            $table->text('address');
            $table->string('phone')->nullable();
            $table->string('parent_name');
            $table->string('parent_phone');
            $table->string('parent_email')->nullable();
            $table->string('class');
            $table->year('academic_year');
            $table->date('enrollment_date');
            $table->enum('status', ['active', 'inactive', 'graduated', 'transferred'])->default('active');
            $table->string('photo')->nullable();
            $table->json('emergency_contacts')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
