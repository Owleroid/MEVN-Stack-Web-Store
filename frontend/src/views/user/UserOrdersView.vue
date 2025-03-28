<template>
  <div class="orders">
    <h1>{{ $t("title") }}</h1>
    <div v-if="orders.length">
      <div v-for="order in orders" :key="order._id" class="order">
        <h2>{{ $t("order") }} #{{ order.orderNumber }}</h2>
        <p>
          {{ $t("date") }}:
          {{ new Date(order.dateOfCreation).toLocaleDateString() }}
        </p>
        <p>
          {{ $t("total") }}: {{ order.totalPrice }}
          {{ order.currency }}
        </p>
        <p>{{ $t("status") }}: {{ order.status }}</p>
        <ul>
          <li v-for="item in order.products" :key="item.productId">
            {{ item.name }} - {{ item.amount }} x {{ item.productPrice }}
          </li>
        </ul>
        <div class="recipient">
          <h3>{{ $t("recipient.title") }}</h3>
          <p>
            {{ $t("recipient.email") }}:
            {{ order.recipient?.email }}
          </p>
          <p>
            {{ $t("recipient.name") }}:
            {{ order.recipient?.name }}
          </p>
          <p>
            {{ $t("recipient.surname") }}:
            {{ order.recipient?.surname }}
          </p>
          <p>
            {{ $t("recipient.phone") }}:
            {{ order.recipient?.phone }}
          </p>
        </div>
        <div class="delivery">
          <h3>{{ $t("delivery.title") }}</h3>
          <p>
            {{ $t("delivery.country") }}:
            {{ order.shippingAddress?.country }}
          </p>
          <p>
            {{ $t("delivery.city") }}:
            {{ order.shippingAddress?.city }}
          </p>
          <p>
            {{ $t("delivery.street") }}:
            {{ order.shippingAddress?.street }}
          </p>
          <p>
            {{ $t("delivery.buildingNumber") }}:
            {{ order.shippingAddress?.buildingNumber }}
          </p>
          <p>
            {{ $t("delivery.apartment") }}:
            {{ order.shippingAddress?.apartment }}
          </p>
          <p>
            {{ $t("delivery.postalCode") }}:
            {{ order.shippingAddress?.postalCode }}
          </p>
        </div>
        <p v-if="order.orderNotes">{{ $t("notes") }}: {{ order.orderNotes }}</p>
        <p v-if="order.trackingNumber">
          {{ $t("trackingNumber") }}: {{ order.trackingNumber }}
        </p>
      </div>
    </div>
    <div v-else>
      <p>{{ $t("noOrders") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import type { Order } from "@/types/orders";

import { useAuthStore } from "@/stores/authStore";

import { getOrdersByUserId } from "@/services/orderService";

const { t } = useI18n();
const authStore = useAuthStore();
const orders = ref<Order[]>([]);

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await fetchOrders(authStore.userId);
  }
});

async function fetchOrders(userId: string) {
  try {
    const response = await getOrdersByUserId(userId);
    orders.value = response.data.orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
}
</script>

<style scoped>
.orders {
  padding: 1rem;
}

.order {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}

.order h2 {
  margin: 0;
}

.order p {
  margin: 0.5rem 0;
}

.order ul {
  list-style: none;
  padding: 0;
}

.order li {
  margin: 0.5rem 0;
}

.recipient,
.delivery {
  margin-top: 1rem;
}

.recipient h3,
.delivery h3 {
  margin: 0.5rem 0;
}
</style>
