// Service Worker untuk TaskFlow
const CACHE_NAME = "taskflow-v1.0";
const urlsToCache = [
    "/",
    "/manifest.json",
    "/favicon.ico",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

// Install event
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installing...");
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("[Service Worker] Caching app shell");
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log("[Service Worker] Install completed");
                return self.skipWaiting();
            })
    );
});

// Activate event
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

// Fetch event
self.addEventListener("fetch", (event) => {
    // Skip non-GET requests
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                console.log(
                    "[Service Worker] Serving from cache:",
                    event.request.url
                );
                return response;
            }

            // Not in cache - fetch from network
            return fetch(event.request)
                .then((response) => {
                    // Check if we received a valid response
                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type !== "basic"
                    ) {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Add to cache for future visits
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                })
                .catch((error) => {
                    console.log("[Service Worker] Fetch failed:", error);
                    // You could return a custom offline page here
                });
        })
    );
});
