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
        Schema::create('home_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique(); // 'about', 'alasan', 'pendidikan', 'galeri', etc.
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('content')->nullable();
            $table->string('image')->nullable();
            $table->string('image_alt')->nullable();
            $table->string('badge_text')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_link')->nullable();
            $table->json('meta')->nullable(); // For additional flexible data
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_sections');
    }
};
