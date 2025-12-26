import "./bootstrap";
import "../css/app.css";

import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ZiggyVue } from "../../vendor/tightenco/ziggy";

// PrimeVue Configuration
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";

// PrimeVue Components
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

// Icons (hanya yang penting)
import { Plus, CheckCircle, Edit, Trash2, Home, User } from "lucide-vue-next";

createInertiaApp({
    title: (title) => `${title} - TaskFlow`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob("./Pages/**/*.vue")
        ),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(PrimeVue, {
                theme: {
                    preset: Aura,
                },
                ripple: true,
            })
            .use(ToastService)
            .use(ConfirmationService)
            .directive("tooltip", Tooltip);

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
        };

        Object.entries(components).forEach(([name, component]) => {
            app.component(`P${name}`, component);
        });

        // Register icons
        const icons = {
            IconPlus: Plus,
            IconCheck: CheckCircle,
            IconEdit: Edit,
            IconTrash: Trash2,
            IconHome: Home,
            IconUser: User,
        };

        Object.entries(icons).forEach(([name, component]) => {
            app.component(name, component);
        });

        app.mount(el);

        // Log PWA status
        console.log("PWA Status:", {
            isInstalled: window.matchMedia("(display-mode: standalone)")
                .matches,
            isOnline: navigator.onLine,
            hasServiceWorker: "serviceWorker" in navigator,
            hasManifest: !!document.querySelector('link[rel="manifest"]'),
        });
    },
});
