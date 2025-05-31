<template>
  <!-- Critical Stock Container - No headers, just content -->
  <div class="w-full h-full">
    <!-- Products Table (when there are low stock items) -->
    <div v-if="filteredProducts.length > 0" class="h-full">
      <!-- Header area with explanation and legend -->
      <div
        class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <!-- Critical stock explanation text -->
        <div class="text-gray-600 text-sm italic">
          {{ $t("criticalStockExplanation") }}
          <span class="font-medium ml-1 text-gray-700 not-italic">
            {{ $t("sortedByCriticality") }}
          </span>
        </div>

        <!-- Legend moved up -->
        <div class="flex gap-4 text-sm text-gray-600">
          <div class="flex items-center">
            <span
              class="h-3 w-3 rounded bg-red-100 border border-red-400 mr-2"
            ></span>
            {{ $t("outOfStock") }}
          </div>
          <div class="flex items-center">
            <span
              class="h-3 w-3 rounded bg-yellow-100 border border-yellow-400 mr-2"
            ></span>
            {{ $t("lowStock") }}
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th
                class="bg-gray-50 p-4 text-left font-medium text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200"
              >
                {{ $t("productName") }}
              </th>
              <th
                class="bg-gray-50 p-4 text-left font-medium text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 w-32"
              >
                {{ $t("amount") }}
              </th>
              <th
                class="bg-gray-50 p-4 text-left font-medium text-gray-700 text-sm uppercase tracking-wider border-b border-gray-200 w-32"
              >
                {{ $t("status") }}
              </th>
            </tr>
          </thead>
          <transition-group
            tag="tbody"
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 transform -translate-x-4"
            enter-to-class="opacity-100 transform translate-x-0"
            leave-from-class="opacity-100 transform translate-x-0"
            leave-to-class="opacity-0 transform -translate-x-4"
            class="transition-all"
          >
            <tr
              v-for="(product, index) in filteredProducts"
              :key="product.product"
              :class="getProductRowClass(product)"
              class="transition-all duration-300 ease-in-out transform hover:bg-gray-50 hover:scale-[1.01] hover:shadow-sm"
            >
              <td
                class="p-4"
                :class="{
                  'border-b border-gray-200':
                    index !== filteredProducts.length - 1,
                }"
              >
                <div class="font-medium">{{ product.name }}</div>
              </td>
              <td
                class="p-4"
                :class="{
                  'border-b border-gray-200':
                    index !== filteredProducts.length - 1,
                }"
              >
                <div class="font-bold" :class="getAmountTextClass(product)">
                  {{ product.amount }}
                </div>
              </td>
              <td
                class="p-4"
                :class="{
                  'border-b border-gray-200':
                    index !== filteredProducts.length - 1,
                }"
              >
                <div class="flex items-center">
                  <span
                    :class="getStatusBadgeClass(product)"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-transform hover:scale-105 duration-200 ease-in-out"
                  >
                    <svg
                      v-if="getAmountLevel(product) === 'outOfStock'"
                      class="mr-1 h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <svg
                      v-else-if="getAmountLevel(product) === 'critical'"
                      class="mr-1 h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ getStatusText(product) }}
                  </span>
                </div>
              </td>
            </tr>
          </transition-group>
        </table>
      </div>
    </div>

    <!-- Empty State - No Critical Products -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
      mode="out-in"
    >
      <div
        v-if="filteredProducts.length === 0"
        class="h-full flex items-center justify-center"
      >
        <div
          class="text-center bg-green-50 p-8 rounded-lg shadow-sm border border-green-100 max-w-md"
        >
          <svg
            class="w-16 h-16 mx-auto text-green-500 mb-4"
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
          <h3 class="text-lg font-medium text-green-700 mb-2">
            {{ $t("allGood") }}
          </h3>
          <p class="text-green-600">{{ $t("allProductsInStock") }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProductAmount } from "@/types/warehouse";

// Props
const props = defineProps<{
  products: ProductAmount[];
  criticalThreshold: number;
  originalAmounts?: Record<string, number>;
}>();

// Computed Properties
const filteredProducts = computed<ProductAmount[]>(() => {
  // First filter products that are at or below the critical threshold
  const criticalProducts = props.products.filter((product) => {
    const amountToCheck =
      props.originalAmounts &&
      props.originalAmounts[product.product] !== undefined
        ? props.originalAmounts[product.product]
        : product.amount;
    return amountToCheck <= props.criticalThreshold;
  });

  // Then sort them by amount (ascending - most critical first)
  return criticalProducts.sort((a, b) => {
    const amountA =
      props.originalAmounts && props.originalAmounts[a.product] !== undefined
        ? props.originalAmounts[a.product]
        : a.amount;

    const amountB =
      props.originalAmounts && props.originalAmounts[b.product] !== undefined
        ? props.originalAmounts[b.product]
        : b.amount;

    return amountB - amountA; // Sort descending (highest/less critical first)
  });
});

// Utility Functions
const getAmountLevel = (
  product: ProductAmount
): "outOfStock" | "critical" | "normal" => {
  const amountToCheck =
    props.originalAmounts &&
    props.originalAmounts[product.product] !== undefined
      ? props.originalAmounts[product.product]
      : product.amount;

  if (amountToCheck <= 0) return "outOfStock";
  if (amountToCheck <= props.criticalThreshold) return "critical";
  return "normal";
};

const getProductRowClass = (product: ProductAmount): string => {
  const level = getAmountLevel(product);
  if (level === "outOfStock") return "bg-red-50";
  if (level === "critical") return "bg-yellow-50";
  return "";
};

const getAmountTextClass = (product: ProductAmount): string => {
  const level = getAmountLevel(product);
  if (level === "outOfStock") return "text-red-600";
  if (level === "critical") return "text-yellow-700";
  return "text-gray-700";
};

const getStatusBadgeClass = (product: ProductAmount): string => {
  const level = getAmountLevel(product);
  if (level === "outOfStock")
    return "bg-red-100 text-red-800 border border-red-200";
  if (level === "critical")
    return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  return "bg-green-100 text-green-800";
};

const getStatusText = (product: ProductAmount): string => {
  const level = getAmountLevel(product);
  if (level === "outOfStock") return "Out of Stock";
  if (level === "critical") return "Low Stock";
  return "In Stock";
};
</script>
