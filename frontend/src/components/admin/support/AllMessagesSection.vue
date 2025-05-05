<template>
  <div class="bg-white rounded-lg shadow border border-gray-200">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">
        {{ $t("allMessages") }}
      </h2>

      <!-- Filters -->
      <FilterControls
        :sortOrder="sortOrder"
        :statusFilter="statusFilter"
        @update:sortOrder="$emit('update:sortOrder', $event)"
        @update:statusFilter="$emit('update:statusFilter', $event)"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div
        class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600">{{ $t("loading") }}</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center p-8 bg-red-50 text-red-600 rounded-md m-4"
    >
      <p>{{ error }}</p>
      <button
        @click="$emit('retry')"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ $t("retry") }}
      </button>
    </div>

    <!-- No Messages State -->
    <div v-else-if="messages.length === 0" class="text-center p-8">
      <p class="text-gray-500">{{ $t("noMessagesFound") }}</p>
    </div>

    <!-- Messages Table -->
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
            class="px-2 py-1 text-sm rounded-full"
            :class="getStatusClass(message.status)"
          >
            {{
              $t(
                `statuses.${
                  message.status === "in-progress"
                    ? "inProgress"
                    : message.status
                }`
              )
            }}
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

    <!-- Pagination -->
    <Pagination
      v-if="messages.length > 0"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="itemsPerPage"
      @update:currentPage="$emit('update:currentPage', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MessageTable from "./MessageTable.vue";
import FilterControls from "./FilterControls.vue";
import Pagination from "./Pagination.vue";
import type { SupportMessage, SupportStatus } from "@/types/support";

const props = defineProps<{
  messages: SupportMessage[];
  loading: boolean;
  error: string;
  sortOrder: "newest" | "oldest";
  statusFilter: SupportStatus | "";
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}>();

const emit = defineEmits<{
  (e: "view", message: SupportMessage): void;
  (e: "respond", message: SupportMessage): void;
  (e: "update:sortOrder", value: "newest" | "oldest"): void;
  (e: "update:statusFilter", value: SupportStatus | ""): void;
  (e: "update:currentPage", page: number): void;
  (e: "retry"): void;
}>();

/**
 * Returns appropriate CSS class based on message status
 */
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
