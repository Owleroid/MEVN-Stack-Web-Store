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
          {{ $t("status") }}
        </th>
        <th
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {{ $t("actions") }}
        </th>
      </template>

      <template #rowColumns="{ message }">
        <!-- Status column -->
        <td
          class="px-6 py-4 whitespace-nowrap"
          @click.stop="$emit('view', message)"
        >
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
        </td>

        <!-- Actions column -->
        <td class="px-6 py-4 whitespace-nowrap">
          <button
            @click.stop="$emit('respond', message)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {{ $t("respond") }}
          </button>
        </td>
      </template>
    </MessageTable>
  </div>
</template>

<script setup lang="ts">
import MessageTable from "./MessageTable.vue";

import type { SupportMessage, SupportStatus } from "@/types/support";

// Props
const props = defineProps<{
  messages: SupportMessage[];
}>();

// Events
const emit = defineEmits<{
  (e: "view", message: SupportMessage): void;
  (e: "respond", message: SupportMessage): void;
}>();

// Utility Functions
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
