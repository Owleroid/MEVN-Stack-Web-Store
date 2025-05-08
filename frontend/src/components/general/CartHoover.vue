<template>
  <div class="w-80 bg-white rounded-md shadow-lg overflow-hidden">
    <!-- Cart Header -->
    <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">{{ $t("cart") }}</h3>
    </div>

    <!-- Empty Cart State -->
    <div v-if="cart.length === 0" class="p-4 text-center">
      <p class="text-gray-500 text-sm">{{ $t("emptyCart") }}</p>
    </div>

    <!-- Cart Items -->
    <div v-else>
      <ul class="max-h-64 overflow-y-auto divide-y divide-gray-200">
        <li
          v-for="item in cart"
          :key="item.product._id"
          class="p-3 flex items-center gap-3 hover:bg-gray-50"
        >
          <!-- Product Image -->
          <div
            class="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0"
          >
            <img
              :src="item.product.imageUrls?.main"
              :alt="item.product.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>

          <!-- Product Details -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">
              {{ item.product.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatPrice(item.product.price[currency].amount) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ $t("quantity") }}: {{ item.quantity }}
            </p>
          </div>
        </li>
      </ul>

      <!-- Cart Summary -->
      <div
        class="p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center"
      >
        <span class="font-medium text-sm text-gray-700"
          >{{ $t("total") }}:</span
        >
        <span class="font-bold text-sm text-gray-900">{{
          formatPrice(totalPrice)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { useAuthStore } from "@/stores/authStore";

import type { CartItem } from "@/types/cart";
import type { Currency } from "@/types/orders";

import { useEventBus } from "@/utils/eventBus";

import { getCart } from "@/services/cartService";

// Composables Setup
const authStore = useAuthStore();
const { on } = useEventBus();

// State Management
const cart = ref<CartItem[]>([]);
const currency = computed<Currency>(
  () => (authStore.currency as Currency) || "euros"
);

// Computed Properties
const totalPrice = computed<number>(() => {
  return cart.value.reduce(
    (total, item) =>
      total + item.product.price[currency.value].amount * item.quantity,
    0
  );
});

// Utility Functions
const formatPrice = (price: number): string => {
  return currency.value === "rubles"
    ? new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(price)
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(price);
};

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement;
  target.src = "/images/placeholder-product.png";
};

// Data Fetching
const fetchCart = (): void => {
  cart.value = getCart();
};

// Lifecycle Hooks
onMounted(() => {
  fetchCart();
  on("cart-updated", fetchCart);
});
</script>
