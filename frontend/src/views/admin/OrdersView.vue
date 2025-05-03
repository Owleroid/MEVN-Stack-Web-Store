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
              <option value="">{{ $t("statuses.all") }}</option>
              <option value="packing">{{ $t("statuses.packing") }}</option>
              <option value="sended">{{ $t("statuses.sended") }}</option>
              <option value="delivered">{{ $t("statuses.delivered") }}</option>
              <option value="canceled">{{ $t("statuses.canceled") }}</option>
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

// Component imports
import OrderTable from "@/components/admin/orders/OrderTable.vue";
import OrderModal from "@/components/admin/orders/EditOrderModal.vue";

// Type imports
import type { Order } from "@/types/orders";

// Service imports
import { getAllOrders, editOrderById } from "@/services/orderService";

// ==============================
// Composables Setup
// ==============================
const { t } = useI18n();
const toast = useToast();

// ==============================
// State Management
// ==============================

// Data state
const orders = ref<Order[]>([]);
const selectedOrder = ref<Order | null>(null);

// UI state
const showModal = ref(false);
const isEditing = ref(false);

// Filter state
const sortOrder = ref("newest");
const statusFilter = ref("");

// ==============================
// Computed Properties
// ==============================

/**
 * Returns orders that have not been checked yet (new orders)
 */
const newOrders = computed(() => {
  return orders.value.filter((order) => !order.checked);
});

/**
 * Returns filtered and sorted orders based on user selection
 */
const filteredOrders = computed(() => {
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
        new Date(b.dateOfCreation).getTime() -
        new Date(a.dateOfCreation).getTime()
    );
  } else {
    filtered = filtered.sort(
      (a, b) =>
        new Date(a.dateOfCreation).getTime() -
        new Date(b.dateOfCreation).getTime()
    );
  }

  return filtered;
});

// ==============================
// Data Fetching
// ==============================

/**
 * Fetches all orders from the API
 */
const fetchOrders = async () => {
  try {
    const response = await getAllOrders();
    orders.value = response.data.orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error(t("fetchOrdersError"));
  }
};

// ==============================
// Modal Management
// ==============================

/**
 * Opens the view order modal
 * @param order - Order to view
 */
const viewOrder = (order: Order) => {
  selectedOrder.value = order;
  isEditing.value = false;
  showModal.value = true;
};

/**
 * Opens the edit order modal
 * @param order - Order to edit
 */
const editOrder = (order: Order) => {
  selectedOrder.value = order;
  isEditing.value = true;
  showModal.value = true;
};

/**
 * Closes the order modal
 */
const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
  isEditing.value = false;
};

// ==============================
// CRUD Operations
// ==============================

/**
 * Updates an order with new information
 * @param updatedOrder - Updated order data
 */
const updateOrder = async (updatedOrder: Order | null) => {
  if (!updatedOrder) {
    console.error("Invalid order: null");
    return;
  }

  try {
    await editOrderById(updatedOrder._id, updatedOrder);
    fetchOrders();
    closeModal();
    toast.success(t("orderUpdated"));
  } catch (error) {
    console.error("Error updating order:", error);
    toast.error(t("orderUpdateError"));
  }
};

/**
 * Updates the status of an order
 * @param orderId - ID of the order to update
 * @param status - New status value
 */
const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    await editOrderById(orderId, {
      status: status as
        | "waiting confirmation"
        | "packing"
        | "sended"
        | "delivered"
        | "canceled",
    });
    fetchOrders();
    toast.success(t("orderStatusUpdated"));
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error(t("orderStatusUpdateError"));
  }
};

// ==============================
// Lifecycle Hooks
// ==============================

onMounted(() => {
  fetchOrders();
});
</script>
