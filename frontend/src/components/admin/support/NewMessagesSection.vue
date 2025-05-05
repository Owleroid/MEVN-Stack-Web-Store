<template>
  <div
    v-if="messages.length > 0"
    class="bg-white rounded-lg shadow border border-gray-200 mb-8"
  >
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800 flex items-center">
        {{ $t("newMessages") }}
        <span
          class="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full"
        >
          {{ messages.length }}
        </span>
      </h2>
    </div>

    <MessageTable :messages="messages" @view="$emit('view', $event)">
      <template #headerColumns>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {{ $t("actions") }}
        </th>
      </template>

      <template #rowColumns="{ message }">
        <td class="px-6 py-4 whitespace-nowrap">
          <button
            @click.stop="$emit('respond', message)"
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {{ $t("respond") }}
          </button>
        </td>
      </template>
    </MessageTable>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { SupportMessage } from "@/types/support";
import MessageTable from "./MessageTable.vue";

// ==============================
// Composables
// ==============================
const { t } = useI18n();

// ==============================
// Props
// ==============================
const props = defineProps<{
  /**
   * Array of new support messages to display
   */
  messages: SupportMessage[];
}>();

// ==============================
// Events
// ==============================
const emit = defineEmits<{
  /**
   * Emitted when a message is clicked to view
   */
  (e: "view", message: SupportMessage): void;
  /**
   * Emitted when the respond button is clicked for a message
   */
  (e: "respond", message: SupportMessage): void;
}>();
</script>
