<?php
/**
 * Simple Deployment Webhook
 * Place this file on production server at public_html/deploy-webhook.php
 * Access via: https://imamhafsh.com/deploy-webhook.php?token=YOUR_SECRET_TOKEN
 */

// Security: Check token from URL parameter
$validToken = 'ImamHafshDeploy2026SecureToken'; // Change this to your secret token
$providedToken = $_GET['token'] ?? '';

if (!hash_equals($validToken, $providedToken)) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$logFile = __DIR__ . '/../deploy.log';

function log_message($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

log_message('=== Deployment Started ===');

$output = [];
$returnCode = 0;

// Get current directory
$currentDir = __DIR__;
log_message("Current directory: $currentDir");

// Step 1: Pull latest from main branch
log_message('Step 1: Git Pull');
$pullOutput = shell_exec('cd ' . escapeshellarg($currentDir) . ' && git fetch origin 2>&1 && git reset --hard origin/main 2>&1');
log_message($pullOutput);
$output[] = $pullOutput;

// Step 2: Clear Laravel cache
log_message('Step 2: Clear Laravel Cache');
$cacheOutput = shell_exec('cd ' . escapeshellarg($currentDir) . ' && php artisan cache:clear && php artisan view:clear && php artisan config:cache 2>&1');
log_message($cacheOutput);
$output[] = $cacheOutput;

// Step 3: Verify deployment
log_message('Step 3: Verify Deployment');
$gitStatus = shell_exec('cd ' . escapeshellarg($currentDir) . ' && git status 2>&1');
log_message($gitStatus);
$output[] = $gitStatus;

log_message('=== Deployment Complete ===\n');

// Return response
header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'message' => 'Deployment completed successfully',
    'output' => $output,
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);
?>
