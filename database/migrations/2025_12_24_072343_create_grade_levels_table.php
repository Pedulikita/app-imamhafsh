<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grade_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Grade 1, Grade 2, etc.
            $table->string('level'); // 1, 2, 3, etc.
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default grade levels
        DB::table('grade_levels')->insert([
            ['name' => 'Grade 1', 'level' => '1', 'description' => 'First Grade'],
            ['name' => 'Grade 2', 'level' => '2', 'description' => 'Second Grade'],
            ['name' => 'Grade 3', 'level' => '3', 'description' => 'Third Grade'],
            ['name' => 'Grade 4', 'level' => '4', 'description' => 'Fourth Grade'],
            ['name' => 'Grade 5', 'level' => '5', 'description' => 'Fifth Grade'],
            ['name' => 'Grade 6', 'level' => '6', 'description' => 'Sixth Grade'],
            ['name' => 'Grade 7', 'level' => '7', 'description' => 'Seventh Grade'],
            ['name' => 'Grade 8', 'level' => '8', 'description' => 'Eighth Grade'],
            ['name' => 'Grade 9', 'level' => '9', 'description' => 'Ninth Grade'],
            ['name' => 'Grade 10', 'level' => '10', 'description' => 'Tenth Grade'],
            ['name' => 'Grade 11', 'level' => '11', 'description' => 'Eleventh Grade'],
            ['name' => 'Grade 12', 'level' => '12', 'description' => 'Twelfth Grade'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_levels');
    }
};
