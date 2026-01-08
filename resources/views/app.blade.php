<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ $metaTitle ?? config('app.name', 'Imamhafsh.com') }}</title>
        
        <meta name="description" content="{{ $metaDescription ?? 'Website Resmi Imam Hafsh Islamic Boarding School' }}" />
        <meta property="og:title" content="{{ $metaTitle ?? config('app.name', 'Imamhafsh.com') }}" />
        <meta property="og:description" content="{{ $metaDescription ?? 'Website Resmi Imam Hafsh Islamic Boarding School' }}" />
        <meta property="og:image" content="{{ $metaImage ?? 'https://imamhafsh.com/images/logo.png' }}" />
        <meta property="og:image:secure_url" content="{{ $metaImage ?? 'https://imamhafsh.com/images/logo.png' }}" />
        <meta property="og:image:type" content="{{ $metaImageType ?? 'image/jpeg' }}" />
        <meta property="og:image:width" content="{{ $metaImageWidth ?? '1200' }}" />
        <meta property="og:image:height" content="{{ $metaImageHeight ?? '630' }}" />
        <meta property="og:image:alt" content="{{ $metaImageAlt ?? $metaTitle ?? config('app.name', 'Imamhafsh.com') }}" />
        <meta property="og:url" content="{{ $metaUrl ?? url()->current() }}" />
        <meta property="og:type" content="{{ isset($metaTitle) && $metaTitle !== config('app.name', 'Imamhafsh.com') ? 'article' : 'website' }}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{{ $metaTitle ?? config('app.name', 'Imamhafsh.com') }}" />
        <meta name="twitter:description" content="{{ $metaDescription ?? 'Website Resmi Imam Hafsh Islamic Boarding School' }}" />
        <meta name="twitter:image" content="{{ $metaImage ?? 'https://imamhafsh.com/images/logo.png' }}" />
        <meta name="twitter:image:alt" content="{{ $metaImageAlt ?? $metaTitle ?? config('app.name', 'Imamhafsh.com') }}" />
        
        <meta property="og:site_name" content="Imam Hafsh Islamic Boarding School" />
        <meta property="og:locale" content="id_ID" />
        
        <meta property="og:site_name" content="Imam Hafsh Islamic Boarding School" />
        <meta property="og:locale" content="id_ID" />

        

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Imamhafsh.com') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
