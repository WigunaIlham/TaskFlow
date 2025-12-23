<template>
    <form @submit.prevent="submit" class="space-y-4">
        <div>
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Title *</label
            >
            <PInputText
                v-model="form.title"
                placeholder="Enter task title"
                class="w-full"
                required
            />
        </div>

        <div>
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Description</label
            >
            <PTextarea
                v-model="form.description"
                rows="3"
                placeholder="Describe the task..."
                class="w-full"
            />
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Status</label
                >
                <PDropdown
                    v-model="form.status"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                />
            </div>

            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Priority</label
                >
                <PDropdown
                    v-model="form.priority"
                    :options="priorityOptions"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                />
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Due Date</label
                >
                <PCalendar
                    v-model="form.due_date"
                    dateFormat="yy-mm-dd"
                    class="w-full"
                    showIcon
                />
            </div>

            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >Assignee</label
                >
                <PDropdown
                    v-model="form.assignee_id"
                    :options="assigneeOptions"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select assignee"
                    class="w-full"
                />
            </div>
        </div>

        <div
            class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
            <PButton
                type="button"
                severity="secondary"
                @click="$emit('cancel')"
                label="Cancel"
            />
            <PButton
                type="submit"
                :disabled="submitting"
                class="bg-gradient-to-r from-blue-600 to-purple-600"
            >
                <span v-if="submitting">
                    <i class="pi pi-spinner pi-spin mr-2"></i>
                    Saving...
                </span>
                <span v-else>Save Task</span>
            </PButton>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { router } from "@inertiajs/vue3";

const props = defineProps({
    initialStatus: String,
});

const emit = defineEmits(["submitted", "cancel"]);

const form = ref({
    title: "",
    description: "",
    status: props.initialStatus || "todo",
    priority: "medium",
    due_date: null,
    assignee_id: null,
});

const submitting = ref(false);

const statusOptions = [
    { label: "Backlog", value: "backlog" },
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "in_progress" },
    { label: "Review", value: "review" },
    { label: "Done", value: "done" },
];

const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Critical", value: "critical" },
];

const assigneeOptions = [
    { id: 1, name: "Alex Johnson" },
    { id: 2, name: "Sam Wilson" },
    { id: 3, name: "Taylor Smith" },
    { id: null, name: "Unassigned" },
];

const submit = async () => {
    submitting.value = true;

    try {
        const response = await router.post("/tasks", form.value, {
            preserveScroll: true,
            onSuccess: (response) => {
                emit("submitted", response.props.task || form.value);
                resetForm();
            },
            onError: (errors) => {
                console.error("Error creating task:", errors);
            },
        });
    } catch (error) {
        console.error("Error:", error);
    } finally {
        submitting.value = false;
    }
};

const resetForm = () => {
    form.value = {
        title: "",
        description: "",
        status: props.initialStatus || "todo",
        priority: "medium",
        due_date: null,
        assignee_id: null,
    };
};

onMounted(() => {
    if (props.initialStatus) {
        form.value.status = props.initialStatus;
    }
});
</script>
