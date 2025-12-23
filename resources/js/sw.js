// resources/js/sw.js
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("taskflow-v1").then((cache) => {
            return cache.addAll(["/", "/dashboard", "/offline"]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).catch(() => {
                    // Return offline page for navigation requests
                    if (event.request.mode === "navigate") {
                        return caches.match("/offline");
                    }
                })
            );
        })
    );
});

// Background sync for offline task creation
self.addEventListener("sync", (event) => {
    if (event.tag === "sync-tasks") {
        event.waitUntil(syncTasks());
    }
});

async function syncTasks() {
    const requests = await getPendingRequests();
    for (const request of requests) {
        try {
            await fetch(request.url, request.options);
            await deleteRequest(request.id);
        } catch (error) {
            console.error("Sync failed:", error);
        }
    }
}
