<template>
  <div
    v-if="show"
    class="fixed inset-0 z-10 flex items-center justify-center overflow-auto bg-black/40"
  >
    <div
      class="relative w-11/12 max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-lg"
    >
      <!-- Modal Header -->
      <button
        @click="close"
        class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors"
      >
        &times;
      </button>

      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        {{ isResponding ? $t("respondToMessage") : $t("messageDetails") }}
      </h2>

      <div v-if="message" class="space-y-6">
        <!-- Message Details Section -->
        <section class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            {{ $t("messageDetails") }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600 mb-1">{{ $t("from") }}:</p>
              <p class="font-medium">{{ message.email }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600 mb-1">{{ $t("date") }}:</p>
              <p class="font-medium">
                {{ formatDate(message.createdAt) }}
              </p>
            </div>

            <div class="col-span-1 md:col-span-2">
              <p class="text-sm text-gray-600 mb-1">{{ $t("subject") }}:</p>
              <p class="font-medium">
                {{ message.subject || $t("noSubject") }}
              </p>
            </div>

            <div class="col-span-1 md:col-span-2">
              <p class="text-sm text-gray-600 mb-1">{{ $t("status") }}:</p>
              <select
                v-if="isResponding"
                v-model="selectedStatus"
                id="status"
                class="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="new">{{ $t("statuses.new") }}</option>
                <option value="in-progress">
                  {{ $t("statuses.inProgress") }}
                </option>
                <option value="resolved">{{ $t("statuses.resolved") }}</option>
              </select>
              <p v-else class="font-medium">
                <span
                  class="px-2 py-1 text-sm rounded-full"
                  :class="getStatusClass(message.status)"
                >
                  {{ $t(`statuses.${message.status.replace("-", "")}`) }}
                </span>
              </p>
            </div>
          </div>
        </section>

        <!-- Message Content -->
        <section class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            {{ $t("messageContent") }}
          </h3>
          <div class="p-3 bg-white border border-gray-200 rounded-md">
            <p class="whitespace-pre-wrap">{{ message.message }}</p>
          </div>
        </section>

        <!-- Previous Response (if exists) -->
        <section
          v-if="message.response"
          class="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            {{ $t("previousResponse") }}
          </h3>
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p class="whitespace-pre-wrap">{{ message.response }}</p>
          </div>
        </section>

        <!-- Response Form -->
        <section
          v-if="isResponding"
          class="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            {{ $t("yourResponse") }}
          </h3>

          <div class="space-y-4">
            <div>
              <textarea
                v-model="responseText"
                rows="6"
                :placeholder="$t('responseTextPlaceholder')"
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': responseError }"
              ></textarea>
              <p v-if="responseError" class="mt-1 text-sm text-red-600">
                {{ responseError }}
              </p>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-between">
          <button
            @click="showDeleteConfirm = true"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {{ $t("delete") }}
          </button>

          <div class="space-x-2">
            <button
              @click="close"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {{ $t("cancel") }}
            </button>

            <button
              v-if="isResponding"
              @click="handleSubmitResponse"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {{ $t("sendResponse") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteConfirm"
    class="fixed inset-0 z-20 flex items-center justify-center overflow-auto bg-black/50"
    @click="showDeleteConfirm = false"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      @click.stop
    >
      <h3 class="text-lg font-bold text-gray-900 mb-3">
        {{ $t("confirmDelete") }}
      </h3>

      <div class="text-gray-700 mb-6">
        {{ $t("deleteConfirmMessage") }}
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="showDeleteConfirm = false"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          {{ $t("cancel") }}
        </button>
        <button
          @click="handleDeleteConfirm"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {{ $t("delete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { SupportMessage } from "@/types/support";

// ==============================
// Composables Setup
// ==============================
const { t, locale } = useI18n();

// ==============================
// Props Definition
// ==============================
const props = defineProps<{
  show: boolean;
  isResponding: boolean;
  message: SupportMessage | null;
}>();

// ==============================
// Emits Definition
// ==============================
const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "submitResponse",
    messageId: string,
    response: string,
    status: "new" | "in-progress" | "resolved"
  ): void;
  (e: "deleteMessage", messageId: string): void;
}>();

// ==============================
// State Management
// ==============================
const responseText = ref("");
const selectedStatus = ref<"new" | "in-progress" | "resolved">("in-progress");
const responseError = ref("");
const showDeleteConfirm = ref(false);

// ==============================
// Action Handlers
// ==============================

/**
 * Closes the modal
 */
const close = () => {
  emit("close");
};

/**
 * Handles the submit response action
 */
const handleSubmitResponse = () => {
  if (!props.message) return;

  responseError.value = "";

  if (!responseText.value.trim()) {
    responseError.value = t("responseRequired");
    return;
  }

  emit(
    "submitResponse",
    props.message._id,
    responseText.value,
    selectedStatus.value
  );
};

/**
 * Handles the confirmation of deletion
 */
const handleDeleteConfirm = () => {
  if (!props.message) return;

  emit("deleteMessage", props.message._id);
  showDeleteConfirm.value = false;
};

// ==============================
// Helper Methods
// ==============================

/**
 * Returns appropriate CSS class based on message status
 * @param status - The message status
 * @returns CSS class for status badge
 */
const getStatusClass = (status: string): string => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * Format date with locale support
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale.value === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

// ==============================
// Watchers
// ==============================

/**
 * Reset form when message changes
 */
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      responseText.value = "";
      selectedStatus.value = newMessage.status || "in-progress";
      responseError.value = "";
    }
  }
);
</script>
