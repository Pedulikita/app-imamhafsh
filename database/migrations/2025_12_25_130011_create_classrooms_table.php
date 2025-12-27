<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Lab Komputer 1", "Kelas 7A"
            $table->string('code')->unique(); // e.g., "LC01", "7A"
            $table->text('description')->nullable();
            $table->integer('capacity')->default(30);
            $table->enum('type', ['regular', 'lab', 'library', 'hall', 'outdoor'])->default('regular');
            $table->json('facilities')->nullable(); // Fasilitas: ["projector", "ac", "wifi"]
            $table->string('building')->nullable();
            $table->string('floor')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['type', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};