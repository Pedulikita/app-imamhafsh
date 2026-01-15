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
        Schema::table('literasi_contents', function (Blueprint $table) {
            $table->string('features_title')->nullable()->after('main_content');
            $table->string('statistics_title')->nullable()->after('statistics');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('literasi_contents', function (Blueprint $table) {
            $table->dropColumn(['features_title', 'statistics_title']);
        });
    }
};
