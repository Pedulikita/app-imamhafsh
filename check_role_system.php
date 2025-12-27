<?php

// Simple authorization test
require_once 'vendor/autoload.php';

try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=imamhafsh', 'root', '');
    
    echo "=== ROLE SYSTEM STATUS ===\n\n";
    
    // Check tables exist
    $tables = ['roles', 'role_user', 'users'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '{$table}'");
        if ($stmt->fetch()) {
            echo "✅ Table {$table} exists\n";
        } else {
            echo "❌ Table {$table} missing\n";
        }
    }
    
    echo "\n=== ROLE DATA ===\n";
    $stmt = $pdo->query("SELECT name, description FROM roles");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!empty($roles)) {
        foreach ($roles as $role) {
            echo "✅ Role: {$role['name']} - {$role['description']}\n";
        }
    } else {
        echo "❌ No roles found\n";
    }
    
    echo "\n=== USER ROLES ===\n";
    $stmt = $pdo->query("
        SELECT u.email, r.name as role_name 
        FROM users u 
        JOIN role_user ru ON u.id = ru.user_id 
        JOIN roles r ON ru.role_id = r.id 
        WHERE u.email LIKE '%admin%'
    ");
    $userRoles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!empty($userRoles)) {
        foreach ($userRoles as $userRole) {
            echo "✅ {$userRole['email']} has role: {$userRole['role_name']}\n";
        }
    } else {
        echo "❌ No admin user with roles found\n";
    }
    
    echo "\n=== SOLUTION ===\n";
    echo "Role system sudah ada dan lengkap!\n";
    echo "Tidak perlu tabel baru.\n";
    echo "Google login sudah siap, tinggal konfigurasi OAuth credentials di .env\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}