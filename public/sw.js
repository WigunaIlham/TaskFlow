// sw.js - Enhanced Service Worker for Laravel Inertia PWA

const CACHE_NAME = "taskflow-v1";
const OFFLINE_URL = "/offline"; // Make sure you have this route in Laravel

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    "/",
    "/offline",
    // Add other critical assets like your main CSS/JS files if needed
];

// Install event - precache critical assets
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installing...");

    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("[Service Worker] Caching app shell");
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log("[Service Worker] Install completed");
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activating...");

    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log(
                                "[Service Worker] Deleting old cache:",
                                cacheName
                            );
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log("[Service Worker] Now ready to handle fetches");
                return self.clients.claim();
            })
    );
});

// Fetch event - handle all network requests
self.addEventListener("fetch", (event) => {
    // Skip non-GET requests
    if (event.request.method !== "GET") return;

    // Skip Chrome extensions
    if (event.request.url.startsWith("chrome-extension://")) return;

    // For Inertia.js SPA, we need special handling
    const request = event.request;
    const url = new URL(request.url);

    // Strategy: Network First, Cache Fallback for HTML/API
    if (
        request.headers.get("Accept")?.includes("text/html") ||
        url.pathname.startsWith("/api/") ||
        url.pathname === "/"
    ) {
        event.respondWith(networkFirstWithOfflineFallback(request));
        return;
    }

    // Strategy: Cache First for static assets
    if (
        request.destination === "style" ||
        request.destination === "script" ||
        request.destination === "image" ||
        url.pathname.match(
            /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/
        )
    ) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Default: Network First for everything else
    event.respondWith(networkFirst(request));
});

// ========== CACHING STRATEGIES ==========

// Network First with Offline Fallback
async function networkFirstWithOfflineFallback(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);

        // Cache the successful response for future offline use
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log(
            "[Service Worker] Network failed, trying cache:",
            request.url
        );

        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // If it's a page request and we have no cache, show offline page
        if (request.headers.get("Accept")?.includes("text/html")) {
            const offlineResponse = await caches.match(OFFLINE_URL);
            if (offlineResponse) {
                return offlineResponse;
            }

            // If offline page is not cached, create a simple one
            return new Response(
                "<html><body><h1>You're Offline</h1><p>Please check your internet connection.</p></body></html>",
                {
                    status: 200,
                    statusText: "OK",
                    headers: { "Content-Type": "text/html" },
                }
            );
        }

        // For API requests, return error
        return new Response(
            JSON.stringify({ error: "Network error", offline: true }),
            {
                status: 503,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// Network First (without offline page fallback)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response("Network error", { status: 503 });
    }
}

// Cache First
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        console.log("[Service Worker] Serving from cache:", request.url);
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        // Cache the response for future use
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // For assets, we might want to return a placeholder
        if (request.destination === "image") {
            return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ccc"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#666">Image</text></svg>',
                {
                    headers: { "Content-Type": "image/svg+xml" },
                }
            );
        }

        return new Response("Asset not available offline", { status: 503 });
    }
}

// ========== BACKGROUND SYNC ==========

// Listen for background sync events
self.addEventListener("sync", (event) => {
    if (event.tag === "sync-offline-data") {
        console.log("[Service Worker] Background sync fired");
        event.waitUntil(syncOfflineData());
    }
});

async function syncOfflineData() {
    // Implement your offline data sync logic here
    console.log("[Service Worker] Syncing offline data...");
}

// ========== PUSH NOTIFICATIONS ==========

self.addEventListener("push", (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || "New notification from TaskFlow",
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        vibrate: [100, 50, 100],
        data: {
            url: data.url || "/",
        },
        actions: [
            {
                action: "open",
                title: "Open App",
            },
            {
                action: "dismiss",
                title: "Dismiss",
            },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title || "TaskFlow", options)
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.action === "open") {
        event.waitUntil(clients.openWindow(event.notification.data.url));
    }
});
