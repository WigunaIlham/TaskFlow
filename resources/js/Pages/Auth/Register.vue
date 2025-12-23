<template>
    <GuestLayout>
        <Head title="Register" />

        <!-- Hero Section -->
        <div class="text-center mb-8">
            <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 mb-4"
            >
                <i class="pi pi-user-plus text-white text-2xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900">Join TaskFlow</h1>
            <p class="text-gray-600 mt-2">Create your account to get started</p>
        </div>

        <!-- Register Form -->
        <form
            @submit.prevent="submit"
            class="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
        >
            <!-- Name -->
            <div>
                <InputLabel
                    for="name"
                    value="Full Name"
                    class="mb-2 text-gray-700"
                />
                <div class="relative">
                    <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                        <i class="pi pi-user text-gray-400"></i>
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        class="pl-10 w-full py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        v-model="form.name"
                        required
                        autofocus
                        autocomplete="name"
                        placeholder="John Doe"
                    />
                </div>
                <InputError class="mt-2" :message="form.errors.name" />
            </div>

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
                        autocomplete="username"
                        placeholder="you@example.com"
                    />
                </div>
                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <!-- Password -->
            <div>
                <InputLabel
                    for="password"
                    value="Password"
                    class="mb-2 text-gray-700"
                />
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
                        autocomplete="new-password"
                        placeholder="••••••••"
                    />
                </div>
                <p class="mt-2 text-xs text-gray-500">
                    Must be at least 8 characters
                </p>
                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <!-- Confirm Password -->
            <div>
                <InputLabel
                    for="password_confirmation"
                    value="Confirm Password"
                    class="mb-2 text-gray-700"
                />
                <div class="relative">
                    <div
                        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                        <i class="pi pi-lock text-gray-400"></i>
                    </div>
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        class="pl-10 w-full py-3 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        v-model="form.password_confirmation"
                        required
                        autocomplete="new-password"
                        placeholder="••••••••"
                    />
                </div>
                <InputError
                    class="mt-2"
                    :message="form.errors.password_confirmation"
                />
            </div>

            <!-- Terms Agreement -->
            <div class="flex items-center">
                <Checkbox name="terms" v-model:checked="form.terms" />
                <label class="ms-2 text-sm text-gray-700">
                    I agree to the
                    <a
                        href="/terms"
                        class="text-blue-600 hover:text-blue-800 font-medium"
                        >Terms of Service</a
                    >
                    and
                    <a
                        href="/privacy"
                        class="text-blue-600 hover:text-blue-800 font-medium"
                        >Privacy Policy</a
                    >
                </label>
            </div>
            <InputError class="mt-2" :message="form.errors.terms" />

            <!-- Submit Button -->
            <PrimaryButton
                class="w-full justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
                :disabled="form.processing"
            >
                <span v-if="form.processing" class="flex items-center">
                    <i class="pi pi-spinner pi-spin mr-2"></i>
                    Creating account...
                </span>
                <span v-else class="flex items-center">
                    <i class="pi pi-user-plus mr-2"></i>
                    Create Account
                </span>
            </PrimaryButton>
        </form>

        <!-- Login Link -->
        <div class="mt-8 text-center">
            <p class="text-gray-600">
                Already have an account?
                <Link
                    :href="route('login')"
                    class="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                    Sign in here
                </Link>
            </p>
        </div>

        <!-- Benefits -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-xl">
                <i class="pi pi-rocket text-blue-600 text-xl mb-2"></i>
                <p class="text-sm font-medium text-gray-900">Modern UI</p>
                <p class="text-xs text-gray-600">
                    Beautiful & intuitive interface
                </p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-xl">
                <i class="pi pi-shield text-green-600 text-xl mb-2"></i>
                <p class="text-sm font-medium text-gray-900">Secure</p>
                <p class="text-xs text-gray-600">Your data is protected</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-xl">
                <i class="pi pi-bolt text-purple-600 text-xl mb-2"></i>
                <p class="text-sm font-medium text-gray-900">Fast</p>
                <p class="text-xs text-gray-600">Lightning fast performance</p>
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

const form = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    terms: false,
});

const submit = () => {
    form.post(route("register"), {
        onFinish: () => form.reset("password", "password_confirmation"),
    });
};
</script>
