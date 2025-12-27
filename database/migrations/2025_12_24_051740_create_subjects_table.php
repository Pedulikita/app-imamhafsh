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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Kode mata pelajaran
            $table->string('name'); // Nama mata pelajaran
            $table->text('description')->nullable();
            $table->integer('credits')->default(1); // SKS
            $table->string('category')->nullable(); // Kategori (Wajib, Pilihan, dll)
            $table->string('class_level'); // Tingkat kelas (VII, VIII, IX)
            $table->enum('semester', ['ganjil', 'genap', 'both'])->default('both');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
