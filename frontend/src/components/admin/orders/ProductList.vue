<template>
  <div class="w-full">
    <!-- Products List -->
    <ul class="space-y-3">
      <li
        v-for="(product, index) in products"
        :key="product.productId"
        class="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
      >
        <span class="font-medium text-gray-800">{{ product.name }}</span>
        <div class="flex items-center">
          <input
            type="number"
            v-model.number="product.amount"
            min="1"
            @input="updateProductAmount(index, product.amount)"
            :disabled="!isEditing"
            class="w-16 px-2 py-1 mx-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Product amount"
          />
          <button
            v-if="isEditing"
            type="button"
            @click="removeProduct(index)"
            class="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Remove product"
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
import type { Product } from "@/types/orders";

// ==============================
// Props Definition
// ==============================

/**
 * Component props
 */
const props = defineProps<{
  /** The list of products to display */
  products: Product[];
  /** Whether the product list is in editing mode */
  isEditing: boolean;
}>();

// ==============================
// Events Definition
// ==============================

/**
 * Component events
 */
const emits = defineEmits(["updateProductAmount", "removeProduct"]);

// ==============================
// Product Management Methods
// ==============================

/**
 * Updates the product amount and emits the event to parent component
 * @param index - Index of the product in the array
 * @param amount - New product amount
 */
const updateProductAmount = (index: number, amount: number) => {
  emits("updateProductAmount", index, amount);
};

/**
 * Removes a product from the list
 * @param index - Index of the product to remove
 */
const removeProduct = (index: number) => {
  emits("removeProduct", index);
};
</script>
