<template>
    <div
        @click="$emit('click')"
        class="task-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all duration-200"
    >
        <div class="flex items-start justify-between mb-2">
            <h4 class="font-medium text-gray-900 dark:text-white line-clamp-2">
                {{ task.title }}
            </h4>
            <div class="flex items-center space-x-2">
                <span
                    class="text-xs font-medium px-2 py-1 rounded-full"
                    :class="priorityClass"
                >
                    {{ task.priority }}
                </span>
            </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {{ task.description || "No description" }}
        </p>

        <div class="flex items-center justify-between">
            <!-- Due Date -->
            <div class="flex items-center space-x-1">
                <i class="pi pi-calendar text-gray-400 text-xs"></i>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(task.due_date) }}
                </span>
            </div>

            <!-- Assignee -->
            <div v-if="task.assignee" class="flex items-center space-x-2">
                <div
                    class="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs"
                >
                    {{ getInitials(task.assignee.name) }}
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{
                    task.assignee.name.split(" ")[0]
                }}</span>
            </div>
            <div v-else class="text-xs text-gray-400 italic">Unassigned</div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    task: Object,
});

const emit = defineEmits(["click"]);

const priorityClass = computed(() => {
    const classes = {
        low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return classes[props.task.priority] || classes.medium;
});

const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) return "Today";

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getInitials = (name) => {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
};
</script>

<style scoped>
.task-card:hover {
    transform: translateY(-2px);
    border-color: #3b82f6;
}
</style>
