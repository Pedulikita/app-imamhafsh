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
        Schema::table('teacher_classes', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['grade_id']);
            
            // Add the new foreign key constraint to grade_levels table
            $table->foreign('grade_id')->references('id')->on('grade_levels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teacher_classes', function (Blueprint $table) {
            // Drop the grade_levels foreign key
            $table->dropForeign(['grade_id']);
            
            // Restore the original grades foreign key
            $table->foreign('grade_id')->references('id')->on('grades')->onDelete('cascade');
        });
    }
};
