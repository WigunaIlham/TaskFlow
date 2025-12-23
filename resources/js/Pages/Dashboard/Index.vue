<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
        <!-- Navbar -->
        <nav
            class="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <!-- Logo & Brand -->
                    <div class="flex items-center">
                        <div class="flex-shrink-0 flex items-center">
                            <div
                                class="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                            >
                                <i class="pi pi-rocket text-white"></i>
                            </div>
                            <span
                                class="ml-3 text-xl font-bold text-gray-800 dark:text-white"
                                >TaskFlow</span
                            >
                        </div>

                        <!-- Navigation Links -->
                        <div class="hidden md:ml-10 md:flex md:space-x-6">
                            <a
                                href="/dashboard"
                                class="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium"
                            >
                                <i class="pi pi-home mr-2"></i>Dashboard
                            </a>
                            <a
                                href="/kanban"
                                class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                            >
                                <i class="pi pi-kanban mr-2"></i>Kanban
                            </a>
                            <a
                                href="#"
                                class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                            >
                                <i class="pi pi-calendar mr-2"></i>Calendar
                            </a>
                            <a
                                href="#"
                                class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                            >
                                <i class="pi pi-chart-bar mr-2"></i>Analytics
                            </a>
                        </div>
                    </div>

                    <!-- Right Section -->
                    <div class="flex items-center space-x-4">
                        <!-- Search -->
                        <div class="hidden md:block">
                            <div class="relative">
                                <div
                                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                >
                                    <i class="pi pi-search text-gray-400"></i>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                />
                            </div>
                        </div>

                        <!-- Notifications -->
                        <button
                            class="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <i class="pi pi-bell text-lg"></i>
                            <span
                                class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"
                            ></span>
                        </button>

                        <!-- Profile Dropdown -->
                        <div class="relative" ref="profileDropdown">
                            <button
                                @click="toggleProfileDropdown"
                                class="flex items-center space-x-3 focus:outline-none"
                            >
                                <div
                                    class="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold"
                                >
                                    {{ userInitials }}
                                </div>
                                <div class="hidden md:block text-left">
                                    <p
                                        class="text-sm font-medium text-gray-800 dark:text-white"
                                    >
                                        {{ $page.props.auth.user.name }}
                                    </p>
                                    <p
                                        class="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        User
                                    </p>
                                </div>
                                <i class="pi pi-chevron-down text-gray-500"></i>
                            </button>

                            <!-- Dropdown Menu -->
                            <div
                                v-if="showProfileDropdown"
                                class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                            >
                                <div
                                    class="p-4 border-b border-gray-100 dark:border-gray-700"
                                >
                                    <p
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        {{ $page.props.auth.user.name }}
                                    </p>
                                    <p
                                        class="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        {{ $page.props.auth.user.email }}
                                    </p>
                                </div>

                                <div class="py-2">
                                    <a
                                        href="/profile"
                                        class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <i class="pi pi-user mr-3"></i>My
                                        Profile
                                    </a>
                                    <a
                                        href="/settings"
                                        class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <i class="pi pi-cog mr-3"></i>Settings
                                    </a>
                                    <a
                                        href="/help"
                                        class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <i
                                            class="pi pi-question-circle mr-3"
                                        ></i
                                        >Help & Support
                                    </a>
                                </div>

                                <div
                                    class="py-2 border-t border-gray-100 dark:border-gray-700"
                                >
                                    <button
                                        @click="logout"
                                        class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <i class="pi pi-sign-out mr-3"></i>Sign
                                        out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Welcome Section -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {{ $page.props.auth.user.name }}! 👋
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                    Here's what's happening with your tasks today.
                </p>
            </div>

            <!-- Stats Grid -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <div
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Total Tasks
                            </p>
                            <p
                                class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                            >
                                42
                            </p>
                        </div>
                        <div
                            class="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center"
                        >
                            <i
                                class="pi pi-inbox text-blue-600 dark:text-blue-400 text-xl"
                            ></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="flex items-center text-sm text-green-600">
                            <i class="pi pi-arrow-up mr-1"></i>
                            <span>12% from last week</span>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Completed
                            </p>
                            <p
                                class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                            >
                                28
                            </p>
                        </div>
                        <div
                            class="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center"
                        >
                            <i
                                class="pi pi-check-circle text-green-600 dark:text-green-400 text-xl"
                            ></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div
                            class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                        >
                            <div
                                class="bg-green-500 h-2 rounded-full"
                                style="width: 67%"
                            ></div>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                In Progress
                            </p>
                            <p
                                class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                            >
                                9
                            </p>
                        </div>
                        <div
                            class="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center"
                        >
                            <i
                                class="pi pi-clock text-orange-600 dark:text-orange-400 text-xl"
                            ></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            <i class="pi pi-users mr-1"></i>
                            <span>3 people working</span>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Due Soon
                            </p>
                            <p
                                class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                            >
                                5
                            </p>
                        </div>
                        <div
                            class="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center"
                        >
                            <i
                                class="pi pi-exclamation-triangle text-red-600 dark:text-red-400 text-xl"
                            ></i>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="text-sm text-red-600 flex items-center">
                            <i class="pi pi-calendar-times mr-1"></i>
                            <span>Next 2 days</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column: Recent Tasks & Quick Actions -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- Recent Tasks -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <div class="flex items-center justify-between mb-6">
                            <h2
                                class="text-xl font-bold text-gray-900 dark:text-white"
                            >
                                Recent Tasks
                            </h2>
                            <a
                                href="/kanban"
                                class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                            >
                                View All
                            </a>
                        </div>

                        <div class="space-y-4">
                            <div
                                v-for="task in recentTasks"
                                :key="task.id"
                                class="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div class="flex items-center space-x-4">
                                    <div
                                        :class="task.statusClass"
                                        class="h-10 w-10 rounded-lg flex items-center justify-center"
                                    >
                                        <i :class="task.icon"></i>
                                    </div>
                                    <div>
                                        <h3
                                            class="font-medium text-gray-900 dark:text-white"
                                        >
                                            {{ task.title }}
                                        </h3>
                                        <p
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            {{ task.project }}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="text-right">
                                        <p
                                            class="text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            {{ task.dueDate }}
                                        </p>
                                        <p
                                            class="text-xs text-gray-500 dark:text-gray-400"
                                        >
                                            Due date
                                        </p>
                                    </div>
                                    <div
                                        :class="task.priorityClass"
                                        class="px-3 py-1 rounded-full text-xs font-medium"
                                    >
                                        {{ task.priority }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add New Task -->
                        <div
                            class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700"
                        >
                            <button
                                @click="goToKanban"
                                class="w-full flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
                            >
                                <i class="pi pi-plus"></i>
                                <span class="font-medium">Add New Task</span>
                            </button>
                        </div>
                    </div>

                    <!-- Activity Timeline -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <h2
                            class="text-xl font-bold text-gray-900 dark:text-white mb-6"
                        >
                            Recent Activity
                        </h2>

                        <div class="space-y-6">
                            <div
                                v-for="activity in activities"
                                :key="activity.id"
                                class="flex items-start space-x-4"
                            >
                                <div
                                    :class="activity.iconBg"
                                    class="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                >
                                    <i
                                        :class="
                                            activity.icon +
                                            ' ' +
                                            activity.iconColor
                                        "
                                    ></i>
                                </div>
                                <div class="flex-1">
                                    <p class="text-gray-900 dark:text-white">
                                        {{ activity.description }}
                                    </p>
                                    <p
                                        class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                                    >
                                        {{ activity.time }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Profile & Quick Stats -->
                <div class="space-y-8">
                    <!-- Profile Card -->
                    <div
                        class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
                    >
                        <div class="flex items-center space-x-4 mb-6">
                            <div
                                class="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl font-bold"
                            >
                                {{ userInitials }}
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">
                                    {{ $page.props.auth.user.name }}
                                </h3>
                                <p class="text-blue-100">
                                    Senior Project Manager
                                </p>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-blue-100">Member since</span>
                                <span class="font-medium">2024</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-blue-100"
                                    >Tasks completed</span
                                >
                                <span class="font-medium">142</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-blue-100">Productivity</span>
                                <span class="font-medium">92%</span>
                            </div>
                        </div>

                        <button
                            @click="goToProfile"
                            class="w-full mt-6 bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 rounded-xl transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>

                    <!-- Quick Actions -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <h2
                            class="text-xl font-bold text-gray-900 dark:text-white mb-6"
                        >
                            Quick Actions
                        </h2>

                        <div class="grid grid-cols-2 gap-4">
                            <button
                                @click="createTask"
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                                <i class="pi pi-plus text-2xl mb-2"></i>
                                <span class="text-sm font-medium"
                                    >New Task</span
                                >
                            </button>

                            <button
                                @click="inviteTeam"
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                            >
                                <i class="pi pi-users text-2xl mb-2"></i>
                                <span class="text-sm font-medium"
                                    >Invite Team</span
                                >
                            </button>

                            <button
                                @click="exportReport"
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                            >
                                <i class="pi pi-download text-2xl mb-2"></i>
                                <span class="text-sm font-medium">Export</span>
                            </button>

                            <button
                                @click="viewCalendar"
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                            >
                                <i class="pi pi-calendar text-2xl mb-2"></i>
                                <span class="text-sm font-medium"
                                    >Calendar</span
                                >
                            </button>
                        </div>
                    </div>

                    <!-- Team Members -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <h2
                            class="text-xl font-bold text-gray-900 dark:text-white mb-6"
                        >
                            Team Members
                        </h2>

                        <div class="space-y-4">
                            <div
                                v-for="member in teamMembers"
                                :key="member.id"
                                class="flex items-center justify-between"
                            >
                                <div class="flex items-center space-x-3">
                                    <div
                                        :class="member.color"
                                        class="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                                    >
                                        {{ member.initials }}
                                    </div>
                                    <div>
                                        <p
                                            class="font-medium text-gray-900 dark:text-white"
                                        >
                                            {{ member.name }}
                                        </p>
                                        <p
                                            class="text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            {{ member.role }}
                                        </p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        {{ member.tasks }}
                                    </p>
                                    <p
                                        class="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        tasks
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Toast Notification -->
        <div
            v-if="showToast"
            class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3 animate-slide-up"
        >
            <i class="pi pi-check-circle"></i>
            <span>{{ toastMessage }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { router } from "@inertiajs/vue3";

// Data
const showProfileDropdown = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

// Sample data
const recentTasks = ref([
    {
        id: 1,
        title: "Design Homepage",
        project: "Website Redesign",
        dueDate: "Today",
        priority: "High",
        priorityClass:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        statusClass: "bg-blue-100 dark:bg-blue-900/30",
        icon: "pi pi-palette text-blue-600 dark:text-blue-400",
    },
    {
        id: 2,
        title: "Fix Login Bug",
        project: "Mobile App",
        dueDate: "Tomorrow",
        priority: "Medium",
        priorityClass:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        statusClass: "bg-yellow-100 dark:bg-yellow-900/30",
        icon: "pi pi-bug text-yellow-600 dark:text-yellow-400",
    },
    {
        id: 3,
        title: "Write Documentation",
        project: "API Project",
        dueDate: "Dec 15",
        priority: "Low",
        priorityClass:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        statusClass: "bg-green-100 dark:bg-green-900/30",
        icon: "pi pi-file text-green-600 dark:text-green-400",
    },
]);

const activities = ref([
    {
        id: 1,
        description: 'Completed "Design System" task',
        time: "2 hours ago",
        icon: "pi pi-check-circle",
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
    },
    {
        id: 2,
        description: 'Commented on "API Integration"',
        time: "4 hours ago",
        icon: "pi pi-comment",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
        id: 3,
        description: 'Created new project "Mobile App"',
        time: "Yesterday",
        icon: "pi pi-plus",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
]);

const teamMembers = ref([
    {
        id: 1,
        name: "Alex Johnson",
        role: "Designer",
        tasks: 8,
        color: "bg-gradient-to-r from-pink-500 to-rose-500",
        initials: "AJ",
    },
    {
        id: 2,
        name: "Sam Wilson",
        role: "Developer",
        tasks: 12,
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        initials: "SW",
    },
    {
        id: 3,
        name: "Taylor Smith",
        role: "PM",
        tasks: 5,
        color: "bg-gradient-to-r from-green-500 to-emerald-500",
        initials: "TS",
    },
]);

// Computed
const userInitials = computed(() => {
    const name = window.$page?.props?.auth?.user?.name || "User";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
});

// Methods
const toggleProfileDropdown = () => {
    showProfileDropdown.value = !showProfileDropdown.value;
};

const logout = () => {
    router.post("/logout");
};

const goToKanban = () => {
    router.get("/kanban");
};

const goToProfile = () => {
    router.get("/profile");
};

const createTask = () => {
    showToastMessage("Creating new task...");
    router.get("/kanban");
};

const inviteTeam = () => {
    showToastMessage("Share invitation link copied!");
    navigator.clipboard.writeText(window.location.origin + "/invite/team123");
};

const exportReport = () => {
    showToastMessage("Report exported successfully!");
};

const viewCalendar = () => {
    showToastMessage("Opening calendar...");
};

const showToastMessage = (message) => {
    toastMessage.value = message;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
    const profileDropdown = document.querySelector('[ref="profileDropdown"]');
    if (profileDropdown && !profileDropdown.contains(event.target)) {
        showProfileDropdown.value = false;
    }
};

// Lifecycle
onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Animations */
.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 6px;
}

/* Smooth transitions */
.task-card-enter-active,
.task-card-leave-active {
    transition: all 0.3s ease;
}

.task-card-enter-from,
.task-card-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* Glass effect */
.glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
}

/* Gradient border */
.gradient-border {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
        linear-gradient(135deg, #667eea, #764ba2) border-box;
}
</style>
