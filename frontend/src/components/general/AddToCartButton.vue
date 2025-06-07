<template>
  <button
    @click="addToCart"
    type="button"
    class="w-full h-[48px] uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none"
  >
    <span class="flex items-center justify-center gap-2">
      {{ $t("addToCart") }}
    </span>
  </button>
</template>

<script setup lang="ts">
import type { Product } from "@/types/products";

import { useEventBus } from "@/utils/eventBus";

import { addToCart as addToCartService } from "@/services/cartService";

// Component Props
interface Props {
  product: Product;
  quantity?: number;
}

const props = withDefaults(defineProps<Props>(), {
  quantity: 1,
});

// Composables Setup
const { emit } = useEventBus();

// Action Handlers
function addToCart(): void {
  addToCartService(props.product, props.quantity);
  emit("cart-updated");
}
</script>
