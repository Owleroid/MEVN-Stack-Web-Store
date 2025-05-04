<template>
  <div class="bg-white rounded-lg shadow border border-gray-200 mb-8">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800">
        {{ $t("newMessages") }}
      </h2>
    </div>

    <!-- No New Messages State -->
    <div v-if="messages.length === 0" class="text-center p-8">
      <p class="text-gray-500">{{ $t("noNewMessages") }}</p>
    </div>

    <!-- New Messages Table -->
    <MessageTable v-else :messages="messages" @view="$emit('view', $event)">
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
        <td class="px-6 py-4 whitespace-nowrap" @click="$emit('view', message)">
          <span
            class="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800"
          >
            {{ $t("statuses.new") }}
          </span>
        </td>
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
import type { SupportMessage } from "@/types/support";

const props = defineProps<{
  messages: SupportMessage[];
}>();

const emit = defineEmits<{
  (e: "view", message: SupportMessage): void;
  (e: "respond", message: SupportMessage): void;
}>();
</script>
