/OrderTable.vue
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("orderNumber") }}
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("products") }}
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("date") }}
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("status") }}
          </th>
          <th
            scope="col"
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
          class="hover:bg-gray-50 transition-colors"
        >
          <td
            @click="viewOrder(order)"
            class="px-6 py-4 whitespace-nowrap text-blue-600 underline cursor-pointer"
          >
            {{ order.orderNumber }}
          </td>
          <td @click="viewOrder(order)" class="px-6 py-4 cursor-pointer">
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
          <td
            @click="viewOrder(order)"
            class="px-6 py-4 whitespace-nowrap cursor-pointer"
          >
            {{ formatDate(order.dateOfCreation) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select
              v-model="order.status"
              @change="updateStatus(order)"
              class="py-1 px-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              :class="getStatusSelectClass(order.status)"
            >
              <option
                v-if="order.status === 'waiting confirmation'"
                value="waiting confirmation"
              >
                {{ $t("waiting confirmation") }}
              </option>
              <option value="packing">{{ $t("packing") }}</option>
              <option value="sended">{{ $t("sended") }}</option>
              <option value="delivered">{{ $t("delivered") }}</option>
              <option value="canceled">{{ $t("canceled") }}</option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button
              @click.stop="editOrder(order)"
              :disabled="order.status === 'canceled'"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="{
                'opacity-50 cursor-not-allowed': order.status === 'canceled',
              }"
            >
              {{ $t("edit") }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Cancel Order Modal -->
    <CancelOrderModal
      :show="showCancelModal"
      :order="orderToCancel"
      @close="closeCancelModal"
      @confirmCancel="confirmCancelOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import CancelOrderModal from "./CancelOrderModal.vue";

import type { OrderData, OrderStatus } from "@/types/orders";

// Composables
const { t } = useI18n();
const toast = useToast();

// Props Definition
const props = defineProps<{
  orders: OrderData[];
}>();

// Events Definition
const emit = defineEmits<{
  (e: "viewOrder", order: OrderData): void;
  (e: "editOrder", order: OrderData): void;
  (e: "updateOrderStatus", orderId: string, status: OrderStatus): void;
}>();

// State Management for Cancel Modal
const showCancelModal = ref<boolean>(false);
const orderToCancel = ref<OrderData | null>(null);

// Track original statuses to handle cancellations
const originalStatuses = ref<Record<string, OrderStatus>>({});

// Initialize tracking of original statuses
for (const order of props.orders) {
  if (order._id) {
    originalStatuses.value[order._id] = order.status;
  }
}

// Action Handlers
const viewOrder = (order: OrderData): void => {
  emit("viewOrder", order);
};

const editOrder = (order: OrderData): void => {
  if (order.status === "canceled") {
    return;
  }
  emit("editOrder", order);
};

const updateStatus = (order: OrderData): void => {
  if (!order._id) return;

  const newStatus = order.status;
  const oldStatus = originalStatuses.value[order._id];

  if (oldStatus !== "canceled" && newStatus === "canceled") {
    order.status = oldStatus;

    orderToCancel.value = order;
    showCancelModal.value = true;
    return;
  }

  emit("updateOrderStatus", order._id, order.status);
  originalStatuses.value[order._id] = order.status;
};

// Modal action handlers
const closeCancelModal = (): void => {
  showCancelModal.value = false;
  orderToCancel.value = null;
};

const confirmCancelOrder = (orderId: string): void => {
  emit("updateOrderStatus", orderId, "canceled");

  if (orderId) {
    originalStatuses.value[orderId] = "canceled";
  }
};

// Utility Functions
const formatDate = (date?: Date | string): string => {
  if (!date) return t("dateNotAvailable");
  return new Date(date).toLocaleString();
};

// Function for select styling
const getStatusSelectClass = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "bg-yellow-50 border-yellow-300";
    case "packing":
      return "bg-blue-50 border-blue-300";
    case "sended":
      return "bg-purple-50 border-purple-300";
    case "delivered":
      return "bg-green-50 border-green-300";
    case "canceled":
      return "bg-red-50 border-red-300";
    default:
      return "";
  }
};
</script>
