<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Warehouse Selection Section -->
      <div class="mb-6 flex justify-center">
        <!-- Loading state for warehouses -->
        <div
          v-if="loading && warehouses.length === 0"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-lg flex justify-center items-center"
        >
          <div class="flex items-center">
            <div
              class="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mr-3"
            ></div>
            <span class="text-gray-600">{{ $t("loadingWarehouses") }}</span>
          </div>
        </div>

        <!-- Error state - only shown after loading if no warehouses found -->
        <div
          v-else-if="!loading && warehouses.length === 0"
          class="p-6 bg-white rounded-lg shadow-sm border border-red-200 text-center text-red-600 w-full max-w-lg"
        >
          <p>{{ $t("noWarehousesFound") }}</p>
        </div>

        <!-- Warehouse selection dropdown -->
        <div
          v-else
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full max-w-lg"
        >
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="sm:min-w-[180px] flex items-center">
              <label
                for="warehouseSelect"
                class="text-lg font-medium text-gray-700"
                >{{ $t("selectWarehouse") }}:</label
              >
              <!-- Small loader for warehouse -->
              <div v-if="loading && !loadingProducts" class="ml-2">
                <div
                  class="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"
                ></div>
              </div>
            </div>
            <select
              id="warehouseSelect"
              v-model="selectedWarehouseId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="loading"
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
      </div>

      <!-- Critical Stock Section - Only shown when there are critical items -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform -translate-y-4"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-4"
        mode="out-in"
      >
        <div
          v-if="
            selectedWarehouse &&
            selectedWarehouse.products.length > 0 &&
            hasCriticalItems
          "
          key="critical-section"
          class="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
        >
          <div
            class="p-4 border-b border-gray-200 flex justify-between items-center"
          >
            <div class="flex items-center">
              <h2 class="text-lg font-semibold text-gray-800">
                {{ $t("criticalStockAlert") }}
              </h2>
              <!-- Small loader for critical stock -->
              <div v-if="loading && !loadingProducts" class="ml-2">
                <div
                  class="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"
                ></div>
              </div>
            </div>
          </div>

          <div class="overflow-auto p-4" style="max-height: 400px">
            <ProductStatusList
              v-if="selectedWarehouse"
              :products="selectedWarehouse.products"
              :criticalThreshold="criticalThreshold"
              :originalAmounts="originalAmounts"
            />
          </div>
        </div>
      </transition>

      <!-- Main Content Area -->
      <div
        v-if="warehouses.length > 0 && categories.length > 0"
        class="flex flex-col md:flex-row gap-6"
        :class="{ 'mt-6': !hasCriticalItems }"
      >
        <!-- Categories Menu - Fixed width, self-contained height -->
        <div class="w-full md:w-64 self-start">
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col h-full"
          >
            <div
              class="flex items-center justify-between mb-4 pb-2 border-b border-gray-100"
            >
              <h2 class="text-lg font-semibold text-gray-800">
                {{ $t("categories") }}
              </h2>
              <!-- Small loader for categories -->
              <div v-if="loading && !loadingProducts" class="flex items-center">
                <div
                  class="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"
                ></div>
              </div>
            </div>

            <!-- Categories -->
            <div class="overflow-y-auto max-h-[500px]">
              <div class="flex flex-col gap-2 pr-2">
                <transition-group
                  name="list-categories"
                  enter-active-class="transition-all duration-300 ease-out"
                  leave-active-class="transition-all duration-200 ease-in"
                  enter-from-class="opacity-0 transform -translate-x-4"
                  enter-to-class="opacity-100 transform translate-x-0"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <button
                    v-for="category in categories"
                    :key="category._id"
                    @click="selectCategory(category)"
                    :class="[
                      'py-2.5 px-4 text-sm font-medium rounded-md w-full text-left transform transition-all duration-200 ease-in-out hover:translate-x-1',
                      category._id === selectedCategoryId
                        ? 'bg-blue-600 text-white translate-x-2'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                    ]"
                    :disabled="loading"
                  >
                    {{ category.name }}
                  </button>
                </transition-group>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Section -->
        <div class="flex-1">
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col"
          >
            <div
              class="p-4 border-b border-gray-200 flex items-center justify-between"
            >
              <h2 class="text-lg font-semibold text-gray-800">
                {{ $t("products") }}
              </h2>
              <!-- Small loader for main loading -->
              <div v-if="loading && !loadingProducts" class="flex items-center">
                <div
                  class="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"
                ></div>
              </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-hidden flex flex-col">
              <transition
                enter-active-class="transition-opacity duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
              >
                <!-- Products Table Loading State -->
                <div
                  v-if="loadingProducts"
                  class="flex-1 flex justify-center items-center py-16"
                  key="loading-state"
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
                  class="flex-1 flex items-center justify-center py-16"
                  key="empty-state"
                >
                  <div class="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-16 w-16 text-gray-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <p class="text-gray-500 text-lg mb-4">
                      {{ $t("noProductsFound") }}
                    </p>
                    <button
                      @click="redirectToAdminProductPage"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      {{ $t("addNewProduct") }}
                    </button>
                  </div>
                </div>

                <!-- Products Table -->
                <div v-else class="overflow-x-auto" key="products-table">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr>
                        <th
                          class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                        >
                          {{ $t("productName") }}
                        </th>
                        <th
                          class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-48"
                        >
                          {{ $t("amount") }}
                        </th>
                        <th
                          class="bg-gray-50 p-4 text-right font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-40"
                        >
                          {{ $t("action") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(product, index) in filteredProducts"
                        :key="product.product"
                        class="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td
                          class="p-4 border-b border-gray-200"
                          :class="{
                            'border-b-0': index === filteredProducts.length - 1,
                          }"
                        >
                          <span class="font-medium text-gray-700">{{
                            product.name
                          }}</span>
                        </td>
                        <td
                          class="p-4 border-b border-gray-200"
                          :class="{
                            'border-b-0': index === filteredProducts.length - 1,
                          }"
                        >
                          <input
                            type="number"
                            v-model.number="product.amount"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td
                          class="p-4 border-b border-gray-200 text-right"
                          :class="{
                            'border-b-0': index === filteredProducts.length - 1,
                          }"
                        >
                          <button
                            @click="updateProductAmount(product)"
                            :disabled="
                              !hasAmountChanged(product) ||
                              updatingProductId === product.product
                            "
                            :class="[
                              'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center',
                              hasAmountChanged(product)
                                ? updatingProductId === product.product
                                  ? 'bg-blue-400 text-white cursor-wait'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed',
                            ]"
                          >
                            <span
                              v-if="updatingProductId === product.product"
                              class="mr-2"
                            >
                              <div
                                class="w-4 h-4 border-2 border-white border-t-blue-500 rounded-full animate-spin"
                              ></div>
                            </span>
                            {{ $t("updateAmount") }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </transition>
            </div>
          </div>
        </div>
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
const criticalThreshold = ref<number>(2);
const updatingProductId = ref<string | null>(null); // Track which product is currently being updated

// UI state
const selectedWarehouseId = ref<string>("");
const selectedCategoryId = ref<string>("");

// Computed Properties
const selectedWarehouse = computed<Warehouse | undefined>(() => {
  return warehouses.value.find(
    (warehouse) => warehouse._id === selectedWarehouseId.value
  );
});

const hasCriticalItems = computed<boolean>(() => {
  if (!selectedWarehouse.value || selectedWarehouse.value.products.length === 0)
    return false;

  return selectedWarehouse.value.products.some((product) => {
    const amount =
      originalAmounts.value[product.product] !== undefined
        ? originalAmounts.value[product.product]
        : product.amount;
    return amount <= criticalThreshold.value;
  });
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
    // Start a timer to track loading time
    const loadingTimer = setTimeout(() => {
      loadingProducts.value = true;
    }, 200); // Only show loading state if fetching takes more than 200ms

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

    // Clear the timer and loading state
    clearTimeout(loadingTimer);
    loadingProducts.value = false;
  } catch (error: unknown) {
    console.error("Failed to fetch products by category:", error);
    toast.error(t("failedToFetchProducts"));
    loadingProducts.value = false;
  }
};

// Action Handlers
const selectCategory = (category: Category) => {
  // Only do something if we're selecting a different category
  if (category._id === selectedCategoryId.value) return;

  // Show loading state
  loadingProducts.value = true;

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
    // Set only this product as updating instead of the whole page
    updatingProductId.value = product.product;

    const updateData: ProductUpdateData = {
      productId: product.product,
      amount: product.amount,
    };

    await updateWarehouseProductAmount(selectedWarehouseId.value, updateData);
    toast.success(t("productAmountUpdatedSuccessfully"));
    originalAmounts.value[product.product] = product.amount;

    const currentWarehouseId = selectedWarehouseId.value;
    const currentCategoryId = selectedCategoryId.value;
    await fetchWarehouses();
    selectedWarehouseId.value = currentWarehouseId;
    selectedCategoryId.value = currentCategoryId;
    await fetchProducts();
  } catch (error: unknown) {
    console.error("Failed to update product amount:", error);
    toast.error(t("failedToUpdateProductAmount"));
  } finally {
    updatingProductId.value = null;
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

<style scoped>
/* Remove last border for table rows */
tr:last-child td {
  border-bottom: none;
}

/* Category button interactions using only Tailwind classes are handled in the template */
</style>
