<template>
  <div class="w-full">
    <!-- Products List -->
    <ul class="space-y-3">
      <li
        v-for="(product, index) in products"
        :key="product.productId"
        class="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm border border-gray-100"
      >
        <span class="font-medium text-gray-800">{{ product.name }}</span>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <input
              type="number"
              v-model.number="product.amount"
              min="1"
              @input="updateProductAmount(index, product.amount)"
              :disabled="!isEditing"
              class="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-base font-semibold transition disabled:bg-gray-100 disabled:text-gray-400"
              :aria-label="$t('quantity')"
            />
            <span class="text-gray-600">×</span>
            <span class="text-gray-700 font-medium">{{
              formatPrice(product.productPrice)
            }}</span>
            <span class="text-gray-600">=</span>
            <span class="text-gray-800 font-bold">{{
              formatPrice(product.productPrice * product.amount)
            }}</span>
          </div>
          <button
            v-if="isEditing"
            type="button"
            @click="removeProduct(index)"
            class="px-3 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm transition"
            :aria-label="$t('remove')"
          >
            {{ $t("remove") }}
          </button>
        </div>
      </li>
    </ul>

    <!-- Empty State -->
    <div v-if="products.length === 0" class="py-6 text-center text-gray-500">
      <p>{{ $t("noProducts") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderProduct } from "@/types/orders";

// Props Definition
const props = defineProps<{
  products: OrderProduct[];
  isEditing: boolean;
}>();

// Events Definition
const emit = defineEmits<{
  (e: "updateProductAmount", index: number, amount: number): void;
  (e: "removeProduct", index: number): void;
}>();

// Product Management Methods
const updateProductAmount = (index: number, amount: number): void => {
  emit("updateProductAmount", index, amount);
};

const removeProduct = (index: number): void => {
  emit("removeProduct", index);
};

// Helper Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};
</script>
