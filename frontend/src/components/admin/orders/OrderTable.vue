<template>
  <table class="orders-table">
    <thead>
      <tr>
        <th>{{ $t("orderTable.orderId") }}</th>
        <th>{{ $t("orderTable.products") }}</th>
        <th>{{ $t("orderTable.recipientEmail") }}</th>
        <th>{{ $t("orderTable.recipientPhone") }}</th>
        <th>{{ $t("orderTable.date") }}</th>
        <th>{{ $t("orderTable.status") }}</th>
        <th>{{ $t("orderTable.actions") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="order in orders"
        :key="order._id"
        @click="viewOrder(order)"
        class="clickable-row"
      >
        <td class="clickable-id">{{ order.orderNumber }}</td>
        <td>
          <ul>
            <li v-for="product in order.products" :key="product.productId">
              {{ product.name }} ({{ product.amount }})
            </li>
          </ul>
        </td>
        <td>{{ order.recipient?.email }}</td>
        <td>{{ order.recipient?.phone }}</td>
        <td>{{ new Date(order.dateOfCreation).toLocaleString() }}</td>
        <td>
          <select
            v-model="order.status"
            @change="updateOrderStatus(order._id, order.status)"
          >
            <option value="waiting confirmation">
              {{ $t("orderTable.waitingConfirmation") }}
            </option>
            <option value="packing">{{ $t("orderTable.packing") }}</option>
            <option value="sended">{{ $t("orderTable.sended") }}</option>
            <option value="delivered">{{ $t("orderTable.delivered") }}</option>
            <option value="canceled">{{ $t("orderTable.canceled") }}</option>
          </select>
        </td>
        <td>
          <button @click.stop="editOrder(order)">
            {{ $t("orderTable.edit") }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { Order } from "@/types/orders";

const props = defineProps<{
  orders: Order[];
}>();

const emits = defineEmits(["viewOrder", "editOrder", "updateOrderStatus"]);

const viewOrder = (order: Order) => {
  emits("viewOrder", order);
};

const editOrder = (order: Order) => {
  emits("editOrder", order);
};

const updateOrderStatus = (orderId: string, status: string) => {
  emits("updateOrderStatus", orderId, status);
};
</script>

<style scoped>
.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.orders-table th,
.orders-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.orders-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.orders-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.orders-table tr:hover {
  background-color: #f1f1f1;
}

.clickable-row {
  cursor: pointer;
}

.clickable-id {
  color: #000;
  text-decoration: underline;
}

.clickable-id:hover {
  color: #333;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  width: fit-content;
}

button:hover {
  background-color: #0056b3;
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
