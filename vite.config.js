import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.js"],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon.png",
                "masked-icon.svg",
            ],
            manifest: {
                name: "TaskFlow - Task Management",
                short_name: "TaskFlow",
                description: "Aplikasi manajemen tugas kolaboratif",
                theme_color: "#3B82F6",
                background_color: "#ffffff",
                display: "standalone",
                orientation: "portrait",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
                shortcuts: [
                    {
                        name: "Dashboard",
                        short_name: "Dashboard",
                        description: "Go to Dashboard",
                        url: "/dashboard",
                        icons: [{ src: "/icon-96x96.png", sizes: "96x96" }],
                    },
                    {
                        name: "New Task",
                        short_name: "New Task",
                        description: "Create new task",
                        url: "/tasks/create",
                        icons: [{ src: "/icon-96x96.png", sizes: "96x96" }],
                    },
                ],
                categories: ["productivity", "business"],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
                navigateFallback: "/offline",
                navigateFallbackAllowlist: [/^\/dashboard/, /^\/tasks/, /^\/$/],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "gstatic-fonts-cache",
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "images-cache",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30,
                            },
                        },
                    },
                    // Cache untuk halaman Inertia (SPA)
                    {
                        urlPattern: ({ request, url }) => {
                            // Cache halaman utama dan dashboard
                            return (
                                url.pathname === "/" ||
                                url.pathname.startsWith("/dashboard") ||
                                url.pathname.startsWith("/tasks") ||
                                request.headers
                                    .get("accept")
                                    ?.includes("text/html")
                            );
                        },
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "pages-cache",
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 60 * 60 * 24, // 1 hari
                            },
                            networkTimeoutSeconds: 3, // Timeout untuk fallback ke cache
                        },
                    },
                    // Cache untuk API requests
                    {
                        urlPattern: ({ url }) => {
                            return (
                                url.pathname.startsWith("/api/") ||
                                url.pathname.startsWith("/sanctum/")
                            );
                        },
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "api-cache",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24, // 1 hari
                            },
                            networkTimeoutSeconds: 3,
                        },
                    },
                    // Cache untuk JS dan CSS assets
                    {
                        urlPattern: ({ request }) => {
                            return (
                                request.destination === "script" ||
                                request.destination === "style"
                            );
                        },
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "static-assets-cache",
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 minggu
                            },
                        },
                    },
                ],
            },
            devOptions: {
                enabled: true,
                type: "module",
                navigateFallback: "index.html",
            },
        }),
    ],
    resolve: {
        alias: {
            vue: "vue/dist/vue.esm-bundler.js",
        },
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
});
