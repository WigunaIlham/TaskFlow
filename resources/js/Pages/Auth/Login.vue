<template>
    <GuestLayout>
        <Head title="Log in" />

        <!-- Hero Section -->
        <div class="text-center mb-8">
            <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4"
            >
                <i class="pi pi-rocket text-white text-2xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p class="text-gray-600 mt-2">Sign in to continue to TaskFlow</p>
        </div>

        <!-- Status Message -->
        <div
            v-if="status"
            class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm"
        >
            <div class="flex items-center">
                <i class="pi pi-check-circle mr-2"></i>
                {{ status }}
            </div>
        </div>

        <!-- Login Form -->
        <form
            @submit.prevent="submit"
            class="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
        >
            <!-- Email -->
            <div>
                <InputLabel
                    for="email"
                    value="Email Address"
                    class="mb-2 text-gray-700"
                />
                <div class="relative">
                    <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                        <i class="pi pi-envelope text-gray-400"></i>
                    </div>
                    <TextInput
                        id="email"
                        type="email"
                        class="pl-10 w-full py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        v-model="form.email"
                        required
                        autofocus
                        autocomplete="username"
                        placeholder="you@example.com"
                    />
                </div>
                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <!-- Password -->
            <div>
                <div class="flex items-center justify-between mb-2">
                    <InputLabel
                        for="password"
                        value="Password"
                        class="text-gray-700"
                    />
                    <Link
                        v-if="canResetPassword"
                        :href="route('password.request')"
                        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div class="relative">
                    <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                        <i class="pi pi-lock text-gray-400"></i>
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        class="pl-10 w-full py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        v-model="form.password"
                        required
                        autocomplete="current-password"
                        placeholder="••••••••"
                    />
                </div>
                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <!-- Remember Me -->
            <div class="flex items-center">
                <Checkbox name="remember" v-model:checked="form.remember" />
                <label class="ms-2 text-sm text-gray-700"> Remember me </label>
            </div>

            <!-- Submit Button -->
            <PrimaryButton
                class="w-full justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
                :disabled="form.processing"
            >
                <span v-if="form.processing" class="flex items-center">
                    <i class="pi pi-spinner pi-spin mr-2"></i>
                    Signing in...
                </span>
                <span v-else class="flex items-center">
                    <i class="pi pi-sign-in mr-2"></i>
                    Sign in
                </span>
            </PrimaryButton>
        </form>

        <!-- Register Link -->
        <div class="mt-8 text-center">
            <p class="text-gray-600">
                Don't have an account?
                <Link
                    :href="route('register')"
                    class="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                    Create one now
                </Link>
            </p>
        </div>

        <!-- Social Login (Optional) -->
        <div class="mt-8">
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white text-gray-500"
                        >Or continue with</span
                    >
                </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <i class="pi pi-google text-red-500 mr-2"></i>
                    Google
                </button>
                <button
                    type="button"
                    class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <i class="pi pi-github text-gray-800 mr-2"></i>
                    GitHub
                </button>
            </div>
        </div>
    </GuestLayout>
</template>

<script setup>
import { Head, Link, useForm } from "@inertiajs/vue3";
import GuestLayout from "@/Layouts/GuestLayout.vue";
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import Checkbox from "@/Components/Checkbox.vue";

defineProps({
    canResetPassword: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: "",
    password: "",
    remember: false,
});

const submit = () => {
    form.post(route("login"), {
        onFinish: () => form.reset("password"),
        onSuccess: () => {
            // Optional: Show success toast
            console.log("Login successful");
        },
        onError: (errors) => {
            console.log("Login errors:", errors);
        },
    });
};
</script>

<style scoped>
/* Custom animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Hover effects */
button:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
}
</style>
