<template>
  <ul>
    <li v-for="(product, index) in products" :key="product.productId">
      {{ product.name }}
      <input
        type="number"
        v-model.number="product.amount"
        min="1"
        @input="updateProductAmount(index, product.amount)"
        :disabled="!isEditing"
      />
      <button type="button" @click="removeProduct(index)" v-if="isEditing">
        {{ $t("adminOrdersView.remove") }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

import type { Product } from "@/types/orders";

const props = defineProps<{
  products: Product[];
  isEditing: boolean;
}>();

const emits = defineEmits(["updateProductAmount", "removeProduct"]);

const updateProductAmount = (index: number, amount: number) => {
  emits("updateProductAmount", index, amount);
};

const removeProduct = (index: number) => {
  emits("removeProduct", index);
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

li input[type="number"] {
  margin-left: 10px;
  margin-right: 10px;
  width: 60px;
}

li button {
  background-color: #dc3545;
  margin-left: 10px;
}
</style>
