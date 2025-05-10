<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">
      {{ $t("login") }}
    </h1>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Email Input -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t("email") }}
        </label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          required
          placeholder="email@example.com"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Input -->
      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          {{ $t("password") }}
        </label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          :class="{ 'border-red-500': errors.password }"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ $t("processing") }}
          </span>
          <span v-else>{{ $t("login") }}</span>
        </button>
        <button
          @click="goToPasswordReset"
          type="button"
          class="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
        >
          {{ $t("forgotPassword") }}
        </button>
      </div>
    </form>

    <!-- Signup Link -->
    <div class="mt-6 text-center text-sm">
      <p class="text-gray-600">
        {{ $t("dontHaveAccount") }}
        <router-link to="/signup" class="text-blue-600 hover:underline">
          {{ $t("signupHere") }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import { useAuthStore } from "@/stores/authStore";
import type { AuthResponse } from "@/types/auth";

// Composables Setup
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

// Form State
interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

const form = reactive<LoginForm>({
  email: "",
  password: "",
});

const errors = reactive<FormErrors>({
  email: "",
  password: "",
});

const loading = ref<boolean>(false);

// Form Validation
const validateForm = (): boolean => {
  let valid = true;
  errors.email = "";
  errors.password = "";

  // Email validation
  if (!form.email) {
    errors.email = t("emailRequired");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t("emailInvalid");
    valid = false;
  }

  // Password validation
  if (!form.password) {
    errors.password = t("passwordRequired");
    valid = false;
  }

  return valid;
};

// Form Submission
const handleLogin = async (): Promise<void> => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const response: AuthResponse = await authStore.login(
      form.email,
      form.password
    );

    if (response.success) {
      router.push("/");
      toast.success(t("loginSuccess"));
    } else {
      toast.error(response.message || t("loginFailed"));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Login failed:", errorMessage);
    toast.error(t("loginFailed"));
  } finally {
    loading.value = false;
  }
};

// Navigation
const goToPasswordReset = (): void => {
  router.push("/password-reset");
};
</script>
