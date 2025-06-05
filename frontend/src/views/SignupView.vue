<template>
  <div class="px-4 py-10 md:max-w-md md:mx-auto">
    <!-- Login/Signup Toggle -->
    <div class="flex justify-between items-center mb-8">
      <div
        class="flex-1 py-2 flex justify-center border-r border-main-gray-hover"
      >
        <router-link to="/login" class="text-3xl text-main-gray-hover">
          {{ $t("login") }}
        </router-link>
      </div>
      <div
        class="flex-1 py-2 flex justify-center border-l border-main-gray-hover"
      >
        <router-link to="/signup" class="text-3xl text-main-red">
          {{ $t("signup") }}
        </router-link>
      </div>
    </div>

    <form @submit.prevent="handleSignup" class="space-y-6">
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
        <p v-if="errors.email" class="text-sm text-red-500">
          {{ errors.email }}
        </p>
      </div>

      <!-- Password Input -->
      <div class="space-y-1">
        <label
          for="password"
          :class="[
            'block text-base transition-colors duration-500 ease-in-out',
            activeInput === 'password' || form.password
              ? 'text-white'
              : 'text-main-gray-hover',
          ]"
        >
          {{ $t("password") }}
        </label>
        <div
          :class="[
            'border p-3 bg-transparent transition-colors duration-500 ease-in-out',
            activeInput === 'password' || form.password
              ? 'border-main-red'
              : 'border-white border-opacity-50',
          ]"
          @click="focusPasswordInput"
        >
          <input
            v-model="form.password"
            type="password"
            id="password"
            required
            placeholder="*****"
            class="w-full bg-transparent font-medium text-white focus:outline-none"
            @focus="activeInput = 'password'"
            @blur="activeInput = ''"
            ref="passwordInputRef"
          />
        </div>
        <p v-if="errors.password" class="text-sm text-red-500">
          {{ errors.password }}
        </p>
      </div>

      <!-- Confirm Password Input -->
      <div class="space-y-1">
        <label
          for="confirmPassword"
          :class="[
            'block text-base transition-colors duration-500 ease-in-out',
            activeInput === 'confirmPassword' || form.confirmPassword
              ? 'text-white'
              : 'text-main-gray-hover',
          ]"
        >
          {{ $t("confirmPassword") }}
        </label>
        <div
          :class="[
            'border p-3 bg-transparent transition-colors duration-500 ease-in-out',
            activeInput === 'confirmPassword' || form.confirmPassword
              ? 'border-main-red'
              : 'border-white border-opacity-50',
          ]"
          @click="focusConfirmPasswordInput"
        >
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirmPassword"
            required
            placeholder="*****"
            class="w-full bg-transparent font-medium text-white focus:outline-none"
            @focus="activeInput = 'confirmPassword'"
            @blur="activeInput = ''"
            ref="confirmPasswordInputRef"
          />
        </div>
        <p v-if="errors.confirmPassword" class="text-sm text-red-500">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center">
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

// Focus input functions
const focusEmailInput = () => {
  if (emailInputRef.value) {
    emailInputRef.value.focus();
  }
};

const focusPasswordInput = () => {
  if (passwordInputRef.value) {
    passwordInputRef.value.focus();
  }
};

const focusConfirmPasswordInput = () => {
  if (confirmPasswordInputRef.value) {
    confirmPasswordInputRef.value.focus();
  }
};

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
