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
        Schema::table('grades', function (Blueprint $table) {
            // Add teacher_class_id if it doesn't exist
            if (!Schema::hasColumn('grades', 'teacher_class_id')) {
                $table->foreignId('teacher_class_id')->nullable()->constrained()->onDelete('cascade');
            }
            
            // Add assessment_type if it doesn't exist
            if (!Schema::hasColumn('grades', 'assessment_type')) {
                $table->string('assessment_type')->nullable(); // 'quiz', 'uts', 'uas'
            }
            
            // Add assessment_date if it doesn't exist
            if (!Schema::hasColumn('grades', 'assessment_date')) {
                $table->date('assessment_date')->nullable();
            }
            
            // Add subject as string if it doesn't exist
            if (!Schema::hasColumn('grades', 'subject')) {
                $table->string('subject')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->dropColumn(['teacher_class_id', 'assessment_type', 'assessment_date', 'subject']);
        });
    }
};
