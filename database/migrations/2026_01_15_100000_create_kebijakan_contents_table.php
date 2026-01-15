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
        Schema::create('kebijakan_contents', function (Blueprint $table) {
            $table->id();
            $table->string('hero_badge')->nullable();
            $table->string('hero_title');
            $table->text('hero_subtitle')->nullable();
            $table->string('hero_image')->nullable();
            
            // Section 1: Introduction
            $table->string('intro_title')->nullable();
            $table->text('intro_content')->nullable();
            
            // Section 2: Anti Bullying
            $table->string('bullying_title')->nullable();
            $table->text('bullying_content')->nullable();
            $table->json('bullying_points')->nullable(); // Array of points
            $table->string('bullying_image')->nullable();
            
            // Section 3: Anti LGBT
            $table->string('lgbt_title')->nullable();
            $table->text('lgbt_content')->nullable();
            $table->json('lgbt_points')->nullable(); // Array of points
            $table->string('lgbt_image')->nullable();
            
            // Section 4: Safe Environment
            $table->string('environment_title')->nullable();
            $table->text('environment_content')->nullable();
            $table->json('environment_features')->nullable(); // Array of features
            $table->string('environment_image')->nullable();
            
            // Section 5: Commitment
            $table->string('commitment_title')->nullable();
            $table->text('commitment_content')->nullable();
            $table->json('commitment_items')->nullable(); // Array of commitment items
            
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kebijakan_contents');
    }
};
