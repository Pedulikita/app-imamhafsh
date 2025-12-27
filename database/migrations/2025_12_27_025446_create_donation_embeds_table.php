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
        Schema::create('donation_embeds', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->string('embed_url');
            $table->string('direct_url');
            $table->decimal('collected_amount', 15, 2)->default(0);
            $table->decimal('target_amount', 15, 2);
            $table->string('currency', 3)->default('IDR');
            $table->integer('donors_count')->default(0);
            $table->string('image_url')->nullable();
            $table->text('additional_info')->nullable();
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
        Schema::dropIfExists('donation_embeds');
    }
};
