<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Contact Information -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          {{ $t("title") }}
        </h1>

        <p class="text-lg text-gray-700 mb-8">
          {{ $t("description") }}
        </p>

        <div class="space-y-6">
          <!-- Email -->
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ $t("email") }}
              </h3>
              <p class="mt-1 text-gray-600">contact@irbis-miniatures.com</p>
            </div>
          </div>

          <!-- Phone -->
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ $t("phone") }}
              </h3>
              <p class="mt-1 text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>

          <!-- Address -->
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ $t("address") }}
              </h3>
              <p class="mt-1 text-gray-600">
                {{ $t("addressDetails") }}
              </p>
            </div>
          </div>

          <!-- Social Media -->
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ $t("followUs") }}
              </h3>
              <div class="mt-2 flex space-x-4">
                <a href="#" class="text-gray-500 hover:text-blue-700">
                  <span class="sr-only">Instagram</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" class="text-gray-500 hover:text-blue-700">
                  <span class="sr-only">Facebook</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" class="text-gray-500 hover:text-blue-700">
                  <span class="sr-only">Twitter</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div>
        <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            {{ $t("contactUs") }}
          </h2>

          <p class="text-gray-600 mb-6">
            {{ $t("formDescription") }}
          </p>

          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Email Input -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("email") }} *
              </label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                required
                placeholder="email@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <!-- Subject Input -->
            <div>
              <label
                for="subject"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("subject") }}
              </label>
              <input
                type="text"
                id="subject"
                v-model="form.subject"
                :placeholder="$t('subjectPlaceholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <!-- Message Input -->
            <div>
              <label
                for="message"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("message") }} *
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="6"
                :placeholder="$t('messagePlaceholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :class="{ 'border-red-500': errors.message }"
              ></textarea>
              <p v-if="errors.message" class="mt-1 text-sm text-red-600">
                {{ errors.message }}
              </p>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
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
                  {{ $t("sending") }}
                </span>
                <span v-else>{{ $t("send") }}</span>
              </button>
            </div>
          </form>

          <!-- Success Message -->
          <div
            v-if="submissionSuccess"
            class="mt-6 p-4 bg-green-50 text-green-800 rounded-md"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-green-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <p>{{ $t("messageSentSuccess") }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { submitSupportMessage } from "@/services/supportService";
import { useAuthStore } from "@/stores/authStore";

// ==============================
// Composables Setup
// ==============================
const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();

// ==============================
// State Management
// ==============================
const form = reactive({
  email: authStore.isAuthenticated ? authStore.userEmail : "",
  subject: "",
  message: "",
});

const errors = reactive({
  email: "",
  message: "",
});

const loading = ref(false);
const submissionSuccess = ref(false);

// ==============================
// Form Handling
// ==============================

/**
 * Validates the form data
 * @returns boolean indicating if the form is valid
 */
const validateForm = (): boolean => {
  let valid = true;
  errors.email = "";
  errors.message = "";

  // Email validation
  if (!form.email) {
    errors.email = t("emailRequired");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t("emailInvalid");
    valid = false;
  }

  // Message validation
  if (!form.message) {
    errors.message = t("messageRequired");
    valid = false;
  } else if (form.message.length < 10) {
    errors.message = t("messageTooShort");
    valid = false;
  }

  return valid;
};

/**
 * Submits the form
 */
const submitForm = async (): Promise<void> => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    await submitSupportMessage({
      email: form.email,
      subject: form.subject,
      message: form.message,
    });

    // Reset form and show success message
    form.subject = "";
    form.message = "";
    if (!authStore.isAuthenticated) {
      form.email = "";
    }

    submissionSuccess.value = true;

    // Hide success message after 5 seconds
    setTimeout(() => {
      submissionSuccess.value = false;
    }, 5000);

    toast.success(t("messageSentSuccess"));
  } catch (error) {
    console.error("Error submitting support message:", error);
    toast.error(t("messageSendFailed"));
  } finally {
    loading.value = false;
  }
};
</script>
