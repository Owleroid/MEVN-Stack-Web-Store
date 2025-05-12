<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Warehouse Selection Section -->
    <div class="mb-6 flex flex-col items-center">
      <div
        v-if="warehouses.length === 0"
        class="text-center p-8 bg-red-50 text-red-600 rounded-md"
      >
        <p>{{ $t("noWarehousesFound") }}</p>
      </div>
      <div v-else class="flex items-center gap-4 w-full max-w-md">
        <label for="warehouseSelect" class="text-lg font-medium text-gray-700"
          >{{ $t("selectWarehouse") }}:</label
        >
        <select
          id="warehouseSelect"
          v-model="selectedWarehouseId"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option
            v-for="warehouse in warehouses"
            :key="warehouse._id"
            :value="warehouse._id"
          >
            {{ warehouse.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Critical Stock Section - With fixed height of 500px -->
    <div
      class="mb-6 h-[400px] bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col"
    >
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ $t("criticalStockAlert") }}
        </h2>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <!-- When critical products exist -->
        <div
          v-if="selectedWarehouse && selectedWarehouse.products.length > 0"
          class="h-full"
        >
          <ProductStatusList
            :products="selectedWarehouse.products"
            :criticalThreshold="1"
            :originalAmounts="originalAmounts"
          />
        </div>

        <!-- Empty state - fallback -->
        <div v-else class="h-full flex items-center justify-center">
          <div class="text-center">
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
            <p class="text-gray-500">{{ $t("noCriticalStock") }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div
      v-if="warehouses.length > 0 && categories.length > 0"
      class="flex flex-col md:flex-row gap-6"
    >
      <!-- Categories Menu -->
      <div
        class="w-full md:w-64 bg-white rounded-lg shadow border border-gray-200 p-4 h-[500px] flex flex-col"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          {{ $t("categories") }}
        </h2>

        <!-- Categories -->
        <div class="flex-1 overflow-y-auto">
          <div class="flex flex-col gap-2 pr-2">
            <button
              v-for="category in categories"
              :key="category._id"
              @click="selectCategory(category)"
              :class="[
                'py-2.5 px-4 text-sm font-medium rounded-md transition-colors w-full text-left',
                category._id === selectedCategoryId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div
        class="flex-1 bg-white rounded-lg shadow border border-gray-200 h-[500px] flex flex-col"
      >
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ $t("products") }}
          </h2>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <!-- Products Table Loading State -->
          <div
            v-if="loadingProducts"
            class="flex-1 flex justify-center items-center"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
              ></div>
              <p class="text-gray-600">{{ $t("loadingProducts") }}</p>
            </div>
          </div>

          <!-- No Products State -->
          <div
            v-else-if="filteredProducts.length === 0"
            class="flex-1 flex items-center justify-center"
          >
            <div class="text-center">
              <p class="text-gray-500 mb-4">{{ $t("noProductsFound") }}</p>
              <button
                @click="redirectToAdminProductPage"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
              >
                {{ $t("addNewProduct") }}
              </button>
            </div>
          </div>

          <!-- Products Table -->
          <div v-else class="flex-1 overflow-y-auto">
            <table class="w-full border-collapse">
              <thead class="sticky top-0 z-10">
                <tr>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("productName") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("amount") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("action") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in filteredProducts"
                  :key="product.product"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="p-4 border-b border-gray-200">
                    {{ product.name }}
                  </td>
                  <td class="p-4 border-b border-gray-200 w-32">
                    <input
                      type="number"
                      v-model.number="product.amount"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td class="p-4 border-b border-gray-200">
                    <button
                      @click="updateProductAmount(product)"
                      :disabled="!hasAmountChanged(product)"
                      :class="[
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        hasAmountChanged(product)
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed',
                      ]"
                    >
                      {{ $t("updateAmount") }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State for initial page load and product updates -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div
          class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600">{{ $t("loading") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import type { Category } from "@/types/category";
import type {
  Warehouse,
  ProductAmount,
  ProductUpdateData,
} from "@/types/warehouse";
import type { ProductIdsResponse } from "@/types/products";

import { getAllCategories } from "@/services/categoryService";
import { getProductIdsByCategoryId } from "@/services/productService";
import {
  getWarehouses,
  updateWarehouseProductAmount,
} from "@/services/warehouseService";

import ProductStatusList from "@/components/admin/warehouses/ProductCriticalStatusList.vue";

// Composables setup
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

// State Management
// Data state
const warehouses = ref<Warehouse[]>([]);
const categories = ref<Category[]>([]);
const productIds = ref<string[]>([]);
const originalAmounts = ref<Record<string, number>>({});
const loading = ref<boolean>(true);
const loadingProducts = ref<boolean>(false);

// UI state
const selectedWarehouseId = ref<string>("");
const selectedCategoryId = ref<string>("");

// Computed Properties
const selectedWarehouse = computed<Warehouse | undefined>(() => {
  return warehouses.value.find(
    (warehouse) => warehouse._id === selectedWarehouseId.value
  );
});

const filteredProducts = computed<ProductAmount[]>(() => {
  if (!selectedWarehouse.value) return [];
  return selectedWarehouse.value.products.filter((product) =>
    productIds.value.includes(product.product)
  );
});

// Data Fetching
const fetchWarehouses = async () => {
  try {
    loading.value = true;
    const response = await getWarehouses();
    warehouses.value = response;
    if (warehouses.value.length > 0) {
      selectedWarehouseId.value = warehouses.value[0]._id;
    }
  } catch (error: unknown) {
    console.error("Failed to fetch warehouses:", error);
    toast.error(t("failedToFetchWarehouses"));
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    loading.value = true;
    const response = await getAllCategories();
    categories.value = response.categories;
    if (categories.value.length > 0) {
      selectedCategoryId.value = categories.value[0]._id || "";
      fetchProducts();
    }
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    toast.error(t("failedToFetchCategories"));
  } finally {
    loading.value = false;
  }
};

const fetchProducts = async () => {
  try {
    // Use loadingProducts instead of loading for category switching
    loadingProducts.value = true;
    const response: ProductIdsResponse = await getProductIdsByCategoryId(
      selectedCategoryId.value
    );
    productIds.value = response.productIds;

    originalAmounts.value = {};
    if (selectedWarehouse.value) {
      selectedWarehouse.value.products.forEach((product) => {
        originalAmounts.value[product.product] = product.amount;
      });
    }
  } catch (error: unknown) {
    console.error("Failed to fetch products by category:", error);
    toast.error(t("failedToFetchProducts"));
  } finally {
    loadingProducts.value = false;
  }
};

// Action Handlers
const selectCategory = (category: Category) => {
  // Reset any unsaved changes when switching categories
  if (selectedWarehouse.value) {
    selectedWarehouse.value.products.forEach((product) => {
      if (originalAmounts.value[product.product] !== undefined) {
        product.amount = originalAmounts.value[product.product];
      }
    });
  }

  selectedCategoryId.value = category._id || "";
  fetchProducts();
};

const updateProductAmount = async (product: ProductAmount) => {
  try {
    // Use main loading state for updates since it's a critical operation
    loading.value = true;
    const updateData: ProductUpdateData = {
      productId: product.product,
      amount: product.amount,
    };

    await updateWarehouseProductAmount(selectedWarehouseId.value, updateData);
    toast.success(t("productAmountUpdatedSuccessfully"));
    originalAmounts.value[product.product] = product.amount;

    const currentWarehouseId = selectedWarehouseId.value;
    await fetchWarehouses();
    selectedWarehouseId.value = currentWarehouseId;
  } catch (error: unknown) {
    console.error("Failed to update product amount:", error);
    toast.error(t("failedToUpdateProductAmount"));
  } finally {
    loading.value = false;
  }
};

const hasAmountChanged = (product: ProductAmount): boolean => {
  return product.amount !== originalAmounts.value[product.product];
};

const redirectToAdminProductPage = () => {
  router.push("/admin/products");
};

// Watchers
watch(selectedWarehouseId, async (newWarehouseId) => {
  if (newWarehouseId) {
    const warehouse = warehouses.value.find(
      (warehouse) => warehouse._id === newWarehouseId
    );

    if (warehouse) {
      originalAmounts.value = {};
      warehouse.products.forEach((product) => {
        originalAmounts.value[product.product] = product.amount;
      });
    }
  }
});

// Lifecycle Hooks
onMounted(async () => {
  await fetchWarehouses();
  await fetchCategories();
});
</script>
