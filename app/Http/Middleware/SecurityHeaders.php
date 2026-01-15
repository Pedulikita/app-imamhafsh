<?php

/**
 * Comprehensive Security Headers Middleware
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Security Headers for Production
        if (app()->environment('production')) {
            $response->headers->set('X-Frame-Options', 'DENY');
            $response->headers->set('X-Content-Type-Options', 'nosniff');
            $response->headers->set('X-XSS-Protection', '1; mode=block');
            $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
            $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            
            // Content Security Policy
            $csp = "default-src 'self'; "
                 . "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                 . "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                 . "font-src 'self' https://fonts.gstatic.com; "
                 . "img-src 'self' data: https:; "
                 . "connect-src 'self';";
            
            $response->headers->set('Content-Security-Policy', $csp);
        }

        return $response;
    }
}