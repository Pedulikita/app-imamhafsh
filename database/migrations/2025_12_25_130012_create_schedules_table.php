<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_class_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('time_slot_id')->constrained()->onDelete('cascade');
            $table->foreignId('classroom_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
            $table->date('effective_from'); // Jadwal efektif mulai tanggal
            $table->date('effective_until')->nullable(); // Jadwal berlaku sampai tanggal (null = permanent)
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Constraint: tidak boleh ada jadwal yang bentrok
            $table->unique([
                'day_of_week', 
                'time_slot_id', 
                'classroom_id', 
                'effective_from'
            ], 'unique_schedule_slot');

            // Constraint: guru tidak boleh mengajar di waktu yang sama
            $table->index(['teacher_class_id', 'day_of_week', 'time_slot_id']);
            $table->index(['classroom_id', 'day_of_week', 'time_slot_id']);
            $table->index(['effective_from', 'effective_until']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};