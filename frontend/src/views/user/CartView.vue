<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Empty Cart State -->
    <div
      v-if="cart.length === 0"
      class="text-center py-16 bg-gray-50 rounded-lg border border-gray-200"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        {{ $t("emptyCart") }}
      </h3>
      <button
        @click="redirectToStore"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ $t("goToStore") }}
      </button>
    </div>

    <!-- Cart Items -->
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <!-- Cart Items List -->
      <ul class="divide-y divide-gray-200">
        <li
          v-for="item in cart"
          :key="item.product._id"
          class="px-4 py-6 sm:px-6 flex items-center gap-4"
        >
          <!-- Product Image -->
          <div
            class="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-md overflow-hidden"
          >
            <img
              :src="item.product.imageUrls?.main || '/placeholder-image.jpg'"
              :alt="item.product.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>

          <!-- Product Details -->
          <div class="flex-grow">
            <h3 class="text-lg font-medium text-gray-900">
              {{ item.product.name }}
            </h3>
            <div v-if="item.product.discount" class="mt-1">
              <p class="text-sm font-medium text-gray-700">
                {{ formatPrice(item.product.price[currency]) }}
              </p>
              <div class="flex items-center space-x-2">
                <p class="text-sm line-through text-gray-500">
                  {{
                    formatPrice(item.product.discount.originalPrice[currency])
                  }}
                </p>
              </div>
            </div>
            <p v-else class="mt-1 text-sm text-gray-500">
              {{ formatPrice(item.product.price[currency]) }}
            </p>
          </div>

          <!-- Quantity Input -->
          <div class="flex items-center">
            <label for="quantity" class="sr-only">{{ $t("quantity") }}</label>
            <div class="flex rounded-md shadow-sm">
              <input
                type="number"
                id="quantity"
                v-model.number="item.quantity"
                min="1"
                @change="updateQuantity(item.product._id, item.quantity)"
                class="w-16 focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <!-- Remove Button -->
          <div>
            <button
              type="button"
              @click="deleteFromCart(item.product._id)"
              class="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="sr-only">{{ $t("remove") }}</span>
            </button>
          </div>
        </li>
      </ul>

      <!-- Cart Summary -->
      <div class="px-4 py-6 sm:px-6 bg-gray-50">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p>{{ $t("total") }}</p>
          <p>{{ formatPrice(totalPrice) }}</p>
        </div>

        <div
          v-if="totalSavings > 0"
          class="flex justify-between text-sm text-green-600 mt-2"
        >
          <p>{{ $t("totalSavings") }}</p>
          <p>{{ formatPrice(totalSavings) }}</p>
        </div>

        <p class="mt-0.5 text-sm text-gray-500">
          {{ $t("shippingCalculatedAtCheckout") }}
        </p>

        <div class="mt-6 flex justify-center">
          <button
            @click="checkout"
            class="px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ $t("checkout") }}
          </button>
        </div>

        <div class="mt-6 flex justify-center text-sm text-center text-gray-500">
          <p>
            {{ $t("or") }}
            <button
              @click="redirectToStore"
              class="text-blue-600 font-medium hover:text-blue-500 ml-1"
            >
              {{ $t("continueShopping") }}
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/authStore";

import { useEventBus } from "@/utils/eventBus";

import type { CartItem } from "@/types/cart";
import type { Currency } from "@/types/orders";

import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/services/cartService";

// Composables Setup
const router = useRouter();
const authStore = useAuthStore();
const { emit } = useEventBus();

// State Management
const cart = ref<CartItem[]>([]);
const currency = computed<Currency>(
  () => (authStore.currency as Currency) || "euros"
);

// Computed Properties
const totalPrice = computed<number>(() => {
  return cart.value.reduce(
    (total, item) => total + item.product.price[currency.value] * item.quantity,
    0
  );
});

const totalSavings = computed<number>(() => {
  return cart.value.reduce((total, item) => {
    if (item.product.discount) {
      const originalItemPrice =
        item.product.discount.originalPrice[currency.value] * item.quantity;
      const discountedItemPrice =
        item.product.price[currency.value] * item.quantity;
      return total + (originalItemPrice - discountedItemPrice);
    }
    return total;
  }, 0);
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

// Cart Operations
const deleteFromCart = (productId: string): void => {
  removeFromCart(productId);
  cart.value = getCart();
  emit("cart-updated");
};

const updateQuantity = (productId: string, quantity: number): void => {
  updateCartQuantity(productId, quantity);
  cart.value = getCart();
  emit("cart-updated");
};

// Navigation Actions
const checkout = (): void => {
  router.push("/checkout");
};

const redirectToStore = (): void => {
  router.push("/collections");
};

// Lifecycle Hooks
onMounted(() => {
  cart.value = getCart();
});
</script>
