vue
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("orderId") }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("products") }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("date") }}
          </th>
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
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="order in orders"
          :key="order._id"
          @click="viewOrder(order)"
          class="hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <td class="px-6 py-4 whitespace-nowrap text-blue-600 underline">
            {{ order.orderNumber }}
          </td>
          <td class="px-6 py-4">
            <ul class="list-disc ml-4 text-sm">
              <li
                v-for="product in order.products"
                :key="product.productId"
                class="mb-1 last:mb-0"
              >
                {{ product.name }} ({{ product.amount }})
              </li>
            </ul>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ formatDate(order.dateOfCreation) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="px-2 py-1 text-sm rounded-full"
              :class="getStatusClass(order.status)"
            >
              {{ $t(statusKey(order.status)) }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button
              @click.stop="editOrder(order)"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {{ $t("edit") }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { OrderData, OrderStatus } from "@/types/orders";

// ==============================
// Composables
// ==============================
const { t } = useI18n();

// ==============================
// Props Definition
// ==============================

/**
 * Component props
 */
const props = defineProps<{
  /** List of orders to display in the table */
  orders: OrderData[];
}>();

// ==============================
// Events Definition
// ==============================

/**
 * Component events
 */
const emit = defineEmits<{
  /**
   * Emitted when an order is clicked to view details
   */
  (e: "viewOrder", order: OrderData): void;

  /**
   * Emitted when the edit button is clicked for an order
   */
  (e: "editOrder", order: OrderData): void;

  /**
   * Emitted when the status of an order is updated
   */
  (e: "updateOrderStatus", orderId: string, status: OrderStatus): void;
}>();

// ==============================
// Action Handlers
// ==============================

/**
 * Emits event to view order details
 * @param order - The order to view
 */
const viewOrder = (order: OrderData): void => {
  emit("viewOrder", order);
};

/**
 * Emits event to edit order
 * @param order - The order to edit
 */
const editOrder = (order: OrderData): void => {
  emit("editOrder", order);
};

// ==============================
// Utility Functions
// ==============================

/**
 * Formats a date for display
 * @param date - The date to format
 * @returns Formatted date string or placeholder
 */
const formatDate = (date?: Date | string): string => {
  if (!date) return t("dateNotAvailable");

  return new Date(date).toLocaleString();
};

/**
 * Converts status string from backend format to translation key format
 * @param status - The order status from backend (e.g. "waiting confirmation")
 * @returns The corresponding translation key (e.g. "waitingConfirmation")
 */
const statusKey = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "statuses.waitingConfirmation";
    case "packing":
      return "statuses.packing";
    case "sended":
      return "statuses.sended";
    case "delivered":
      return "statuses.delivered";
    case "canceled":
      return "statuses.canceled";
    default:
      return "statuses.unknown";
  }
};

/**
 * Returns appropriate CSS class based on order status
 * @param status - The order status
 * @returns CSS class for styling the status badge
 */
const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "bg-yellow-100 text-yellow-800";
    case "packing":
      return "bg-blue-100 text-blue-800";
    case "sended":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
</script>
