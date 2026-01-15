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
        Schema::table('students', function (Blueprint $table) {
            // Kolom untuk sistem monitoring performance
            $table->enum('performance_status', ['excellent', 'good', 'satisfactory', 'needs_attention'])->nullable()->after('status');
            $table->decimal('average_grade', 5, 2)->nullable()->after('performance_status');
            $table->decimal('attendance_rate', 5, 2)->nullable()->after('average_grade');
            $table->integer('total_grades')->default(0)->after('attendance_rate');
            
            // Kolom class_id untuk relasi dengan student_classes (optional)
            $table->unsignedBigInteger('class_id')->nullable()->after('total_grades');
            
            // Foreign key jika tabel student_classes ada
            // $table->foreign('class_id')->references('id')->on('student_classes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Hapus kolom monitoring
            $table->dropColumn([
                'performance_status',
                'average_grade', 
                'attendance_rate',
                'total_grades',
                'class_id'
            ]);
        });
    }
};
