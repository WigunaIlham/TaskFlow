<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#3B82F6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="TaskFlow">

    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json">

    <!-- Icons -->
    <link rel="icon" type="image/png" href="/pwa-192x192.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <!-- Splash Screens for iOS -->
    <link rel="apple-touch-startup-image" href="/splash-2048x2732.png"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">

    <title inertia>{{ config('app.name', 'TaskFlow') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

    <!-- PWA Install Prompt Container -->
    <div id="pwa-prompt"></div>

    <script>
    // Register beforeinstallprompt for older browsers
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(
                function(registration) {
                    console.log('ServiceWorker registration successful');
                },
                function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                }
            );
        });
    }
    </script>
</body>

</html>