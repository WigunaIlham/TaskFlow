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

// PWA
import { registerSW } from "virtual:pwa-register";

// Register PWA
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("A new version is available! Refresh now?")) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log("App ready to work offline");
    },
});

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
            .use(ZiggyVue)
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

        app.mount(el);
    },
});
