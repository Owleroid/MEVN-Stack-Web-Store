<template>
  <div
    v-if="show"
    class="fixed inset-0 z-20 flex items-center justify-center overflow-auto bg-black/50"
    @click="close"
  >
    <div
      class="relative w-11/12 max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg"
      @click.stop
    >
      <!-- Modal Header -->
      <button
        @click="close"
        class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors"
      >
        &times;
      </button>

      <h2 class="text-xl font-bold text-gray-800 mb-4">
        {{ $t("cancelOrderTitle") }}
      </h2>

      <div class="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-md">
        <div class="flex items-center">
          <svg
            class="w-6 h-6 text-yellow-600 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p class="font-medium text-yellow-700">
            {{ $t("cancelOrderWarning") }}
          </p>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-md font-semibold text-gray-700 mb-2">
          {{ $t("orderSummary") }}:
        </h3>
        <div v-if="order" class="border-t border-b py-3 mb-4">
          <p class="mb-1">
            <span class="text-gray-600">{{ $t("orderId") }}:</span>
            <span class="ml-2 font-medium">{{ order.orderNumber }}</span>
          </p>
          <p class="mb-1">
            <span class="text-gray-600">{{ $t("date") }}:</span>
            <span class="ml-2">{{ formatDate(order.dateOfCreation) }}</span>
          </p>
          <p>
            <span class="text-gray-600">{{ $t("products") }}:</span>
            <span class="ml-2">{{ order.products.length }}</span>
          </p>
        </div>
      </div>

      <div class="text-sm mb-6">
        <p class="text-gray-700 mb-2">
          {{ $t("cancelOrderDescription") }}
        </p>
        <ul class="list-disc ml-5 text-gray-600">
          <li>{{ $t("cancelOrderEffect1") }}</li>
          <li>{{ $t("cancelOrderEffect2") }}</li>
          <li>{{ $t("cancelOrderEffect3") }}</li>
        </ul>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="close"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          {{ $t("cancel") }}
        </button>
        <button
          @click="confirmCancellation"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {{ $t("confirmCancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import type { OrderData } from "@/types/orders";

// Composables
const { t } = useI18n();

// Props Definition
const props = defineProps<{
  show: boolean;
  order: OrderData | null;
}>();

// Events Definition
const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirmCancel", orderId: string): void;
}>();

// Action Handlers
const close = () => {
  emit("close");
};

const confirmCancellation = () => {
  if (props.order && props.order._id) {
    emit("confirmCancel", props.order._id);
    close();
  }
};

// Helper Functions
const formatDate = (date?: Date | string): string => {
  if (!date) return t("dateNotAvailable");
  return new Date(date).toLocaleString();
};
</script>
