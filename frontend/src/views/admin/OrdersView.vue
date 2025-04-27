<template>
  <div>
    <h1>{{ $t("orders") }}</h1>

    <!-- Block for New Orders -->
    <div>
      <h2>{{ $t("newOrders") }}</h2>
      <div v-if="newOrders.length === 0">
        <p>{{ $t("noNewOrders") }}</p>
      </div>
      <div v-else>
        <OrderTable
          :orders="newOrders"
          @viewOrder="viewOrder"
          @editOrder="editOrder"
          @updateOrderStatus="updateOrderStatus"
        />
      </div>
    </div>

    <!-- Block for All Orders with Filters -->
    <div>
      <h2>{{ $t("allOrders") }}</h2>
      <div class="filters">
        <label for="sortOrder">{{ $t("sortByDate") }}</label>
        <select v-model="sortOrder">
          <option value="newest">{{ $t("newestToOldest") }}</option>
          <option value="oldest">{{ $t("oldestToNewest") }}</option>
        </select>

        <label for="statusFilter">{{ $t("filterByStatus") }}</label>
        <select v-model="statusFilter">
          <option value="">{{ $t("statuses.all") }}</option>
          <option value="waiting confirmation">
            {{ $t("statuses.waitingConfirmation") }}
          </option>
          <option value="packing">{{ $t("statuses.packing") }}</option>
          <option value="sended">{{ $t("statuses.sended") }}</option>
          <option value="delivered">{{ $t("statuses.delivered") }}</option>
          <option value="canceled">{{ $t("statuses.canceled") }}</option>
        </select>
      </div>

      <div v-if="filteredOrders.length === 0">
        <p>{{ $t("noOrdersFound") }}</p>
      </div>
      <div v-else>
        <OrderTable
          :orders="filteredOrders"
          @viewOrder="viewOrder"
          @editOrder="editOrder"
          @updateOrderStatus="updateOrderStatus"
        />
      </div>
    </div>

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

import type { Order } from "@/types/orders";

import { getAllOrders, editOrderById } from "@/services/orderService";

const { t } = useI18n();
const toast = useToast();

const orders = ref<Order[]>([]);
const sortOrder = ref("newest");
const statusFilter = ref("");
const showModal = ref(false);
const selectedOrder = ref<Order | null>(null);
const isEditing = ref(false);

const fetchOrders = async () => {
  try {
    const response = await getAllOrders();
    orders.value = response.data.orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error(t("fetchOrdersError"));
  }
};

const newOrders = computed(() => {
  return orders.value.filter((order) => !order.checked);
});

const filteredOrders = computed(() => {
  let filtered = orders.value.filter((order) => order.checked);

  if (statusFilter.value) {
    filtered = filtered.filter((order) => order.status === statusFilter.value);
  }

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

const viewOrder = (order: Order) => {
  selectedOrder.value = order;
  isEditing.value = false;
  showModal.value = true;
};

const editOrder = (order: Order) => {
  selectedOrder.value = order;
  isEditing.value = true;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
  isEditing.value = false;
};

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

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.filters label {
  margin-right: 10px;
  font-weight: bold;
}
</style>
