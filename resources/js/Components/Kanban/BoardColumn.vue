<template>
    <div class="kanban-column rounded-xl p-4" :class="color">
        <!-- Column Header -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
                <div class="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <i :class="icon + ' text-lg'"></i>
                </div>
                <div>
                    <h3 class="font-bold text-gray-800 dark:text-white">
                        {{ title }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ tasks.length }} tasks
                    </p>
                </div>
            </div>

            <button
                @click="$emit('add-task', status)"
                class="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
                <i class="pi pi-plus text-gray-600 dark:text-gray-400"></i>
            </button>
        </div>

        <!-- Task List -->
        <VueDraggable
            v-model="localTasks"
            group="tasks"
            item-key="id"
            ghost-class="ghost-task"
            drag-class="dragging-task"
            class="space-y-3 min-h-[200px] pb-4"
            :animation="200"
            @end="onDragEnd"
            @start="onDragStart"
        >
            <template #item="{ element }">
                <TaskCard
                    :task="element"
                    @click="$emit('task-click', element)"
                />
            </template>

            <!-- Empty State -->
            <template #footer v-if="tasks.length === 0">
                <div class="text-center py-8">
                    <div
                        class="h-12 w-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3"
                    >
                        <i class="pi pi-inbox text-gray-400"></i>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        No tasks here yet
                    </p>
                    <button
                        @click="$emit('add-task', status)"
                        class="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                    >
                        Add a task
                    </button>
                </div>
            </template>
        </VueDraggable>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import TaskCard from "./TaskCard.vue";

const props = defineProps({
    title: String,
    tasks: Array,
    status: String,
    color: String,
    icon: String,
});

const emit = defineEmits(["task-click", "add-task", "task-drop"]);

const localTasks = computed({
    get() {
        return [...props.tasks];
    },
    set(newTasks) {
        // Handle local reordering
    },
});

const onDragEnd = (event) => {
    const task = event.item.__data;
    const newPosition = event.newIndex;

    emit("task-drop", task.id, props.status, newPosition);
};

const onDragStart = (event) => {
    event.item.classList.add("dragging-task");
};
</script>

<style scoped>
.kanban-column {
    transition: all 0.3s ease;
}

.kanban-column:hover {
    transform: translateY(-2px);
}
</style>
