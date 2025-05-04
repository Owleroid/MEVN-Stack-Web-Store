<template>
  <!-- Critical Stock Container -->
  <div class="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-4">
    <!-- Section Header -->
    <div class="mb-4">
      <h3 class="text-xl font-semibold text-gray-800">
        {{ $t("criticalStockAlert") }}
      </h3>
    </div>

    <!-- Products Table (when there are low stock items) -->
    <div v-if="filteredProducts.length > 0">
      <p class="mb-3 text-gray-600">{{ $t("productsLowStock") }}</p>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <!-- Table Header -->
          <thead>
            <tr>
              <th
                class="bg-gray-50 p-3 text-left font-medium text-gray-600 text-sm tracking-wider border-b border-gray-200"
              >
                {{ $t("product") }}
              </th>
              <th
                class="bg-gray-50 p-3 text-center font-medium text-gray-600 text-sm tracking-wider border-b border-gray-200 w-32"
              >
                {{ $t("currentAmount") }}
              </th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody>
            <tr
              v-for="product in filteredProducts"
              :key="product.product"
              :class="getProductStatusClass(product.amount)"
            >
              <td class="p-3 border-b border-gray-200">
                {{ product.name }}
              </td>
              <td class="p-3 border-b border-gray-200 text-center font-medium">
                {{ product.amount }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State - No Critical Products -->
    <div v-else class="text-center py-8">
      <svg
        class="w-12 h-12 mx-auto text-green-500 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <p class="text-gray-600">{{ $t("allProductsInStock") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { Product } from "@/types/warehouse";

// ==============================
// Props
// ==============================

const props = defineProps({
  products: {
    type: Array as () => Product[],
    required: true,
  },
  criticalThreshold: {
    type: Number,
    default: 1,
  },
});

// ==============================
// Computed Properties
// ==============================

/**
 * Filter products to show only those with amount <= criticalThreshold
 */
const filteredProducts = computed(() =>
  props.products.filter((product) => product.amount <= props.criticalThreshold)
);

// ==============================
// Helper Methods
// ==============================

/**
 * Returns the Tailwind class based on product amount
 * @param amount - The current amount of product
 * @returns Tailwind classes for the row
 */
const getProductStatusClass = (amount: number): string => {
  // For zero or negative stock, show red background
  if (amount <= 0) return "bg-red-50";

  // For low stock (but above zero), show yellow background
  if (amount <= props.criticalThreshold) return "bg-yellow-50";

  // Normal stock levels (should not appear in this component)
  return "";
};
</script>
