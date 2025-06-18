<template>
  <div class="px-4 py-10 md:max-w-md md:mx-auto">
    <!-- Login/Signup Toggle -->
    <div class="flex justify-center items-center mb-8">
      <router-link
        to="/login"
        class="text-3xl px-10 border-r border-main-gray-hover"
        :class="{
          'text-main-red': $route.path === '/login',
          'text-main-gray-hover': $route.path !== '/login',
        }"
      >
        {{ $t("login") }}
      </router-link>
      <router-link
        to="/signup"
        class="text-3xl px-10 border-l border-main-gray-hover"
        :class="{
          'text-main-red': $route.path === '/signup',
          'text-main-gray-hover': $route.path !== '/signup',
        }"
      >
        {{ $t("signup") }}
      </router-link>
    </div>

    <form @submit.prevent="handleSignup" class="space-y-6">
      <!-- Email Input -->
      <div class="space-y-1 group">
        <label
          for="email"
          class="block text-base font-medium transition-colors duration-200"
          :class="[
            activeInput === 'email'
              ? 'text-[#BA0913]'
              : 'text-gray-400 group-hover:text-gray-300',
          ]"
        >
          {{ $t("email") }}
        </label>
        <div class="relative p-[1px] mt-1">
          <!-- Gradient border -->
          <div
            class="absolute inset-0 transition-colors duration-500 ease-in-out"
            :class="[
              activeInput === 'email'
                ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
            ]"
          ></div>
          <div class="relative bg-[#0E0E0E]">
            <input
              v-model="form.email"
              type="email"
              id="email"
              required
              placeholder="example@mail.com"
              class="block w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
              @focus="activeInput = 'email'"
              @blur="activeInput = ''"
              ref="emailInputRef"
            />
          </div>
        </div>
        <p v-if="errors.email" class="text-sm text-[#BA0913]">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Input -->
      <div class="space-y-1 group">
        <label
          for="password"
          class="block text-base font-medium transition-colors duration-200"
          :class="[
            activeInput === 'password'
              ? 'text-[#BA0913]'
              : 'text-gray-400 group-hover:text-gray-300',
          ]"
        >
          {{ $t("password") }}
        </label>
        <div class="relative p-[1px] mt-1">
          <!-- Gradient border -->
          <div
            class="absolute inset-0 transition-colors duration-500 ease-in-out"
            :class="[
              activeInput === 'password'
                ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
            ]"
          ></div>
          <div class="relative bg-[#0E0E0E]">
            <input
              v-model="form.password"
              type="password"
              id="password"
              required
              placeholder="*****"
              class="block w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
              @focus="activeInput = 'password'"
              @blur="activeInput = ''"
              ref="passwordInputRef"
            />
          </div>
        </div>
        <p v-if="errors.password" class="text-sm text-[#BA0913]">
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirm Password Input -->
      <div class="space-y-1 group">
        <label
          for="confirmPassword"
          class="block text-base font-medium transition-colors duration-200"
          :class="[
            activeInput === 'confirmPassword'
              ? 'text-[#BA0913]'
              : 'text-gray-400 group-hover:text-gray-300',
          ]"
        >
          {{ $t("confirmPassword") }}
        </label>
        <div class="relative p-[1px] mt-1">
          <!-- Gradient border -->
          <div
            class="absolute inset-0 transition-colors duration-500 ease-in-out"
            :class="[
              activeInput === 'confirmPassword'
                ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
            ]"
          ></div>
          <div class="relative bg-[#0E0E0E]">
            <input
              v-model="form.confirmPassword"
              type="password"
              id="confirmPassword"
              required
              placeholder="*****"
              class="block w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
              @focus="activeInput = 'confirmPassword'"
              @blur="activeInput = ''"
              ref="confirmPasswordInputRef"
            />
          </div>
        </div>
        <p v-if="errors.confirmPassword" class="text-sm text-[#BA0913]">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-8">
        <button
          type="submit"
          class="h-[48px] px-12 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
          <span v-else>{{ $t("signup") }}</span>
        </button>
      </div>
    </form>
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

// Input focus state and refs
const activeInput = ref("");
const emailInputRef = ref<HTMLInputElement | null>(null);
const passwordInputRef = ref<HTMLInputElement | null>(null);
const confirmPasswordInputRef = ref<HTMLInputElement | null>(null);

// Form State
interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
}

const form = reactive<SignupForm>({
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive<FormErrors>({
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref<boolean>(false);

// Form Validation
const validateForm = (): boolean => {
  let valid = true;
  errors.email = "";
  errors.password = "";
  errors.confirmPassword = "";

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
  } else if (form.password.length < 6) {
    errors.password = t("passwordTooShort");
    valid = false;
  }

  // Password confirmation validation
  if (!form.confirmPassword) {
    errors.confirmPassword = t("confirmPasswordRequired");
    valid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = t("passwordsDoNotMatch");
    valid = false;
  }

  return valid;
};

// Form Submission
const handleSignup = async (): Promise<void> => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    const response: AuthResponse = await authStore.signup(
      form.email,
      form.password
    );

    if (response.success) {
      router.push("/login");
      toast.success(t("signupSuccess"));
    } else {
      toast.error(response.message || t("signupFailed"));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Signup error:", errorMessage);
    toast.error(t("signupFailed"));
  } finally {
    loading.value = false;
  }
};
</script>
