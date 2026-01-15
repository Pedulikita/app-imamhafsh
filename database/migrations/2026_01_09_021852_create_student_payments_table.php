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
        Schema::create('student_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('fee_type_id')->constrained()->onDelete('cascade');
            $table->string('payment_code')->unique(); // Unique payment reference
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('remaining_amount', 12, 2);
            $table->enum('status', ['pending', 'partial', 'paid', 'overdue', 'cancelled'])->default('pending');
            $table->date('due_date');
            $table->date('paid_date')->nullable();
            $table->string('academic_year', 9); // 2025/2026
            $table->enum('semester', ['1', '2'])->nullable();
            $table->integer('month')->nullable(); // For monthly payments (1-12)
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable(); // Additional payment info
            $table->timestamps();
            
            $table->index(['student_id', 'academic_year', 'semester']);
            $table->index(['status', 'due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_payments');
    }
};
