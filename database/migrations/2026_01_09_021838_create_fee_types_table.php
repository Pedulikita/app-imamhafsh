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
        Schema::create('fee_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // SPP, Uang Buku, Uang Kegiatan, etc
            $table->text('description')->nullable();
            $table->decimal('amount', 12, 2); // Amount in Rupiah
            $table->enum('frequency', ['monthly', 'semester', 'yearly', 'one_time'])->default('monthly');
            $table->enum('payment_type', ['mandatory', 'optional'])->default('mandatory');
            $table->json('applicable_grades')->nullable(); // Which grades this fee applies to
            $table->boolean('is_active')->default(true);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->boolean('allow_installments')->default(true);
            $table->integer('max_installments')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_types');
    }
};
