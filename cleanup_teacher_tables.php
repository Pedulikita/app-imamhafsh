<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Cleaning up database...\n";

try {
    DB::statement('SET FOREIGN_KEY_CHECKS=0');
    
    // Drop indexes if they exist
    try {
        DB::statement('DROP INDEX attendances_class_id_date_index ON attendances');
        echo "Dropped attendances index\n";
    } catch (Exception $e) {
        echo "Attendances index not found\n";
    }
    
    // Drop tables if they exist
    try {
        DB::statement('DROP TABLE IF EXISTS class_students');
        echo "Dropped class_students table\n";
    } catch (Exception $e) {
        echo "Class_students table not found\n";
    }
    
    try {
        DB::statement('DROP TABLE IF EXISTS teacher_classes');
        echo "Dropped teacher_classes table\n";
    } catch (Exception $e) {
        echo "Teacher_classes table not found\n";
    }
    
    
    // Drop columns if they exist
    try {
        DB::statement('ALTER TABLE attendances DROP COLUMN class_id');
        echo "Dropped class_id column from attendances\n";
    } catch (Exception $e) {
        echo "Class_id column not found in attendances\n";
    }
    
    try {
        DB::statement('ALTER TABLE activities DROP COLUMN class_id');
        echo "Dropped class_id column from activities\n";
    } catch (Exception $e) {
        echo "Class_id column not found in activities\n";
    }
    
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
    
    echo "Cleanup completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error during cleanup: " . $e->getMessage() . "\n";
}