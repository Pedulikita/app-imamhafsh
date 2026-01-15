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
        Schema::create('behavior_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Positive', 'Negative', 'Neutral'
            $table->string('display_name'); // e.g., 'Perilaku Positif'
            $table->string('color')->default('#10B981'); // Color for UI display
            $table->string('icon')->nullable(); // Icon class for UI
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('behavior_categories');
    }
};
