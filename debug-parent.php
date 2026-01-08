<?php

// Simple debug script untuk check parent user
require 'bootstrap/app.php';

$app = $app ?? new \Illuminate\Foundation\Application($_ENV['APP_BASE_PATH'] ?? dirname(__DIR__));

// Database configuration
$host = 'localhost';
$db = 'u817493080_imamhafsh';
$user = 'u817493080_imamhafsh';
$pass = ':6eg|B4gnOTU';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    
    // Get parent user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute(['parent@imamhafsh.com']);
    $parentUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "=== PARENT USER ===\n";
    echo "ID: " . ($parentUser['id'] ?? 'NOT FOUND') . "\n";
    echo "Email: " . ($parentUser['email'] ?? 'N/A') . "\n";
    
    if ($parentUser) {
        // Check roles
        $stmt = $pdo->prepare("
            SELECT r.name FROM roles r
            INNER JOIN role_user ru ON r.id = ru.role_id
            WHERE ru.user_id = ?
        ");
        $stmt->execute([$parentUser['id']]);
        $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "Roles: " . implode(', ', array_map(fn($r) => $r['name'], $roles)) . "\n";
        
        // Check ParentProfile
        $stmt = $pdo->prepare("SELECT id FROM parent_profiles WHERE user_id = ?");
        $stmt->execute([$parentUser['id']]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "ParentProfile exists: " . ($profile ? 'YES (ID: ' . $profile['id'] . ')' : 'NO') . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
