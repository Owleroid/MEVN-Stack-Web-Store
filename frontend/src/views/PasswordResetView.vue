<template>
  <div class="px-4 py-10 md:max-w-md md:mx-auto">
    <!-- Page Title -->
    <h1 class="text-3xl text-main-red mb-8 text-center">
      {{ $t("passwordReset") }}
    </h1>

    <form @submit.prevent="handlePasswordReset" class="space-y-6">
      <!-- Email Input -->
      <div class="space-y-1">
        <label
          for="email"
          :class="[
            'block text-base transition-colors duration-500 ease-in-out',
            activeInput === 'email' || form.email
              ? 'text-white'
              : 'text-main-gray-hover',
          ]"
        >
          {{ $t("email") }}
        </label>
        <div
          :class="[
            'border p-3 bg-transparent transition-colors duration-500 ease-in-out',
            activeInput === 'email' || form.email
              ? 'border-main-red'
              : 'border-white border-opacity-50',
          ]"
          @click="focusEmailInput"
        >
          <input
            v-model="form.email"
            type="email"
            id="email"
            required
            placeholder="example@mail.com"
            class="w-full bg-transparent font-medium text-white focus:outline-none"
            @focus="activeInput = 'email'"
            @blur="activeInput = ''"
            ref="emailInputRef"
          />
        </div>
        <p v-if="error" class="text-sm text-red-500">
          {{ error }}
        </p>
      </div>

      <!-- Password Reset Instructions -->
      <div class="text-sm text-main-gray-hover text-center">
        {{ $t("passwordResetInstructions") }}
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-6">
        <button
          type="submit"
          class="px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] border border-[#240000] focus:outline-none"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center justify-center">
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

    <!-- Login Link -->
    <div class="mt-8 text-center">
      <router-link
        to="/login"
        class="text-main-gray-hover text-base underline hover:text-main-red transition-colors duration-500 ease-in-out"
      >
        {{ $t("backToLogin") }}
      </router-link>
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

// Input focus state and refs
const activeInput = ref("");
const emailInputRef = ref<HTMLInputElement | null>(null);

// Focus input function
const focusEmailInput = () => {
  if (emailInputRef.value) {
    emailInputRef.value.focus();
  }
};

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
