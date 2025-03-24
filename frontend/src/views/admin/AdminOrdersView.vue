<template>
  <div>
    <h1>Orders</h1>

    <!-- Block for New Orders -->
    <div>
      <h2>New Orders</h2>
      <div v-if="newOrders.length === 0">
        <p>No new orders</p>
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
      <h2>All Orders</h2>
      <div class="filters">
        <label for="sortOrder">Sort by Date:</label>
        <select v-model="sortOrder">
          <option value="newest">Newest to Oldest</option>
          <option value="oldest">Oldest to Newest</option>
        </select>

        <label for="statusFilter">Filter by Status:</label>
        <select v-model="statusFilter">
          <option value="">All</option>
          <option value="waiting confirmation">Waiting Confirmation</option>
          <option value="packing">Packing</option>
          <option value="sended">Sended</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div v-if="filteredOrders.length === 0">
        <p>No orders found</p>
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

import OrderTable from "@/components/admin/Orders/OrderTable.vue";
import OrderModal from "@/components/admin/Orders/EditOrderModal.vue";

import type { Order } from "@/types/orders";

import { getAllOrders, editOrderById } from "@/services/orderService";

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
  }
};

const newOrders = computed(() => {
  return orders.value.filter((order) => !order.checked);
});

const filteredOrders = computed(() => {
  let filtered = orders.value;

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

const updateOrder = async () => {
  if (selectedOrder.value) {
    try {
      await editOrderById(selectedOrder.value._id, selectedOrder.value);
      fetchOrders();
      closeModal();
    } catch (error) {
      console.error("Error updating order:", error);
    }
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
  } catch (error) {
    console.error("Error updating order status:", error);
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
