<template>
  <div
    class="bg-gradient-to-r from-[#191919] to-[#0E0E0E] min-h-screen text-gray-300 py-6"
  >
    <!-- Empty Cart State -->
    <div
      v-if="cart.length === 0"
      class="max-w-xl mx-auto mt-6 px-4 sm:px-0 sm:mt-10"
    >
      <div class="relative p-[1px]">
        <!-- Gradient border -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
        ></div>

        <!-- Content with background -->
        <div class="relative bg-[#0E0E0E] p-6 sm:p-10 text-center">
          <img
            src="@/assets/icons/cart-icon.svg"
            alt="Empty Cart"
            class="mx-auto h-16 w-16 sm:h-24 sm:w-24 opacity-70"
          />
          <h3
            class="mt-4 sm:mt-5 text-xl sm:text-2xl font-bold font-oswald uppercase bg-gradient-to-b from-gray-100 to-gray-500 text-transparent bg-clip-text"
          >
            {{ $t("emptyCart") }}
          </h3>

          <div class="mt-6 sm:mt-8 flex justify-center">
            <button
              @click="redirectToStore"
              class="inline-block h-[48px] px-8 sm:px-12 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none"
            >
              {{ $t("goToStore") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Items -->
    <transition name="fade" appear>
      <div v-if="cart.length > 0" class="px-4 max-w-4xl mx-auto">
        <!-- Cart Items List -->
        <div class="space-y-4 sm:space-y-5">
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
              <div class="relative bg-[#0E0E0E] p-3 sm:p-4 pb-4">
                <div class="flex gap-3">
                  <!-- Product Image -->
                  <div
                    class="w-[100px] h-[100px] sm:w-[124px] sm:h-[130px] overflow-hidden flex items-center justify-center"
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
                      class="text-2xl sm:text-3xl font-bold font-oswald uppercase bg-gradient-to-b from-gray-100 to-gray-500 text-transparent bg-clip-text truncate"
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

                <div class="flex justify-between items-center mt-4 sm:mt-5">
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

                  <!-- Right side: Price - always visible -->
                  <div class="text-right">
                    <div
                      class="text-2xl sm:text-3xl font-medium font-oswald uppercase bg-gradient-to-b from-gray-100 to-gray-500 text-transparent bg-clip-text"
                    >
                      {{ formatPrice(item.product.price[currency]) }}
                    </div>
                    <div
                      v-if="item.product.discount"
                      class="text-sm line-through text-gray-500"
                    >
                      {{
                        formatPrice(
                          item.product.discount.originalPrice[currency]
                        )
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Cart Summary -->
        <div class="mt-6 sm:mt-8 space-y-2">
          <div class="flex flex-col space-y-2">
            <!-- Items Count -->
            <div class="relative py-2 px-4 sm:px-5">
              <div
                class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-gray-500"
              ></div>
              <div class="flex items-center gap-1">
                <span class="text-lg sm:text-xl font-oswald text-gray-500"
                  >{{ $t("itemsInCart") }}:</span
                >
                <span
                  class="text-lg sm:text-xl font-medium font-oswald text-gray-300"
                >
                  {{ totalItems }}</span
                >
              </div>
            </div>

            <!-- Total Amount -->
            <div class="relative py-2 px-4 sm:px-5">
              <div
                class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-gray-500"
              ></div>
              <div class="flex items-center gap-1">
                <span class="text-lg sm:text-xl font-oswald text-gray-500"
                  >{{ $t("amount") }}:</span
                >
                <span
                  class="text-lg sm:text-xl font-medium font-oswald text-gray-300"
                  >{{ formatPrice(totalPrice) }}</span
                >
              </div>
            </div>

            <!-- Total Savings - Only visible if there are savings -->
            <transition
              enter-active-class="transition-opacity duration-500 ease-in-out"
              leave-active-class="transition-opacity duration-500 ease-in-out"
              enter-from-class="opacity-0"
              leave-to-class="opacity-0"
            >
              <div v-if="totalSavings > 0" class="relative py-2 px-4 sm:px-5">
                <div
                  class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-gray-500"
                ></div>
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium text-green-500"
                    >{{ $t("totalSavings") }}:</span
                  >
                  <span class="text-sm font-medium text-green-500">
                    {{ formatPrice(totalSavings) }}
                  </span>
                </div>
              </div>
            </transition>
          </div>

          <!-- Checkout Button -->
          <div class="flex justify-center py-4">
            <button
              @click="checkout"
              class="inline-block px-12 h-[48px] uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none"
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
