<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- New Orders Section -->
    <div class="bg-white rounded-lg shadow border border-gray-200 mb-8">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ $t("newOrders") }}
        </h2>
      </div>

      <!-- No New Orders State -->
      <div v-if="newOrders.length === 0" class="text-center p-8">
        <p class="text-gray-500">{{ $t("noNewOrders") }}</p>
      </div>

      <!-- New Orders Table -->
      <div v-else>
        <OrderTable
          :orders="newOrders"
          @viewOrder="viewOrder"
          @editOrder="editOrder"
          @updateOrderStatus="updateOrderStatus"
        />
      </div>
    </div>

    <!-- All Orders Section -->
    <div class="bg-white rounded-lg shadow border border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
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
              class="mt-1 block w-full sm:w-auto min-w-[180px] py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              class="mt-1 block w-full sm:w-auto min-w-[180px] py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{{ $t("allStatuses") }}</option>
              <option value="packing">{{ $t("packing") }}</option>
              <option value="sended">{{ $t("sended") }}</option>
              <option value="delivered">{{ $t("delivered") }}</option>
              <option value="canceled">{{ $t("canceled") }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- No Orders State -->
      <div v-if="filteredOrders.length === 0" class="text-center p-8">
        <p class="text-gray-500">{{ $t("noOrdersFound") }}</p>
      </div>

      <!-- Orders Table -->
      <div v-else>
        <OrderTable
          :orders="filteredOrders"
          @viewOrder="viewOrder"
          @editOrder="editOrder"
          @updateOrderStatus="updateOrderStatus"
        />
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
