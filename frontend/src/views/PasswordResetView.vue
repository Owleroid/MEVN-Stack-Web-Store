<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">
      {{ $t("passwordReset") }}
    </h1>

    <form @submit.prevent="handlePasswordReset" class="space-y-6">
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
          :class="{ 'border-red-500': error }"
        />
        <p v-if="error" class="mt-1 text-sm text-red-600">
          {{ error }}
        </p>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center">
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
          <span v-else>{{ $t("resetPassword") }}</span>
        </button>
      </div>
    </form>

    <!-- Password Reset Instructions -->
    <div class="mt-4 text-sm text-center text-gray-600">
      {{ $t("passwordResetInstructions") }}
    </div>

    <!-- Login Link -->
    <div class="mt-4 text-center text-sm">
      <p class="text-gray-600">
        {{ $t("rememberPassword") }}
        <router-link to="/login" class="text-blue-600 hover:underline">
          {{ $t("login") }}
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
import type { UpdateResponse } from "@/types/auth";

// Composables Setup
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

// Form State
interface PasswordResetForm {
  email: string;
}

const form = reactive<PasswordResetForm>({
  email: "",
});

const error = ref<string>("");
const loading = ref<boolean>(false);

// Form Validation
const validateForm = (): boolean => {
  error.value = "";

  // Email validation
  if (!form.email) {
    error.value = t("emailRequired");
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    error.value = t("emailInvalid");
    return false;
  }

  return true;
};

// Form Submission
const handlePasswordReset = async (): Promise<void> => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const response: UpdateResponse = await authStore.resetPassword(form.email);

    if (response.success) {
      toast.success(t("resetEmailSent"));
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      error.value = response.message || t("resetFailed");
      toast.error(error.value);
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Password reset error:", errorMessage);
    error.value = t("resetFailed");
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};
</script>
