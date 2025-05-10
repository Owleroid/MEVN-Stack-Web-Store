<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mb-6">{{ $t("pageTitle") }}</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center py-8">
      <div
        class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600">{{ $t("loading") }}</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center p-8 bg-red-50 text-red-600 rounded-md my-4"
    >
      <p>{{ error }}</p>
      <button
        @click="fetchOrders(authStore.userId)"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        {{ $t("retry") }}
      </button>
    </div>

    <!-- Orders List -->
    <div v-else-if="orders.length > 0" class="space-y-6">
      <div
        v-for="order in orders"
        :key="order._id"
        class="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
      >
        <!-- Order Header -->
        <div
          class="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-800">
              {{ $t("order") }}: {{ order.orderNumber }}
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              {{
                new Date(
                  order.dateOfCreation ?? Date.now()
                ).toLocaleDateString()
              }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusClass(order.status)"
            >
              {{ $t(`statuses.${order.status}`) }}
            </span>
            <span class="font-medium">
              {{ order.totalPrice }}
              {{ order.currency === "euros" ? "€" : "₽" }}
            </span>
          </div>
        </div>

        <!-- Order Details -->
        <div class="p-4">
          <!-- Products -->
          <div class="mb-4">
            <h3 class="font-medium text-gray-700 mb-2">{{ $t("products") }}</h3>
            <ul class="bg-gray-50 rounded-md p-3">
              <li
                v-for="item in order.products"
                :key="item.productId"
                class="py-2 border-b border-gray-100 last:border-0 flex justify-between"
              >
                <span>{{ item.name }}</span>
                <span class="text-gray-700">
                  {{ item.amount }} x {{ item.productPrice }}
                  {{ order.currency === "euros" ? "€" : "₽" }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Order Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Recipient Info -->
            <div class="bg-gray-50 p-4 rounded-md">
              <h3
                class="font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200"
              >
                {{ $t("recipient.title") }}
              </h3>
              <div class="space-y-2">
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("recipient.email") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.recipient?.email
                  }}</span>
                </p>
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("recipient.name") }}:</span
                  >
                  <span class="text-gray-800">{{ order.recipient?.name }}</span>
                </p>
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("recipient.surname") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.recipient?.surname
                  }}</span>
                </p>
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("recipient.phone") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.recipient?.phone
                  }}</span>
                </p>
              </div>
            </div>

            <!-- Delivery Info -->
            <div class="bg-gray-50 p-4 rounded-md">
              <h3
                class="font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200"
              >
                {{ $t("delivery.title") }}
              </h3>
              <div class="space-y-2">
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("delivery.country") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.shippingAddress?.country
                  }}</span>
                </p>
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("delivery.city") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.shippingAddress?.city
                  }}</span>
                </p>
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("delivery.street") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.shippingAddress?.street
                  }}</span>
                </p>
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("delivery.buildingNumber") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.shippingAddress?.buildingNumber
                  }}</span>
                </p>
                <p v-if="order.shippingAddress?.apartment" class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("delivery.apartment") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.shippingAddress?.apartment
                  }}</span>
                </p>
                <p class="flex">
                  <span class="text-sm font-medium text-gray-600 w-1/3"
                    >{{ $t("delivery.postalCode") }}:</span
                  >
                  <span class="text-gray-800">{{
                    order.shippingAddress?.postalCode
                  }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-4 space-y-2">
            <p
              v-if="order.orderNotes"
              class="text-gray-700 bg-yellow-50 p-3 rounded-md"
            >
              <span class="font-medium">{{ $t("notes") }}:</span>
              {{ order.orderNotes }}
            </p>
            <p v-if="order.trackingNumber" class="bg-blue-50 p-3 rounded-md">
              <span class="font-medium">{{ $t("trackingNumber") }}:</span>
              {{ order.trackingNumber }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No Orders State -->
    <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <p class="text-lg text-gray-600">{{ $t("noOrders") }}</p>
      <router-link
        to="/"
        class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {{ $t("startShopping") }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import axios from "axios";

import type {
  OrderData,
  OrderStatus,
  OrdersListResponse,
} from "@/types/orders";

import { useAuthStore } from "@/stores/authStore";

import { getOrdersByUserId } from "@/services/orderService";

// Composables Setup
const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();

// State Management
const orders = ref<OrderData[]>([]);
const loading = ref(true);
const error = ref("");

// Computed & Helper Functions
const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "bg-yellow-100 text-yellow-800";
    case "packing":
      return "bg-blue-100 text-blue-800";
    case "sended":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Data Fetching
async function fetchOrders(userId: string) {
  loading.value = true;
  error.value = "";
  orders.value = [];

  try {
    const response: OrdersListResponse = await getOrdersByUserId(userId);
    orders.value = response.orders || [];
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    error.value = t("fetchOrdersError");
    toast.error(t("fetchOrdersError"));
  } finally {
    loading.value = false;
  }
}

// Lifecycle Hooks
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await fetchOrders(authStore.userId);
  } else {
    error.value = t("notAuthenticated");
  }
});
</script>
