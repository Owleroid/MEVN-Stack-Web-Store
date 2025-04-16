<template>
  <div class="product-status-list">
    <h3>{{ $t("criticalProductAmount") }}</h3>
    <ul>
      <li
        v-for="product in filteredProducts"
        :key="product.product"
        :class="getProductStatusClass(product.amount)"
      >
        <span>{{ product.name }}</span>
        <span>{{ product.amount }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { Product } from "@/types/warehouse";

const props = defineProps<{
  products: Product[];
}>();

// Filter products to show only those with amount <= 1
const filteredProducts = computed(() =>
  props.products.filter((product) => product.amount <= 1)
);

const getProductStatusClass = (amount: number) => {
  if (amount === 1) return "yellow";
  if (amount === 0) return "orange";
  if (amount < 0) return "red";
  return "";
};
</script>

<style scoped>
.product-status-list {
  width: 100%;
  margin-top: 20px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.product-status-list h3 {
  margin-bottom: 16px;
  font-size: 1.4em;
  color: #333;
  font-weight: 600;
}

.product-status-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-status-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: background-color 0.3s ease;
}

.product-status-list li.yellow {
  background-color: #fff3cd;
}

.product-status-list li.orange {
  background-color: #ffe5b4;
}

.product-status-list li.red {
  background-color: #f8d7da;
}
</style>
