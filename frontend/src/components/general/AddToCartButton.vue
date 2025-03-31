<template>
  <button @click="addToCart">{{ $t("addToCart") }}</button>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import type { Product } from "@/types/products";

import { useEventBus } from "@/utils/eventBus";

import { addToCart as addToCartService } from "@/services/cartService";

const props = defineProps<{
  product: Product;
}>();

const toast = useToast();
const { emit } = useEventBus();
const { t } = useI18n();

function addToCart() {
  addToCartService(props.product);
  toast.success(t("addedToCart", { product: props.product.name }));
  emit("cart-updated");
}
</script>

<style scoped>
button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
