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
        Schema::create('payment_installments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_payment_id')->constrained()->onDelete('cascade');
            $table->integer('installment_number');
            $table->decimal('amount', 12, 2);
            $table->date('due_date');
            $table->date('paid_date')->nullable();
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');
            $table->string('payment_method')->nullable(); // cash, bank_transfer, e_wallet, etc
            $table->string('reference_number')->nullable(); // Bank reference, receipt number, etc
            $table->foreignId('recorded_by')->nullable()->constrained('users'); // Staff who recorded payment
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['student_payment_id', 'installment_number']);
            $table->index(['status', 'due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_installments');
    }
};
