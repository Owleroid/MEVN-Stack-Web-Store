<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-10 overflow-auto"
    @click="close"
  >
    <div
      class="relative w-11/12 max-w-3xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Modal Header -->
      <div
        class="sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 rounded-t-xl px-6 pt-6 pb-4"
      >
        <button
          @click="close"
          class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors focus:outline-none focus:text-blue-600"
        >
          &times;
        </button>
        <h2 class="text-xl font-bold text-gray-800">
          {{ isResponding ? $t("respondToMessage") : $t("messageDetails") }}
        </h2>
      </div>

      <div v-if="message" class="p-6 space-y-6">
        <!-- Message Details Section -->
        <section
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t("messageDetails") }}
            </h3>
          </div>

          <div class="p-6 space-y-4">
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
                  class="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="new">{{ $t("new") }}</option>
                  <option value="in-progress">
                    {{ $t("inProgress") }}
                  </option>
                  <option value="resolved">{{ $t("resolved") }}</option>
                </select>
                <p v-else class="font-medium">
                  <span
                    class="px-2 py-1 text-sm rounded-full"
                    :class="getStatusClass(message.status)"
                  >
                    {{
                      $t(
                        `${
                          message.status === "in-progress"
                            ? "inProgress"
                            : message.status
                        }`
                      )
                    }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Message Content -->
        <section
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t("messageContent") }}
            </h3>
          </div>
          <div class="p-6">
            <div class="p-3 bg-white border border-gray-200 rounded-md">
              <p class="whitespace-pre-wrap">{{ message.message }}</p>
            </div>
          </div>
        </section>

        <!-- Previous Response (if exists) -->
        <section
          v-if="message.response"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t("previousResponse") }}
            </h3>
          </div>
          <div class="p-6">
            <div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p class="whitespace-pre-wrap">{{ message.response }}</p>
            </div>
          </div>
        </section>

        <!-- Response Form -->
        <section
          v-if="isResponding"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t("yourResponse") }}
            </h3>
          </div>

          <div class="p-6">
            <div>
              <textarea
                v-model="responseText"
                rows="6"
                :placeholder="$t('responseTextPlaceholder')"
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
            @click="handleDeleteMessage"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
          >
            {{ $t("delete") }}
          </button>

          <div class="space-x-2">
            <button
              @click="close"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm"
            >
              {{ $t("cancel") }}
            </button>

            <button
              v-if="isResponding"
              @click="handleSubmitResponse"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
            >
              {{ $t("sendResponse") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import type { SupportMessage, SupportStatus } from "@/types/support";

// Composables Setup
const { t, locale } = useI18n();

// Props Definition
const props = defineProps<{
  show: boolean;
  isResponding: boolean;
  message: SupportMessage | null;
}>();

// Emits Definition
const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "submitResponse",
    messageId: string,
    response: string,
    status: SupportStatus
  ): void;
  (e: "deleteMessage", messageId: string): void;
}>();

// State Management
const responseText = ref("");
const selectedStatus = ref<SupportStatus>("in-progress");
const responseError = ref("");

// Action Handlers
const close = (): void => {
  emit("close");
};

const handleSubmitResponse = (): void => {
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

const handleDeleteMessage = (): void => {
  if (!props.message) return;
  emit("deleteMessage", props.message._id);
};

// Helper Methods
const getStatusClass = (status: SupportStatus): string => {
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

const formatDate = (dateString: Date | string): string => {
  if (!dateString) return t("dateNotAvailable");

  const date = dateString instanceof Date ? dateString : new Date(dateString);

  return new Intl.DateTimeFormat(locale.value === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

// Watchers
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
