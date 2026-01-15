<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\EkstrakurikulerContent;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Gabungkan paragraph_1, paragraph_2, paragraph_3 jadi 1 content
        $p1 = EkstrakurikulerContent::where('key', 'paragraph_1')->first();
        $p2 = EkstrakurikulerContent::where('key', 'paragraph_2')->first();
        $p3 = EkstrakurikulerContent::where('key', 'paragraph_3')->first();
        
        if ($p1 || $p2 || $p3) {
            $content = '';
            if ($p1) $content .= '<p>' . $p1->value . '</p>';
            if ($p2) $content .= '<p>' . $p2->value . '</p>';
            if ($p3) $content .= '<p>' . $p3->value . '</p>';
            
            EkstrakurikulerContent::updateOrCreate(
                ['key' => 'content_description'],
                ['value' => $content]
            );
            
            // Hapus paragraph lama
            EkstrakurikulerContent::whereIn('key', ['paragraph_1', 'paragraph_2', 'paragraph_3'])->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Pisahkan kembali jika rollback
        $content = EkstrakurikulerContent::where('key', 'content_description')->first();
        
        if ($content) {
            // Extract paragraphs from HTML
            preg_match_all('/<p>(.*?)<\/p>/', $content->value, $matches);
            
            if (isset($matches[1][0])) {
                EkstrakurikulerContent::updateOrCreate(['key' => 'paragraph_1'], ['value' => $matches[1][0]]);
            }
            if (isset($matches[1][1])) {
                EkstrakurikulerContent::updateOrCreate(['key' => 'paragraph_2'], ['value' => $matches[1][1]]);
            }
            if (isset($matches[1][2])) {
                EkstrakurikulerContent::updateOrCreate(['key' => 'paragraph_3'], ['value' => $matches[1][2]]);
            }
            
            EkstrakurikulerContent::where('key', 'content_description')->delete();
        }
    }
};
