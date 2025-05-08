<template>
  <button
    @click="addToCart"
    type="button"
    class="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
      />
    </svg>
    {{ $t("addToCart") }}
  </button>
</template>

<script setup lang="ts">
import type { Product } from "@/types/products";

import { useEventBus } from "@/utils/eventBus";

import { addToCart as addToCartService } from "@/services/cartService";

// Component Props
interface Props {
  product: Product;
}

const props = defineProps<Props>();

// Composables Setup
const { emit } = useEventBus();

// Action Handlers
function addToCart(): void {
  addToCartService(props.product);
  emit("cart-updated");
}
</script>
