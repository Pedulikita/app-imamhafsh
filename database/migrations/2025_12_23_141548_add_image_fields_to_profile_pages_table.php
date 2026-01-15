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
        Schema::table('profile_pages', function (Blueprint $table) {
            $table->string('hero_image')->nullable()->after('image');
            $table->string('content_image')->nullable()->after('hero_image');
            $table->string('content_thumbnail')->nullable()->after('content_image');
            $table->string('sidebar_image')->nullable()->after('content_thumbnail');
            $table->string('sidebar_bg_color')->nullable()->after('sidebar_image');
            $table->string('sidebar_header_color')->nullable()->after('sidebar_bg_color');
            $table->string('sidebar_title')->nullable()->after('sidebar_header_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profile_pages', function (Blueprint $table) {
            $table->dropColumn([
                'hero_image',
                'content_image', 
                'content_thumbnail',
                'sidebar_image',
                'sidebar_bg_color',
                'sidebar_header_color',
                'sidebar_title'
            ]);
        });
    }
};
