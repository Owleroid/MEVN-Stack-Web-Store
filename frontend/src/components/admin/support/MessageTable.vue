<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 table-fixed">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
          >
            {{ $t("customer") }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
          >
            {{ $t("subject") }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
          >
            {{ $t("createdAt") }}
          </th>
          <!-- Dynamic header columns -->
          <slot name="headerColumns"></slot>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="message in messages"
          :key="message._id"
          class="hover:bg-gray-50 cursor-pointer transition-colors"
          @click="$emit('view', message)"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 truncate">
              {{ message.email }}
            </div>
            <div class="text-sm text-gray-500 truncate">
              {{ truncateText(message.message, 50) }}
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900 truncate">
              {{ message.subject }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(message.createdAt) }}
          </td>
          <!-- Dynamic row columns -->
          <slot name="rowColumns" :message="message"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import type { SupportMessage } from "@/types/support";

// Composables
const { t } = useI18n();

// Props & Emits
const props = defineProps<{
  messages: SupportMessage[];
}>();

const emit = defineEmits<{
  (e: "view", message: SupportMessage): void;
}>();

// Utility Functions
const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const formatDate = (date: Date | string): string => {
  if (!date) return t("dateNotAvailable");

  try {
    // Create a Date object if a string is provided
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if date is valid before formatting
    if (isNaN(dateObj.getTime())) {
      return t("dateNotAvailable");
    }

    // Format the date using Intl.DateTimeFormat for more consistent results
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
</script>
