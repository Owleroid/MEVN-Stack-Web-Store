<template>
  <div class="space-y-6 border rounded-md p-6 bg-gray-50">
    <h3 class="text-lg font-medium text-gray-700 mb-4">
      {{ $t("addNewProduct") }}
    </h3>

    <!-- Product Search Input -->
    <div class="relative">
      <label
        for="newProductName"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        {{ $t("productName") }}:
      </label>
      <input
        type="text"
        v-model="newProductName"
        id="newProductName"
        @input="searchProductsHandler"
        class="mt-1 block w-full py-2.5 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        :placeholder="$t('searchProductPlaceholder')"
        :aria-invalid="!!errors.product"
      />

      <!-- Search Results Dropdown -->
      <ul
        v-if="searchResults.length > 0"
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <li
          v-for="product in searchResults"
          :key="product._id"
          @click="selectProduct(product)"
          class="relative cursor-pointer select-none py-2.5 px-4 hover:bg-blue-100"
        >
          <div class="flex items-center">
            <span class="block truncate font-medium">{{ product.name }}</span>
            <span class="ml-auto text-sm text-gray-500">{{
              formatPrice(product.price.euros.amount)
            }}</span>
          </div>
        </li>
        <li
          v-if="searchResults.length === 0"
          class="relative cursor-default select-none py-2.5 px-4 text-gray-500"
        >
          {{ $t("noProductsFound") }}
        </li>
      </ul>

      <p v-if="errors.product" class="mt-2 text-sm text-red-600">
        {{ errors.product }}
      </p>
    </div>

    <!-- Quantity Input -->
    <div class="mt-6">
      <label
        for="newProductAmount"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        {{ $t("quantity") }}:
      </label>
      <input
        type="number"
        v-model.number="newProductAmount"
        id="newProductAmount"
        min="1"
        class="mt-1 block w-full py-2.5 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        :placeholder="$t('enterQuantity')"
        :aria-invalid="!!errors.amount"
      />
      <p v-if="errors.amount" class="mt-2 text-sm text-red-600">
        {{ errors.amount }}
      </p>
    </div>

    <!-- Selected Product Summary -->
    <div
      v-if="selectedProduct"
      class="p-4 bg-blue-50 rounded border border-blue-200 mt-6"
    >
      <div class="flex justify-between items-center">
        <span class="font-medium">{{ selectedProduct.name }}</span>
        <span>{{ formatPrice(selectedProduct.price.euros.amount) }}</span>
      </div>
      <div class="text-sm text-gray-600 mt-2" v-if="newProductAmount > 0">
        {{ $t("totalPrice") }}:
        {{ formatPrice(selectedProduct.price.euros.amount * newProductAmount) }}
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <button
        type="button"
        @click="close"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium shadow-sm"
      >
        {{ $t("cancel") }}
      </button>
      <button
        type="button"
        @click="addProduct"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium shadow-sm"
        :disabled="!selectedProduct || newProductAmount < 1"
      >
        {{ $t("addToOrder") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import debounce from "lodash/debounce";

import type { Product } from "@/types/products";

import { searchProducts } from "@/services/productService";

// Props & Emits
const props = defineProps<{
  existingProductIds: string[];
}>();

const emits = defineEmits(["addProduct", "close"]);

// Composables
const { t } = useI18n();

// State Management
// Form inputs
const newProductName = ref<string>("");
const newProductAmount = ref<number>(1);

// Search state
const searchResults = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);
const isSearching = ref<boolean>(false);

// Validation state
interface ValidationErrors {
  product: string;
  amount: string;
}

const errors = ref<ValidationErrors>({
  product: "",
  amount: "",
});

// Search & Selection Logic
const searchProductsHandler = debounce(async () => {
  if (!newProductName.value.trim()) {
    searchResults.value = [];
    selectedProduct.value = null;
    return;
  }

  if (newProductName.value.trim().length < 2) {
    searchResults.value = [];
    return;
  }

  try {
    isSearching.value = true;
    const { success, products } = await searchProducts(newProductName.value);
    if (success) {
      searchResults.value = products.filter(
        (product) => !props.existingProductIds.includes(product._id)
      );
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error("Error searching products:", error);
    errors.value.product = t("errorSearchingProducts");
  } finally {
    isSearching.value = false;
  }
}, 300);

const selectProduct = (product: Product): void => {
  selectedProduct.value = product;
  newProductName.value = product.name;
  searchResults.value = [];
};

// Form Submission Logic
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = { product: "", amount: "" };

  if (!selectedProduct.value) {
    errors.value.product = t("selectProductError");
    isValid = false;
  }

  if (!newProductAmount.value || newProductAmount.value < 1) {
    errors.value.amount = t("invalidQuantityError");
    isValid = false;
  }

  return isValid;
};

const addProduct = (): void => {
  if (!validateForm()) return;

  if (selectedProduct.value) {
    emits("addProduct", {
      productId: selectedProduct.value._id,
      name: selectedProduct.value.name,
      amount: newProductAmount.value,
      productPrice: selectedProduct.value.price.euros.amount,
    });

    resetForm();
  }
};

const resetForm = (): void => {
  newProductName.value = "";
  newProductAmount.value = 1;
  selectedProduct.value = null;
  errors.value = { product: "", amount: "" };
};

const close = () => {
  emits("close");
};

// Helper Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};
</script>
