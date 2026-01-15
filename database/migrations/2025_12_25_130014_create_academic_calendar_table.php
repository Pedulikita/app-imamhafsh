<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_calendar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable(); // null untuk event satu hari
            $table->enum('type', [
                'holiday', 
                'exam_period', 
                'semester_break', 
                'orientation', 
                'graduation',
                'event',
                'registration'
            ]);
            $table->string('color')->default('#3B82F6'); // Warna untuk kalender
            $table->boolean('is_school_day')->default(true); // Apakah hari sekolah atau libur
            $table->boolean('affects_schedule')->default(false); // Apakah mempengaruhi jadwal regular
            $table->timestamps();

            $table->index(['academic_year_id', 'type']);
            $table->index(['start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_calendar');
    }
};