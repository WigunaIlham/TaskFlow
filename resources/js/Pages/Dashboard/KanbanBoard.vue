<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
        <!-- Header -->
        <div
            class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <!-- Left Section -->
                    <div class="flex items-center space-x-6">
                        <button
                            @click="goBack"
                            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <i
                                class="pi pi-arrow-left text-gray-600 dark:text-gray-300"
                            ></i>
                        </button>

                        <div>
                            <h1
                                class="text-xl font-bold text-gray-900 dark:text-white"
                            >
                                Kanban Board
                            </h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ projectName }} •
                                {{ teamMembers.length }} members
                            </p>
                        </div>
                    </div>

                    <!-- Center Controls -->
                    <div class="hidden md:flex items-center space-x-4">
                        <div class="relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                                <i class="pi pi-search text-gray-400"></i>
                            </div>
                            <input
                                v-model="searchQuery"
                                @input="searchTasks"
                                type="text"
                                placeholder="Search tasks..."
                                class="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                            />
                        </div>

                        <PDropdown
                            v-model="selectedFilter"
                            :options="filterOptions"
                            optionLabel="name"
                            placeholder="Filter"
                            class="w-40"
                        />

                        <PDropdown
                            v-model="selectedSort"
                            :options="sortOptions"
                            optionLabel="name"
                            placeholder="Sort by"
                            class="w-40"
                        />
                    </div>

                    <!-- Right Actions -->
                    <div class="flex items-center space-x-3">
                        <PButton
                            icon="pi pi-home"
                            severity="secondary"
                            outlined
                            @click="goHome"
                            title="Kembali ke Beranda"
                        />
                        <PButton
                            icon="pi pi-eye"
                            severity="secondary"
                            outlined
                            @click="toggleView"
                            :label="isListView ? 'Board' : 'List'"
                        />

                        <PButton
                            icon="pi pi-filter"
                            severity="secondary"
                            outlined
                            @click="showFilterSidebar = true"
                        />

                        <PButton
                            icon="pi pi-plus"
                            @click="showCreateTaskModal = true"
                            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <span class="hidden md:inline">New Task</span>
                        </PButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Bar -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                Total Tasks
                            </p>
                            <p class="text-2xl font-bold dark:text-white">
                                {{ totalTasks }}
                            </p>
                        </div>
                        <div
                            class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                        >
                            <i
                                class="pi pi-inbox text-blue-600 dark:text-blue-400"
                            ></i>
                        </div>
                    </div>
                </div>

                <div
                    v-for="column in columns"
                    :key="column.id"
                    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                {{ column.name }}
                            </p>
                            <p
                                class="text-2xl font-bold"
                                :class="column.textColor"
                            >
                                {{ getTasksByStatus(column.status).length }}
                            </p>
                        </div>
                        <div class="p-2 rounded-lg" :class="column.bgColor">
                            <i
                                :class="column.icon"
                                ::class="column.iconColor"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
                <div
                    class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
                ></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">
                    Loading tasks...
                </p>
            </div>

            <!-- Empty State -->
            <div
                v-else-if="filteredTasks.length === 0"
                class="text-center py-12"
            >
                <div
                    class="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6"
                >
                    <i class="pi pi-inbox text-3xl text-gray-400"></i>
                </div>
                <h3
                    class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                    No tasks found
                </h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6">
                    Get started by creating your first task
                </p>
                <PButton
                    icon="pi pi-plus"
                    @click="showCreateTaskModal = true"
                    class="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    Create Task
                </PButton>
            </div>

            <!-- Kanban Board View -->
            <div
                v-else-if="!isListView"
                class="grid grid-cols-1 md:grid-cols-5 gap-6"
            >
                <BoardColumn
                    v-for="column in columns"
                    :key="column.id"
                    :title="column.name"
                    :tasks="getTasksByStatus(column.status)"
                    :status="column.status"
                    :color="column.columnColor"
                    :icon="column.icon"
                    @task-click="openTaskDetail"
                    @add-task="openCreateTaskWithStatus"
                    @task-drop="handleTaskDrop"
                />
            </div>

            <!-- List View -->
            <div
                v-else
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                <div class="overflow-x-auto">
                    <table
                        class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                    >
                        <thead class="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    Task
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    Priority
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    Due Date
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    Assignee
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                        >
                            <tr
                                v-for="task in filteredTasks"
                                :key="task.id"
                                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3"
                                        >
                                            <i
                                                class="pi pi-check-circle text-blue-600 dark:text-blue-400"
                                            ></i>
                                        </div>
                                        <div>
                                            <div
                                                class="text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                {{ task.title }}
                                            </div>
                                            <div
                                                class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs"
                                            >
                                                {{
                                                    task.description ||
                                                    "No description"
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-3 py-1 text-xs font-medium rounded-full"
                                        :class="getStatusClass(task.status)"
                                    >
                                        {{
                                            task.status
                                                .replace("_", " ")
                                                .toUpperCase()
                                        }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <span
                                            class="h-2 w-2 rounded-full mr-2"
                                            :class="
                                                getPriorityColor(task.priority)
                                            "
                                        ></span>
                                        <span
                                            class="text-sm text-gray-900 dark:text-white"
                                            >{{ task.priority }}</span
                                        >
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                                >
                                    {{ formatDate(task.due_date) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold"
                                        >
                                            {{
                                                getInitials(
                                                    task.assignee?.name ||
                                                        "Unassigned"
                                                )
                                            }}
                                        </div>
                                        <span
                                            class="ml-2 text-sm text-gray-900 dark:text-white"
                                            >{{
                                                task.assignee?.name ||
                                                "Unassigned"
                                            }}</span
                                        >
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                >
                                    <div class="flex space-x-2">
                                        <button
                                            @click="openTaskDetail(task)"
                                            class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <i class="pi pi-eye"></i>
                                        </button>
                                        <button
                                            @click="editTask(task)"
                                            class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                        >
                                            <i class="pi pi-pencil"></i>
                                        </button>
                                        <button
                                            @click="deleteTask(task)"
                                            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <i class="pi pi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Create Task Modal -->
            <PDialog
                v-model:visible="showCreateTaskModal"
                modal
                header="Create New Task"
                :style="{ width: '600px' }"
            >
                <TaskForm
                    :initial-status="selectedStatus"
                    @submitted="handleTaskCreated"
                    @cancel="showCreateTaskModal = false"
                />
            </PDialog>

            <!-- Task Detail Drawer -->
            <PSidebar
                v-model:visible="showTaskDetail"
                position="right"
                :style="{ width: '500px' }"
                @hide="selectedTask = null"
            >
                <TaskDetail
                    v-if="selectedTask"
                    :task="selectedTask"
                    @updated="handleTaskUpdated"
                    @deleted="handleTaskDeleted"
                    @close="showTaskDetail = false"
                />
            </PSidebar>

            <!-- Filter Sidebar -->
            <PSidebar
                v-model:visible="showFilterSidebar"
                position="left"
                :style="{ width: '350px' }"
            >
                <div class="p-6">
                    <h3
                        class="text-lg font-bold text-gray-900 dark:text-white mb-6"
                    >
                        Filters & Settings
                    </h3>

                    <div class="space-y-6">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >Priority</label
                            >
                            <div class="space-y-2">
                                <div
                                    v-for="priority in [
                                        'low',
                                        'medium',
                                        'high',
                                        'critical',
                                    ]"
                                    :key="priority"
                                >
                                    <PCheckbox
                                        v-model="activeFilters.priority"
                                        :value="priority"
                                        :binary="true"
                                        @change="applyFilters"
                                    />
                                    <label
                                        class="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize"
                                        >{{ priority }}</label
                                    >
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >Assigned To</label
                            >
                            <div class="space-y-2">
                                <div
                                    v-for="member in teamMembers"
                                    :key="member.id"
                                >
                                    <PCheckbox
                                        v-model="activeFilters.assignee"
                                        :value="member.id"
                                        :binary="true"
                                        @change="applyFilters"
                                    />
                                    <div class="ml-2 inline-flex items-center">
                                        <div
                                            class="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs mr-2"
                                        >
                                            {{ getInitials(member.name) }}
                                        </div>
                                        <span
                                            class="text-sm text-gray-700 dark:text-gray-300"
                                            >{{ member.name }}</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >Due Date</label
                            >
                            <div class="space-y-2">
                                <div
                                    v-for="option in dueDateOptions"
                                    :key="option.value"
                                >
                                    <PCheckbox
                                        v-model="activeFilters.dueDate"
                                        :value="option.value"
                                        :binary="true"
                                        @change="applyFilters"
                                    />
                                    <label
                                        class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                        >{{ option.label }}</label
                                    >
                                </div>
                            </div>
                        </div>

                        <div>
                            <PButton
                                @click="clearFilters"
                                severity="secondary"
                                outlined
                                class="w-full"
                            >
                                Clear All Filters
                            </PButton>
                        </div>
                    </div>
                </div>
            </PSidebar>

            <!-- Toast Notification -->
            <PToast position="bottom-right" />
        </main>

        <!-- Floating Action Button -->
        <button
            @click="showCreateTaskModal = true"
            class="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-30"
        >
            <i class="pi pi-plus text-xl"></i>
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { router, usePage } from "@inertiajs/vue3";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import BoardColumn from "@/Components/Kanban/BoardColumn.vue";
import TaskForm from "@/Components/Kanban/TaskForm.vue";
import TaskDetail from "@/Components/Kanban/TaskDetail.vue";

const toast = useToast();
const confirm = useConfirm();
const page = usePage();

// State
const loading = ref(false);
const tasks = ref([]);
const searchQuery = ref("");
const selectedFilter = ref(null);
const selectedSort = ref({ name: "Position", value: "position" });
const showCreateTaskModal = ref(false);
const showTaskDetail = ref(false);
const showFilterSidebar = ref(false);
const selectedTask = ref(null);
const selectedStatus = ref("todo");
const isListView = ref(false);

// Filters
const activeFilters = ref({
    priority: [],
    assignee: [],
    dueDate: [],
});

// Data
const projectName = "Project Alpha";
const teamMembers = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com" },
    { id: 2, name: "Sam Wilson", email: "sam@example.com" },
    { id: 3, name: "Taylor Smith", email: "taylor@example.com" },
];

// Columns configuration
const columns = [
    {
        id: 1,
        name: "Backlog",
        status: "backlog",
        icon: "pi pi-inbox",
        iconColor: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-100 dark:bg-gray-700",
        textColor: "text-gray-700 dark:text-gray-300",
        columnColor: "bg-gray-50 dark:bg-gray-800/50",
    },
    {
        id: 2,
        name: "To Do",
        status: "todo",
        icon: "pi pi-clock",
        iconColor: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-700 dark:text-blue-300",
        columnColor: "bg-blue-50 dark:bg-blue-900/10",
    },
    {
        id: 3,
        name: "In Progress",
        status: "in_progress",
        icon: "pi pi-spinner",
        iconColor: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        textColor: "text-orange-700 dark:text-orange-300",
        columnColor: "bg-orange-50 dark:bg-orange-900/10",
    },
    {
        id: 4,
        name: "Review",
        status: "review",
        icon: "pi pi-eye",
        iconColor: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        textColor: "text-purple-700 dark:text-purple-300",
        columnColor: "bg-purple-50 dark:bg-purple-900/10",
    },
    {
        id: 5,
        name: "Done",
        status: "done",
        icon: "pi pi-check-circle",
        iconColor: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-700 dark:text-green-300",
        columnColor: "bg-green-50 dark:bg-green-900/10",
    },
];

// Options
const filterOptions = [
    { name: "All Tasks", value: "all" },
    { name: "My Tasks", value: "mine" },
    { name: "Assigned to Me", value: "assigned" },
    { name: "Overdue", value: "overdue" },
];

const sortOptions = [
    { name: "Position", value: "position" },
    { name: "Due Date", value: "due_date" },
    { name: "Priority", value: "priority" },
    { name: "Created Date", value: "created_at" },
];

const dueDateOptions = [
    { label: "Overdue", value: "overdue" },
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "This Week", value: "week" },
    { label: "Next Week", value: "next_week" },
];

// Computed
const totalTasks = computed(() => tasks.value.length);

const filteredTasks = computed(() => {
    let result = [...tasks.value];

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
            (task) =>
                task.title.toLowerCase().includes(query) ||
                (task.description &&
                    task.description.toLowerCase().includes(query))
        );
    }

    // Priority filter
    if (activeFilters.value.priority.length > 0) {
        result = result.filter((task) =>
            activeFilters.value.priority.includes(task.priority)
        );
    }

    // Assignee filter
    if (activeFilters.value.assignee.length > 0) {
        result = result.filter(
            (task) =>
                task.assignee &&
                activeFilters.value.assignee.includes(task.assignee.id)
        );
    }

    // Due date filter (simplified)
    if (activeFilters.value.dueDate.length > 0) {
        if (activeFilters.value.dueDate.includes("overdue")) {
            const today = new Date();
            result = result.filter(
                (task) =>
                    task.due_date &&
                    new Date(task.due_date) < today &&
                    task.status !== "done"
            );
        }
    }

    // Sort
    if (selectedSort.value) {
        const sortBy = selectedSort.value.value;
        result.sort((a, b) => {
            if (sortBy === "due_date") {
                return (
                    new Date(a.due_date || "9999-12-31") -
                    new Date(b.due_date || "9999-12-31")
                );
            }
            if (sortBy === "priority") {
                const priorityOrder = {
                    critical: 4,
                    high: 3,
                    medium: 2,
                    low: 1,
                };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            if (sortBy === "created_at") {
                return new Date(b.created_at) - new Date(a.created_at);
            }
            return a.position - b.position;
        });
    }

    return result;
});

// Methods
const getTasksByStatus = (status) => {
    return filteredTasks.value
        .filter((task) => task.status === status)
        .sort((a, b) => a.position - b.position);
};

const openTaskDetail = (task) => {
    selectedTask.value = task;
    showTaskDetail.value = true;
};

const openCreateTaskWithStatus = (status) => {
    selectedStatus.value = status;
    showCreateTaskModal.value = true;
};

const handleTaskDrop = async (taskId, newStatus, position) => {
    try {
        const task = tasks.value.find((t) => t.id === taskId);
        if (!task) return;

        // Optimistic update
        const oldTask = { ...task };
        task.status = newStatus;
        task.position = position;

        // Reorder tasks in the new column
        const tasksInColumn = tasks.value.filter(
            (t) => t.status === newStatus && t.id !== taskId
        );
        tasksInColumn.splice(position, 0, task);
        tasksInColumn.forEach((t, idx) => {
            if (t.id === taskId) return;
            t.position = idx;
        });

        // API call
        await router.patch(
            `/tasks/${taskId}`,
            {
                status: newStatus,
                position: position,
                _method: "patch",
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.add({
                        severity: "success",
                        summary: "Success",
                        detail: "Task moved successfully",
                        life: 3000,
                    });
                },
                onError: () => {
                    // Revert optimistic update
                    Object.assign(task, oldTask);
                    toast.add({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to move task",
                        life: 3000,
                    });
                },
            }
        );
    } catch (error) {
        console.error("Error moving task:", error);
    }
};

const handleTaskCreated = (newTask) => {
    tasks.value.push(newTask);
    showCreateTaskModal.value = false;

    toast.add({
        severity: "success",
        summary: "Success",
        detail: "Task created successfully",
        life: 3000,
    });
};

const handleTaskUpdated = (updatedTask) => {
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
        tasks.value[index] = updatedTask;
    }

    toast.add({
        severity: "success",
        summary: "Success",
        detail: "Task updated successfully",
        life: 3000,
    });
};

const handleTaskDeleted = (taskId) => {
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
    showTaskDetail.value = false;

    toast.add({
        severity: "warn",
        summary: "Deleted",
        detail: "Task deleted successfully",
        life: 3000,
    });
};

const editTask = (task) => {
    selectedTask.value = task;
    showTaskDetail.value = true;
};

const deleteTask = async (task) => {
    confirm.require({
        message: `Are you sure you want to delete "${task.title}"?`,
        header: "Delete Confirmation",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        accept: async () => {
            try {
                await router.delete(`/tasks/${task.id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        tasks.value = tasks.value.filter(
                            (t) => t.id !== task.id
                        );
                        toast.add({
                            severity: "success",
                            summary: "Deleted",
                            detail: "Task deleted successfully",
                            life: 3000,
                        });
                    },
                    onError: () => {
                        toast.add({
                            severity: "error",
                            summary: "Error",
                            detail: "Failed to delete task",
                            life: 3000,
                        });
                    },
                });
            } catch (error) {
                console.error("Error deleting task:", error);
                toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Something went wrong",
                    life: 3000,
                });
            }
        },
        reject: () => {
            // Do nothing on reject
        },
    });
};

const searchTasks = () => {
    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        // Search logic already handled by computed property
    }, 300);
};

const applyFilters = () => {
    // Filters are applied automatically through computed property
};

const clearFilters = () => {
    activeFilters.value = {
        priority: [],
        assignee: [],
        dueDate: [],
    };
    searchQuery.value = "";
    selectedFilter.value = null;
};

const toggleView = () => {
    isListView.value = !isListView.value;
};

const goBack = () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        router.get("/dashboard");
    }
};

const goHome = () => {
    router.get("/dashboard");
};

const getStatusClass = (status) => {
    const classes = {
        backlog:
            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        todo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        in_progress:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        review: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return classes[status] || classes.todo;
};

const getPriorityColor = (priority) => {
    const colors = {
        low: "bg-green-500",
        medium: "bg-yellow-500",
        high: "bg-orange-500",
        critical: "bg-red-500",
    };
    return colors[priority] || colors.medium;
};

const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
            date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
};

const getInitials = (name) => {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
};

// Lifecycle
let searchTimeout;

onMounted(() => {
    // Load initial tasks
    loading.value = true;
    setTimeout(() => {
        // Simulate API call
        tasks.value = [
            {
                id: 1,
                title: "Design Homepage",
                description:
                    "Create modern homepage design with responsive layout",
                status: "in_progress",
                priority: "high",
                position: 0,
                due_date: "2024-12-15",
                assignee: teamMembers[0],
                created_at: "2024-12-01",
            },
            {
                id: 2,
                title: "Fix Login Bug",
                description: "Resolve authentication issue on mobile devices",
                status: "todo",
                priority: "critical",
                position: 0,
                due_date: "2024-12-10",
                assignee: teamMembers[1],
                created_at: "2024-12-02",
            },
            {
                id: 3,
                title: "Write Documentation",
                description: "Document API endpoints and usage",
                status: "review",
                priority: "medium",
                position: 0,
                due_date: "2024-12-20",
                assignee: teamMembers[2],
                created_at: "2024-11-28",
            },
            {
                id: 4,
                title: "Setup CI/CD Pipeline",
                description: "Configure automated deployment process",
                status: "done",
                priority: "high",
                position: 0,
                due_date: "2024-11-30",
                assignee: teamMembers[0],
                created_at: "2024-11-20",
            },
            {
                id: 5,
                title: "Performance Optimization",
                description: "Improve page load times and reduce bundle size",
                status: "backlog",
                priority: "medium",
                position: 0,
                due_date: "2024-12-25",
                assignee: null,
                created_at: "2024-12-03",
            },
        ];
        loading.value = false;
    }, 1000);
});

// Watch for task updates from other components
watch(
    () => page.props.tasks,
    (newTasks) => {
        if (newTasks) {
            tasks.value = newTasks;
        }
    },
    { deep: true }
);
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

/* Smooth transitions */
.task-enter-active,
.task-leave-active {
    transition: all 0.3s ease;
}

.task-enter-from,
.task-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
