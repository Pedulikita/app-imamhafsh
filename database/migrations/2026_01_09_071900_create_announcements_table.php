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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->enum('priority', ['low', 'normal', 'high'])->default('normal');
            $table->enum('target_audience', ['all', 'parents', 'teachers'])->default('all');
            $table->timestamp('published_at')->nullable();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['status', 'published_at']);
            $table->index('teacher_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};