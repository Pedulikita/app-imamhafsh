<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Jam 1", "Istirahat 1"
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('order')->default(0);
            $table->enum('type', ['lesson', 'break', 'lunch'])->default('lesson');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['order', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_slots');
    }
};