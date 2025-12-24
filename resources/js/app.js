import "./bootstrap";
import "../css/app.css";

import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

// PrimeVue Configuration
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";

// PrimeVue Components (Tree-shaking)
import Button from "primevue/button";
import Card from "primevue/card";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import ProgressSpinner from "primevue/progressspinner";
import Badge from "primevue/badge";
import Tag from "primevue/tag";
import Avatar from "primevue/avatar";
import Skeleton from "primevue/skeleton";
import Menubar from "primevue/menubar";
import Sidebar from "primevue/sidebar";
import Chip from "primevue/chip";
import SelectButton from "primevue/selectbutton";
import InputNumber from "primevue/inputnumber";
import ColorPicker from "primevue/colorpicker";
import InputSwitch from "primevue/inputswitch";

// Icons
import {
    Plus,
    CheckCircle,
    Clock,
    AlertCircle,
    Edit,
    Trash2,
    Users,
    Calendar as CalendarIcon,
    Bell,
    Search,
    Filter,
    Home,
    FolderKanban,
    User,
    LogOut,
    ChevronRight,
    MoreVertical,
    Star,
    Paperclip,
    MessageSquare,
    Eye,
    EyeOff,
    Download,
    Upload,
    Settings,
    HelpCircle,
} from "lucide-vue-next";

// PWA Service Worker Registration
import { registerSW } from "virtual:pwa-register";

// ============================
// OFFLINE DETECTION & FALLBACK
// ============================

// Fungsi untuk menampilkan indikator offline
function showOfflineIndicator() {
    if (!document.getElementById("offline-indicator")) {
        const indicator = document.createElement("div");
        indicator.id = "offline-indicator";
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #f56565;
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 9999;
            font-weight: bold;
            animation: slideDown 0.3s ease;
        `;
        indicator.innerHTML =
            "⚠️ You are currently offline. Some features may be limited.";
        document.body.appendChild(indicator);

        // Tambahkan animasi
        const style = document.createElement("style");
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
            @keyframes slideUp {
                from { transform: translateY(0); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideOfflineIndicator() {
    const indicator = document.getElementById("offline-indicator");
    if (indicator) {
        indicator.style.animation = "slideUp 0.3s ease";
        setTimeout(() => indicator.remove(), 300);
    }
}

// Setup online/offline detection
function setupOfflineDetection() {
    const updateOnlineStatus = () => {
        if (!navigator.onLine) {
            console.log("App is offline");
            showOfflineIndicator();

            // Jika tidak di halaman offline dan dalam mode offline, redirect ke halaman offline
            if (
                window.location.pathname !== "/offline" &&
                !window.isOnlineRetry
            ) {
                // Tunggu sebentar sebelum redirect untuk memberi kesempatan cache bekerja
                setTimeout(() => {
                    if (!navigator.onLine) {
                        window.isOnlineRetry = true;
                        window.location.href = "/offline";
                    }
                }, 1500);
            }
        } else {
            console.log("App is online");
            hideOfflineIndicator();
            window.isOnlineRetry = false;

            // Jika di halaman offline dan kembali online, reload ke halaman utama
            if (window.location.pathname === "/offline") {
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            }
        }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Inisialisasi status
    updateOnlineStatus();
}

// ============================
// PWA MANAGER CLASS
// ============================

class PWAManager {
    constructor() {
        this.updateSW = null;
        this.deferredPrompt = null;
        this.isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone ||
            document.referrer.includes("android-app://");

        this.init();
    }

    init() {
        // Setup offline detection terlebih dahulu
        setupOfflineDetection();

        // Register Service Worker
        this.updateSW = registerSW({
            onNeedRefresh() {
                console.log("New content available, refresh needed");

                // Show custom update notification
                const showUpdateNotification = () => {
                    if (
                        window.app &&
                        window.app.config.globalProperties.$toast
                    ) {
                        window.app.config.globalProperties.$toast.add({
                            severity: "info",
                            summary: "Update Available",
                            detail: "A new version is available. Click to update.",
                            life: 10000,
                            closable: true,
                            onClose: () => {
                                localStorage.setItem(
                                    "pwa-update-dismissed",
                                    new Date().toISOString()
                                );
                            },
                        });
                    } else {
                        // Fallback to browser confirm
                        if (confirm("New version available! Update now?")) {
                            if (this.updateSW) {
                                this.updateSW(true);
                            }
                        }
                    }
                };
                bind(this);

                // Only show if not dismissed in last 24 hours
                const lastDismissed = localStorage.getItem(
                    "pwa-update-dismissed"
                );
                if (
                    !lastDismissed ||
                    Date.now() - new Date(lastDismissed).getTime() >
                        24 * 60 * 60 * 1000
                ) {
                    showUpdateNotification();
                }
            },
            onOfflineReady() {
                console.log("App ready to work offline");

                // Simpan timestamp untuk offline cache
                localStorage.setItem(
                    "pwa-offline-ready",
                    new Date().toISOString()
                );

                // Show offline ready notification
                if (window.app && window.app.config.globalProperties.$toast) {
                    setTimeout(() => {
                        window.app.config.globalProperties.$toast.add({
                            severity: "success",
                            summary: "Offline Ready",
                            detail: "App is ready to work offline",
                            life: 3000,
                        });
                    }, 1000);
                }
            },
            onRegistered(registration) {
                console.log("Service Worker registered:", registration);

                // Simpan registration untuk akses nanti
                window.serviceWorkerRegistration = registration;

                // Periodically check for updates (every 1 hour)
                setInterval(() => {
                    if (registration) {
                        registration.update();
                    }
                }, 60 * 60 * 1000);
            },
            onRegisterError(error) {
                console.error("Service Worker registration error:", error);
            },
        });

        // Listen for beforeinstallprompt event
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log("Before install prompt fired");
            this.showInstallPrompt();
        });

        // Listen for appinstalled event
        window.addEventListener("appinstalled", () => {
            console.log("App installed successfully");
            this.deferredPrompt = null;
            this.isStandalone = true;

            // Track installation
            if (window.gtag) {
                window.gtag("event", "app_installed");
            }

            // Show success message
            if (window.app && window.app.config.globalProperties.$toast) {
                setTimeout(() => {
                    window.app.config.globalProperties.$toast.add({
                        severity: "success",
                        summary: "App Installed",
                        detail: "TaskFlow has been installed successfully!",
                        life: 5000,
                    });
                }, 1000);
            }
        });

        // Listen for controllerchange event (service worker updated)
        navigator.serviceWorker.addEventListener("controllerchange", () => {
            console.log("Service Worker controller changed");
            window.location.reload();
        });
    }

    showInstallPrompt() {
        // Only show once per session
        if (sessionStorage.getItem("install-prompt-shown")) return;

        setTimeout(() => {
            if (
                window.app &&
                window.app.config.globalProperties.$toast &&
                this.deferredPrompt
            ) {
                const toast = window.app.config.globalProperties.$toast.add({
                    severity: "info",
                    summary: "Install App",
                    detail: "Install TaskFlow for better experience",
                    life: 10000,
                    closable: true,
                    onClose: () => {
                        sessionStorage.setItem("install-prompt-shown", "true");
                    },
                });

                // Add click handler to trigger installation
                setTimeout(() => {
                    const toastElement =
                        document.querySelector(".p-toast-message");
                    if (toastElement) {
                        toastElement.addEventListener("click", async () => {
                            if (this.deferredPrompt) {
                                this.deferredPrompt.prompt();
                                const { outcome } = await this.deferredPrompt
                                    .userChoice;
                                console.log(
                                    `User ${outcome} the install prompt`
                                );
                                this.deferredPrompt = null;
                            }
                        });
                    }
                }, 100);
            }
        }, 5000); // Show after 5 seconds

        sessionStorage.setItem("install-prompt-shown", "true");
    }

    // Check if app is installed
    isAppInstalled() {
        return this.isStandalone;
    }

    // Manual update check
    async checkForUpdates() {
        if (this.updateSW) {
            return await this.updateSW();
        }
        return false;
    }

    // Get offline status
    isOffline() {
        return !navigator.onLine;
    }

    // Clear PWA caches
    async clearCaches() {
        if (window.serviceWorkerRegistration) {
            const cacheNames = await caches.keys();
            for (const cacheName of cacheNames) {
                await caches.delete(cacheName);
            }
            console.log("All caches cleared");
            return true;
        }
        return false;
    }
}

// Initialize PWA Manager
let pwaManager = null;

if (typeof window !== "undefined") {
    pwaManager = new PWAManager();

    // Make it available globally
    window.pwaManager = pwaManager;

    // Add service worker message listener
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.addEventListener("message", (event) => {
            console.log("Service Worker message:", event.data);

            if (event.data && event.data.type === "CACHE_UPDATED") {
                console.log("Cache updated, new content available");

                // Show update notification
                if (window.app && window.app.config.globalProperties.$toast) {
                    window.app.config.globalProperties.$toast.add({
                        severity: "info",
                        summary: "Content Updated",
                        detail: "New content has been cached for offline use",
                        life: 3000,
                    });
                }
            }
        });
    }
}

// ============================
// CREATE INERTIA APP
// ============================

createInertiaApp({
    title: (title) =>
        `${title} - ${import.meta.env.VITE_APP_NAME || "TaskFlow"}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob("./Pages/**/*.vue")
        ),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(PrimeVue, {
                theme: {
                    preset: Aura,
                    options: {
                        darkModeSelector: false,
                        cssLayer: {
                            name: "primevue",
                            order: "tailwind-base, primevue, tailwind-utilities",
                        },
                    },
                },
                ripple: true,
            })
            .use(ToastService)
            .use(ConfirmationService)
            .directive("tooltip", Tooltip);

        // Make app available globally for PWA manager
        window.app = app;

        // Register PrimeVue components
        const components = {
            Button,
            Card,
            Dialog,
            InputText,
            Textarea,
            Dropdown,
            Calendar,
            DataTable,
            Column,
            Toast,
            ConfirmDialog,
            ProgressSpinner,
            Badge,
            Tag,
            Avatar,
            Skeleton,
            Menubar,
            Sidebar,
            Chip,
            SelectButton,
            InputNumber,
            ColorPicker,
            InputSwitch,
        };

        Object.entries(components).forEach(([name, component]) => {
            app.component(`P${name}`, component);
        });

        // Register Lucide icons
        const icons = {
            IconPlus: Plus,
            IconCheck: CheckCircle,
            IconClock: Clock,
            IconAlert: AlertCircle,
            IconEdit: Edit,
            IconTrash: Trash2,
            IconUsers: Users,
            IconCalendar: CalendarIcon,
            IconBell: Bell,
            IconSearch: Search,
            IconFilter: Filter,
            IconHome: Home,
            IconFolderKanban: FolderKanban,
            IconUser: User,
            IconLogOut: LogOut,
            IconChevronRight: ChevronRight,
            IconMoreVertical: MoreVertical,
            IconStar: Star,
            IconPaperclip: Paperclip,
            IconMessageSquare: MessageSquare,
            IconEye: Eye,
            IconEyeOff: EyeOff,
            IconDownload: Download,
            IconUpload: Upload,
            IconSettings: Settings,
            IconHelpCircle: HelpCircle,
        };

        Object.entries(icons).forEach(([name, component]) => {
            app.component(name, component);
        });

        // Add PWA methods to global properties
        app.config.globalProperties.$pwa = {
            checkForUpdates: () =>
                pwaManager
                    ? pwaManager.checkForUpdates()
                    : Promise.resolve(false),
            isInstalled: () =>
                pwaManager ? pwaManager.isAppInstalled() : false,
            isOffline: () =>
                pwaManager ? pwaManager.isOffline() : !navigator.onLine,
            installApp: () => {
                if (pwaManager && pwaManager.deferredPrompt) {
                    return pwaManager.deferredPrompt.prompt();
                }
                return Promise.reject("Install prompt not available");
            },
            clearCaches: () =>
                pwaManager ? pwaManager.clearCaches() : Promise.resolve(false),
            // Helper untuk offline data
            saveOfflineData: (key, data) => {
                try {
                    localStorage.setItem(
                        `offline_${key}`,
                        JSON.stringify(data)
                    );
                    localStorage.setItem(
                        `offline_${key}_timestamp`,
                        new Date().toISOString()
                    );
                    return true;
                } catch (error) {
                    console.error("Error saving offline data:", error);
                    return false;
                }
            },
            getOfflineData: (key) => {
                try {
                    const data = localStorage.getItem(`offline_${key}`);
                    return data ? JSON.parse(data) : null;
                } catch (error) {
                    console.error("Error getting offline data:", error);
                    return null;
                }
            },
            hasOfflineData: (key) => {
                return localStorage.getItem(`offline_${key}`) !== null;
            },
        };

        // Mount aplikasi
        app.mount(el);

        // Send PWA ready event setelah semua komponen ter-mount
        setTimeout(() => {
            document.dispatchEvent(
                new CustomEvent("pwa-ready", {
                    detail: {
                        offlineReady:
                            localStorage.getItem("pwa-offline-ready") !== null,
                        isInstalled: pwaManager
                            ? pwaManager.isAppInstalled()
                            : false,
                        isOnline: navigator.onLine,
                    },
                })
            );

            // Log PWA status
            console.log("PWA Status:", {
                installed: pwaManager ? pwaManager.isAppInstalled() : false,
                offline: !navigator.onLine,
                serviceWorker: "serviceWorker" in navigator,
                standalone: pwaManager ? pwaManager.isStandalone : false,
            });
        }, 500);

        // Handle errors untuk offline mode
        app.config.errorHandler = (err, vm, info) => {
            console.error("Vue error:", err, info);

            // Jika error karena offline, tampilkan pesan
            if (
                err.message &&
                err.message.includes("Network") &&
                !navigator.onLine
            ) {
                if (window.app && window.app.config.globalProperties.$toast) {
                    window.app.config.globalProperties.$toast.add({
                        severity: "warn",
                        summary: "Offline Mode",
                        detail: "Network error. Working in offline mode.",
                        life: 5000,
                    });
                }
            }
        };
    },
});

// ============================
// GLOBAL OFFLINE HANDLERS
// ============================

// Handle page visibility change (untuk detect saat app dibuka kembali)
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && pwaManager) {
        // Cek koneksi saat app menjadi visible kembali
        if (navigator.onLine && window.location.pathname === "/offline") {
            // Redirect ke homepage jika kembali online dan di halaman offline
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        }
    }
});

// Handle sebelum unload (simpan state)
window.addEventListener("beforeunload", () => {
    // Simpan current URL untuk reload saat offline
    if (!navigator.onLine) {
        sessionStorage.setItem("last-offline-url", window.location.href);
    }
});

// Auto reload jika kembali online dan di halaman yang sama
if (sessionStorage.getItem("last-offline-url") && navigator.onLine) {
    const lastUrl = sessionStorage.getItem("last-offline-url");
    sessionStorage.removeItem("last-offline-url");

    // Jika masih di URL yang sama, reload untuk mendapatkan data terbaru
    if (lastUrl === window.location.href) {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}
