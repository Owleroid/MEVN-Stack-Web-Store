<template>
  <div class="overflow-x-auto">
    <!-- Use a fixed width container to lock the entire table width -->
    <div class="w-full min-w-[900px]">
      <table class="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
              style="width: 33%"
            >
              {{ $t("customer") }}
            </th>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
              style="width: 25%"
            >
              {{ $t("subject") }}
            </th>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
              style="width: 17%"
            >
              {{ $t("createdAt") }}
            </th>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
              style="width: 12.5%"
            >
              {{ $t("status") }}
            </th>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
              style="width: 12.5%"
            >
              {{ $t("actions") }}
            </th>
          </tr>
        </thead>
        <transition-group
          tag="tbody"
          name="list"
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 transform -translate-y-4"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform -translate-y-4"
        >
          <tr
            v-for="(message, index) in messages"
            :key="message._id"
            class="hover:bg-gray-50 cursor-pointer transition-all duration-200"
            @click="viewMessage(message)"
          >
            <td
              class="p-4"
              :class="{
                'border-b border-gray-200': index !== messages.length - 1,
              }"
              style="width: 33%"
            >
              <div class="text-sm font-medium text-gray-900 truncate">
                {{ message.email }}
              </div>
              <div class="text-sm text-gray-500 truncate">
                {{ truncateText(message.message, 50) }}
              </div>
            </td>
            <td
              class="p-4"
              :class="{
                'border-b border-gray-200': index !== messages.length - 1,
              }"
              style="width: 25%"
            >
              <div class="text-sm text-gray-900 truncate">
                {{ message.subject || $t("noSubject") }}
              </div>
            </td>
            <td
              class="p-4 text-sm text-gray-500 whitespace-nowrap"
              :class="{
                'border-b border-gray-200': index !== messages.length - 1,
              }"
              style="width: 17%"
            >
              {{ formatDate(message.createdAt) }}
            </td>
            <td
              class="p-4"
              :class="{
                'border-b border-gray-200': index !== messages.length - 1,
              }"
              style="width: 12.5%"
            >
              <span
                class="px-2 py-1 text-sm rounded-full whitespace-nowrap inline-block"
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
            </td>
            <td
              class="p-4"
              :class="{
                'border-b border-gray-200': index !== messages.length - 1,
              }"
              style="width: 12.5%"
            >
              <button
                @click.stop="respondToMessage(message)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm whitespace-nowrap"
              >
                {{ $t("respond") }}
              </button>
            </td>
          </tr>
        </transition-group>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import type { SupportMessage, SupportStatus } from "@/types/support";

// Composables
const { t } = useI18n();

// Props & Emits
const props = defineProps<{
  messages: SupportMessage[];
}>();

const emit = defineEmits<{
  (e: "view", message: SupportMessage): void;
  (e: "respond", message: SupportMessage): void;
}>();

// Event Handlers
const viewMessage = (message: SupportMessage): void => {
  emit("view", message);
};

const respondToMessage = (message: SupportMessage): void => {
  emit("respond", message);
};

// Utility Functions
const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const formatDate = (date: Date | string): string => {
  if (!date) return t("dateNotAvailable");

  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return t("dateNotAvailable");
    }

    return new Intl.DateTimeFormat(
      document.documentElement.lang === "ru" ? "ru-RU" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return t("dateNotAvailable");
  }
};

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
</script>
