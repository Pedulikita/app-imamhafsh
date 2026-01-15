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
            // Check if columns don't exist before adding
            if (!Schema::hasColumn('profile_pages', 'hero_image')) {
                $table->string('hero_image')->nullable()->after('image');
            }
            if (!Schema::hasColumn('profile_pages', 'content_image')) {
                $table->string('content_image')->nullable()->after('hero_image');
            }
            if (!Schema::hasColumn('profile_pages', 'content_thumbnail')) {
                $table->string('content_thumbnail')->nullable()->after('content_image');
            }
            if (!Schema::hasColumn('profile_pages', 'sidebar_image')) {
                $table->string('sidebar_image')->nullable()->after('content_thumbnail');
            }
            if (!Schema::hasColumn('profile_pages', 'sidebar_bg_color')) {
                $table->string('sidebar_bg_color')->nullable()->after('sidebar_image');
            }
            if (!Schema::hasColumn('profile_pages', 'sidebar_header_color')) {
                $table->string('sidebar_header_color')->nullable()->after('sidebar_bg_color');
            }
            if (!Schema::hasColumn('profile_pages', 'sidebar_title')) {
                $table->string('sidebar_title')->nullable()->after('sidebar_header_color');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profile_pages', function (Blueprint $table) {
            // Drop the added columns
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
