<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- New Orders Section -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden"
      >
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h2 class="text-lg font-semibold text-gray-800">
            {{ $t("newOrders") }}
          </h2>
        </div>

        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
          mode="out-in"
        >
          <!-- No New Orders State -->
          <div
            v-if="newOrders.length === 0"
            class="flex justify-center items-center p-8"
            key="empty-state"
          >
            <div class="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-gray-300 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p class="text-gray-500">{{ $t("noNewOrders") }}</p>
            </div>
          </div>

          <!-- New Orders Table -->
          <div v-else key="orders-table">
            <OrderTable
              :orders="newOrders"
              @viewOrder="viewOrder"
              @editOrder="editOrder"
              @updateOrderStatus="updateOrderStatus"
            />
          </div>
        </transition>
      </div>

      <!-- All Orders Section -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            {{ $t("allOrders") }}
          </h2>

          <!-- Filters -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <label
                for="sortOrder"
                class="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                {{ $t("sortByDate") }}:
              </label>
              <select
                v-model="sortOrder"
                id="sortOrder"
                class="block w-full sm:w-auto min-w-[180px] py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition-colors duration-200"
              >
                <option value="newest">{{ $t("newestToOldest") }}</option>
                <option value="oldest">{{ $t("oldestToNewest") }}</option>
              </select>
            </div>

            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <label
                for="statusFilter"
                class="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                {{ $t("filterByStatus") }}:
              </label>
              <select
                v-model="statusFilter"
                id="statusFilter"
                class="block w-full sm:w-auto min-w-[180px] py-2 px-3 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition-colors duration-200"
              >
                <option value="">{{ $t("allStatuses") }}</option>
                <option value="waiting confirmation">
                  {{ $t("waitingConfirmation") }}
                </option>
                <option value="packing">{{ $t("packing") }}</option>
                <option value="sended">{{ $t("sended") }}</option>
                <option value="delivered">{{ $t("delivered") }}</option>
                <option value="canceled">{{ $t("canceled") }}</option>
              </select>
            </div>
          </div>
        </div>

        <transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <!-- No Orders State -->
          <div
            v-if="filteredOrders.length === 0"
            class="flex justify-center items-center py-16"
            key="no-orders"
          >
            <div class="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p class="text-gray-500 text-lg mb-2">
                {{ $t("noOrdersFound") }}
              </p>
              <p class="text-gray-400 text-sm">
                {{ $t("tryAdjustingFilters") }}
              </p>
            </div>
          </div>

          <!-- Orders Table -->
          <div v-else key="filtered-orders">
            <OrderTable
              :orders="filteredOrders"
              @viewOrder="viewOrder"
              @editOrder="editOrder"
              @updateOrderStatus="updateOrderStatus"
            />
          </div>
        </transition>
      </div>
    </div>

    <!-- Order Modal -->
    <OrderModal
      :show="showModal"
      :isEditing="isEditing"
      :order="selectedOrder"
      @close="closeModal"
      @submitForm="updateOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import OrderTable from "@/components/admin/orders/OrderTable.vue";
import OrderModal from "@/components/admin/orders/EditOrderModal.vue";

import type {
  OrderData,
  OrderStatus,
  OrdersListResponse,
} from "@/types/orders";

import { getAllOrders, editOrderById } from "@/services/orderService";

// Composables Setup
const { t } = useI18n();
const toast = useToast();

// State Management
// Data state
const orders = ref<OrderData[]>([]);
const selectedOrder = ref<OrderData | null>(null);

// UI state
const showModal = ref<boolean>(false);
const isEditing = ref<boolean>(false);

// Filter state
const sortOrder = ref<"newest" | "oldest">("newest");
const statusFilter = ref<OrderStatus | "">("");

// Computed Properties
const newOrders = computed<OrderData[]>(() => {
  return orders.value.filter((order) => !order.checked);
});

const filteredOrders = computed<OrderData[]>(() => {
  // Start with checked orders only (not new)
  let filtered = orders.value.filter((order) => order.checked);

  // Apply status filter if selected
  if (statusFilter.value) {
    filtered = filtered.filter((order) => order.status === statusFilter.value);
  }

  // Apply sort order
  if (sortOrder.value === "newest") {
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.dateOfCreation || 0).getTime() -
        new Date(a.dateOfCreation || 0).getTime()
    );
  } else {
    filtered = filtered.sort(
      (a, b) =>
        new Date(a.dateOfCreation || 0).getTime() -
        new Date(b.dateOfCreation || 0).getTime()
    );
  }

  return filtered;
});

// Data Fetching
const fetchOrders = async (): Promise<void> => {
  try {
    const response: OrdersListResponse = await getAllOrders();
    orders.value = response.orders;
  } catch (error: unknown) {
    console.error("Error fetching orders:", error);
    toast.error(t("fetchOrdersError"));
  }
};

// Modal Management
const viewOrder = (order: OrderData): void => {
  selectedOrder.value = order;
  isEditing.value = false;
  showModal.value = true;
};

const editOrder = (order: OrderData): void => {
  selectedOrder.value = order;
  isEditing.value = true;
  showModal.value = true;
};

const closeModal = (): void => {
  showModal.value = false;
  selectedOrder.value = null;
  isEditing.value = false;
};

// CRUD Operations
const updateOrder = async (updatedOrder: OrderData | null): Promise<void> => {
  if (!updatedOrder || !updatedOrder._id) {
    console.error("Invalid order: null or missing ID");
    return;
  }

  try {
    await editOrderById(updatedOrder._id, updatedOrder);
    await fetchOrders();
    closeModal();
    toast.success(t("orderUpdated"));
  } catch (error: unknown) {
    console.error("Error updating order:", error);
    toast.error(t("orderUpdateError"));
  }
};

const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  try {
    // Find the current order
    const currentOrder = orders.value.find((order) => order._id === orderId);
    if (!currentOrder) {
      throw new Error("Order not found");
    }

    // Clone the order to avoid UI issues during update
    const orderToUpdate = { ...currentOrder };

    // Set the new status
    orderToUpdate.status = status;

    // Update the order with the complete data
    await editOrderById(orderId, orderToUpdate);
    await fetchOrders();

    // Show appropriate success message
    if (status === "canceled") {
      toast.success(t("orderCanceled"));
    } else {
      toast.success(t("orderStatusUpdated"));
    }
  } catch (error: unknown) {
    console.error("Error updating order status:", error);
    toast.error(t("orderStatusUpdateError"));
    // Refresh to reset any UI inconsistencies
    await fetchOrders();
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchOrders();
});
</script>
