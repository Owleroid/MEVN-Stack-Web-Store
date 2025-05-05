<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("subject") }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("email") }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("date") }}
          </th>
          <!-- Additional header columns via slot -->
          <slot name="headerColumns"></slot>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="message in messages"
          :key="message._id"
          class="hover:bg-gray-50 transition-colors cursor-pointer"
          @click="$emit('view', message)"
        >
          <td class="px-6 py-4">
            <div class="text-sm font-medium text-gray-900">
              {{ message.subject || $t("noSubject") }}
            </div>
            <div class="text-sm text-gray-500 line-clamp-1">
              {{ message.message }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ message.email }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">
              {{ formatDate(message.createdAt) }}
            </div>
          </td>
          <!-- Additional row columns via scoped slot -->
          <slot name="rowColumns" :message="message"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { SupportMessage } from "@/types/support";

// ==============================
// Composables
// ==============================
const { t, d } = useI18n();

// ==============================
// Props
// ==============================
const props = defineProps<{
  /**
   * Array of support messages to display
   */
  messages: SupportMessage[];
}>();

// ==============================
// Emits
// ==============================
const emit = defineEmits<{
  /**
   * Emitted when a message is clicked to view
   */
  (e: "view", message: SupportMessage): void;
}>();

// ==============================
// Helper Methods
// ==============================

/**
 * Formats a date for display
 * @param date - Date to format (can be Date object or string)
 * @returns Formatted date string
 */
const formatDate = (date: Date | string): string => {
  if (!date) return t("dateNotAvailable");

  // Create a Date object if a string is provided
  const dateObj = date instanceof Date ? date : new Date(date);

  // Format the date using i18n
  return d(dateObj, "short");
};
</script>
