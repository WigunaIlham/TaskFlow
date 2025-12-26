<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <!-- ==== PWA META TAGS (WAJIB) ==== -->
    <meta name="theme-color" content="#3b82f6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="TaskFlow">

    <!-- Manifest (WAJIB ADA) -->
    <link rel="manifest" href="/manifest.json" crossorigin="use-credentials">

    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="/favicon.ico">

    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png">

    <!-- Windows Tile -->
    <meta name="msapplication-TileColor" content="#3b82f6">
    <meta name="msapplication-TileImage" content="/icons/icon-144x144.png">

    <!-- Safari Pinned Tab -->
    <link rel="mask-icon" href="/icons/icon.svg" color="#3b82f6">

    <title inertia>{{ config('app.name', 'TaskFlow') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @inertiaHead

    <!-- PWA Script -->
    <script>
    // Cek dan register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    // Tangkap install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('✅ beforeinstallprompt event captured!');

        // Tampilkan tombol install setelah 3 detik
        setTimeout(() => {
            showInstallButton();
        }, 3000);
    });

    // Tampilkan tombol install
    function showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.innerHTML = '📱 Install App';
        installBtn.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 9999;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    animation: slideIn 0.5s ease;
                `;

        installBtn.onclick = async () => {
            if (!deferredPrompt) {
                alert('Install feature not available. Please wait or refresh.');
                return;
            }

            deferredPrompt.prompt();
            const {
                outcome
            } = await deferredPrompt.userChoice;
            console.log(`User ${outcome} the install prompt`);

            if (outcome === 'accepted') {
                installBtn.style.display = 'none';
            }

            deferredPrompt = null;
        };

        // Cek jika sudah diinstall
        if (!window.matchMedia('(display-mode: standalone)').matches) {
            document.body.appendChild(installBtn);
        }
    }

    // Animasi CSS
    const style = document.createElement('style');
    style.textContent = `
                @keyframes slideIn {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
    document.head.appendChild(style);
    </script>
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>