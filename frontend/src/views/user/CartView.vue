<template>
  <div
    class="bg-gradient-to-r from-[#191919] to-[#0E0E0E] min-h-screen text-gray-300 py-6"
  >
    <!-- Empty Cart State -->
    <div
      v-if="cart.length === 0"
      class="text-center py-16 mx-5 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-800"
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
      <h3 class="mt-2 text-sm font-medium text-gray-400">
        {{ $t("emptyCart") }}
      </h3>
      <button
        @click="redirectToStore"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        {{ $t("goToStore") }}
      </button>
    </div>

    <!-- Cart Items -->
    <transition name="fade" appear>
      <div v-if="cart.length > 0" class="px-4">
        <!-- Cart Items List -->
        <div class="space-y-5">
          <transition-group name="fade" appear>
            <div
              v-for="item in cart"
              :key="item.product._id"
              class="relative p-[1px]"
            >
              <!-- Gradient border -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
              ></div>

              <!-- Content with background -->
              <div class="relative bg-[#0E0E0E] p-2 pb-3">
                <div class="flex gap-2">
                  <!-- Product Image -->
                  <div
                    class="w-[124px] h-[130px] overflow-hidden flex items-center justify-center"
                  >
                    <img
                      :src="
                        item.product.imageUrls?.main || '/placeholder-image.jpg'
                      "
                      :alt="item.product.name"
                      class="max-w-full max-h-full object-contain"
                      @error="handleImageError"
                    />
                  </div>

                  <!-- Product Details -->
                  <div class="flex-1 flex flex-col justify-center min-w-0">
                    <h3
                      class="text-3xl font-bold font-oswald uppercase bg-gradient-to-b from-gray-100 to-gray-500 text-transparent bg-clip-text truncate"
                    >
                      {{ item.product.name }}
                    </h3>
                    <div class="flex items-center mt-2">
                      <span class="text-gray-500 text-sm"
                        >{{ $t("article") }}:</span
                      >
                      <span class="text-gray-300 text-sm ml-1 uppercase">{{
                        item.product._id.substring(0, 7)
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center mt-5">
                  <!-- Left side: Quantity Controls and Delete Button -->
                  <div class="flex items-center">
                    <!-- Using AmountSelector component -->
                    <div class="w-[110px]">
                      <AmountSelector
                        :initial-amount="item.quantity"
                        @update:amount="
                          updateQuantity(item.product._id, $event)
                        "
                      />
                    </div>

                    <!-- Delete Button -->
                    <button
                      @click="deleteFromCart(item.product._id)"
                      class="relative ml-2 p-[1px] h-[48px] flex items-center"
                    >
                      <div
                        class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
                      ></div>
                      <div class="absolute inset-[1px] bg-[#0E0E0E]"></div>
                      <div
                        class="relative px-3 z-10 flex items-center justify-center h-full"
                      >
                        <img
                          src="@/assets/icons/bin-icon.svg"
                          alt="Delete"
                          width="20"
                          height="24"
                        />
                      </div>
                    </button>
                  </div>

                  <!-- Right side: Price -->
                  <div
                    class="text-3xl font-medium font-oswald uppercase bg-gradient-to-b from-gray-100 to-gray-500 text-transparent bg-clip-text"
                  >
                    {{ formatPrice(item.product.price[currency]) }}
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Cart Summary -->
        <div class="mt-8 space-y-2">
          <div class="flex flex-col space-y-2">
            <!-- Items Count -->
            <div class="relative py-2 px-5">
              <div
                class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-gray-500"
              ></div>
              <div class="flex items-center gap-1">
                <span class="text-xl font-oswald text-gray-500"
                  >{{ $t("itemsInCart") }}:</span
                >
                <span class="text-xl font-medium font-oswald text-gray-300">
                  {{ totalItems }}</span
                >
              </div>
            </div>

            <!-- Total Amount -->
            <div class="relative py-2 px-5">
              <div
                class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-gray-500"
              ></div>
              <div class="flex items-center gap-1">
                <span class="text-xl font-oswald text-gray-500"
                  >{{ $t("amount") }}:</span
                >
                <span class="text-xl font-medium font-oswald text-gray-300">{{
                  formatPrice(totalPrice)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Checkout Button -->
          <div class="flex justify-center py-4">
            <button
              @click="checkout"
              class="px-12 h-[48px] uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none"
            >
              <span class="flex items-center justify-center gap-2">
                {{ $t("checkout") }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/authStore";
import { useEventBus } from "@/utils/eventBus";
import AmountSelector from "@/components/general/AmountSelector.vue";

import type { CartItem } from "@/types/cart";
import type { Currency } from "@/types/orders";

import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  refreshCartItems,
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
const totalItems = computed<number>(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0);
});

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
  if (currency.value === "rubles") {
    return `${price.toFixed(2)} ₽`;
  } else {
    return `${price.toFixed(2)} €`;
  }
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
onMounted(async () => {
  cart.value = getCart();

  try {
    cart.value = await refreshCartItems();
    emit("cart-updated");
  } catch (error) {
    console.error("Failed to refresh cart items:", error);
  }
});
</script>
