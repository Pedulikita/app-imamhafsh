<?php
/**
 * Test Social Sharing Meta Tags
 * Debug script untuk mengecek meta tags dan image URL untuk social sharing
 */

// Get article slug from query parameter
$slug = $_GET['slug'] ?? 'test';
$baseUrl = 'https://imamhafsh.com';
$testUrl = "$baseUrl/articles/$slug";

// Simulate what social media crawlers see
$headers = get_headers($testUrl, 1);
$html = file_get_contents($testUrl);

// Extract meta tags
preg_match('/<meta property="og:image" content="([^"]+)"/', $html, $ogImage);
preg_match('/<meta property="og:image:secure_url" content="([^"]+)"/', $html, $ogSecureUrl);
preg_match('/<meta property="og:title" content="([^"]+)"/', $html, $ogTitle);
preg_match('/<meta property="og:url" content="([^"]+)"/', $html, $ogUrl);
preg_match('/<meta name="twitter:image" content="([^"]+)"/', $html, $twitterImage);

echo "=== Social Sharing Meta Tags Checker ===\n\n";
echo "Testing Article: $testUrl\n\n";

if (!empty($ogImage[1])) {
    echo "✓ Open Graph Image Found:\n";
    echo "  URL: " . $ogImage[1] . "\n";
    
    // Check if image is accessible
    $imageHeaders = get_headers($ogImage[1], 1);
    $imageExists = (isset($imageHeaders[0]) && strpos($imageHeaders[0], '200') !== false);
    echo "  Accessible: " . ($imageExists ? "✓ YES" : "✗ NO") . "\n";
    echo "  Content-Type: " . ($imageHeaders['Content-Type'] ?? 'Unknown') . "\n\n";
} else {
    echo "✗ Open Graph Image NOT Found\n\n";
}

if (!empty($ogSecureUrl[1])) {
    echo "✓ OG Secure Image URL Found:\n";
    echo "  URL: " . $ogSecureUrl[1] . "\n\n";
}

if (!empty($ogTitle[1])) {
    echo "✓ OG Title: " . $ogTitle[1] . "\n";
}

if (!empty($ogUrl[1])) {
    echo "✓ OG URL: " . $ogUrl[1] . "\n";
}

if (!empty($twitterImage[1])) {
    echo "✓ Twitter Image: " . $twitterImage[1] . "\n";
}

echo "\n=== Test URLs for Social Sharing ===\n";
echo "Facebook: https://developers.facebook.com/tools/debug/?url=" . urlencode($testUrl) . "\n";
echo "Twitter: https://cards-dev.twitter.com/validator\n";
echo "LinkedIn: https://www.linkedin.com/feed/\n";
echo "WhatsApp: https://wa.me/?text=" . urlencode($testUrl) . "\n";
?>
