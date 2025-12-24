<!-- resources/js/Components/PWAInstallButton.vue -->
<template>
    <div v-if="showInstallButton" class="pwa-install-container">
        <!-- Tampilkan dengan Toast/Notification -->
        <div v-if="showAsToast" class="pwa-install-toast">
            <div class="toast-content">
                <div class="toast-icon">
                    <IconDownload class="w-6 h-6" />
                </div>
                <div class="toast-message">
                    <h4 class="font-semibold">Install TaskFlow App</h4>
                    <p class="text-sm opacity-80">
                        For better experience and offline access
                    </p>
                </div>
                <div class="toast-actions">
                    <button @click="installApp" class="btn-install">
                        Install
                    </button>
                    <button @click="dismissPrompt" class="btn-dismiss">
                        Later
                    </button>
                </div>
            </div>
        </div>

        <!-- Tampilkan sebagai Floating Button -->
        <div v-else class="pwa-floating-button">
            <button
                @click="installApp"
                class="floating-btn"
                title="Install App"
            >
                <IconDownload class="w-5 h-5" />
                <span class="floating-text">Install App</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { IconDownload } from "lucide-vue-next";

const props = defineProps({
    // Mode tampilan: 'toast' atau 'button'
    displayMode: {
        type: String,
        default: "toast",
        validator: (value) => ["toast", "button"].includes(value),
    },
    // Tunda tampilan (dalam milidetik)
    delay: {
        type: Number,
        default: 5000,
    },
    // Tampilkan di mobile saja?
    mobileOnly: {
        type: Boolean,
        default: true,
    },
});

const showInstallButton = ref(false);
const showAsToast = ref(props.displayMode === "toast");
const deferredPrompt = ref(null);
const isIOS = ref(false);
const isStandalone = ref(false);

// Cek apakah iOS
const checkIOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    isIOS.value = /iphone|ipad|ipod/.test(userAgent);
};

// Cek apakah sudah diinstall (standalone mode)
const checkStandalone = () => {
    isStandalone.value =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone ||
        document.referrer.includes("android-app://");
};

// Event handler untuk beforeinstallprompt
const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    deferredPrompt.value = e;

    // Cek apakah sudah pernah dismiss
    const lastDismissed = localStorage.getItem("pwa-install-dismissed");
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    if (!lastDismissed || parseInt(lastDismissed) < oneWeekAgo) {
        if (
            !props.mobileOnly ||
            (props.mobileOnly && window.innerWidth <= 768)
        ) {
            setTimeout(() => {
                showInstallButton.value = true;
            }, props.delay);
        }
    }
};

// Install aplikasi
const installApp = async () => {
    if (!deferredPrompt.value) {
        // Fallback untuk iOS
        if (isIOS.value) {
            showIOSInstructions();
            return;
        }
        return;
    }

    try {
        deferredPrompt.value.prompt();
        const { outcome } = await deferredPrompt.value.userChoice;

        console.log(`User ${outcome} the install prompt`);

        if (outcome === "accepted") {
            // Track installation success
            localStorage.setItem("pwa-installed", Date.now().toString());
        }

        // Reset prompt
        deferredPrompt.value = null;
        showInstallButton.value = false;
    } catch (error) {
        console.error("Install error:", error);
    }
};

// Dismiss prompt
const dismissPrompt = () => {
    showInstallButton.value = false;
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());

    // Sembunyikan untuk 7 hari
    setTimeout(() => {
        localStorage.removeItem("pwa-install-dismissed");
    }, 7 * 24 * 60 * 60 * 1000);
};

// Show iOS instructions
const showIOSInstructions = () => {
    if (window.app && window.app.config.globalProperties.$toast) {
        window.app.config.globalProperties.$toast.add({
            severity: "info",
            summary: "Install on iOS",
            detail: "Tap Share → Add to Home Screen",
            life: 10000,
        });
    } else {
        alert(
            'To install on iOS:\n1. Tap the Share button\n2. Scroll down\n3. Tap "Add to Home Screen"'
        );
    }
};

// Setup listeners
onMounted(() => {
    checkIOS();
    checkStandalone();

    // Hanya tampilkan jika belum diinstall
    if (!isStandalone.value) {
        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );

        // Juga cek apakah PWA bisa diinstall
        if ("getInstalledRelatedApps" in navigator) {
            navigator.getInstalledRelatedApps().then((apps) => {
                if (apps.length === 0) {
                    // App belum terinstall
                    console.log("PWA can be installed");
                }
            });
        }
    }

    // Listen untuk appinstalled event
    window.addEventListener("appinstalled", () => {
        console.log("App was installed");
        showInstallButton.value = false;
        isStandalone.value = true;
    });
});

onUnmounted(() => {
    window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
    );
});
</script>

<style scoped>
/* Toast Styling */
.pwa-install-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    left: 20px;
    max-width: 400px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.toast-content {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 12px;
}

.toast-icon {
    background: #3b82f6;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toast-message {
    flex: 1;
}

.toast-actions {
    display: flex;
    gap: 8px;
}

.btn-install {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-install:hover {
    background: #2563eb;
}

.btn-dismiss {
    background: #f3f4f6;
    color: #4b5563;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-dismiss:hover {
    background: #e5e7eb;
}

/* Floating Button Styling */
.pwa-floating-button {
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 9998;
}

.floating-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    position: relative;
}

.floating-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    width: auto;
    padding: 0 20px;
    border-radius: 28px;
}

.floating-text {
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    transition: max-width 0.3s ease;
    margin-left: 8px;
}

.floating-btn:hover .floating-text {
    max-width: 100px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .pwa-install-toast {
        background: #1f2937;
        color: white;
    }

    .btn-dismiss {
        background: #374151;
        color: #d1d5db;
    }

    .btn-dismiss:hover {
        background: #4b5563;
    }
}

/* Mobile responsive */
@media (max-width: 640px) {
    .pwa-install-toast {
        left: 10px;
        right: 10px;
        bottom: 10px;
    }

    .pwa-floating-button {
        bottom: 70px;
        right: 15px;
    }
}
</style>
