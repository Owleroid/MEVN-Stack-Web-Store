<template>
  <div class="add-product-fields">
    <label for="newProductName">{{ $t("newProductName") }}:</label>
    <input
      type="text"
      v-model="newProductName"
      id="newProductName"
      @input="searchProducts"
    />
    <ul v-if="searchResults.length > 0">
      <li
        v-for="product in searchResults"
        :key="product._id"
        @click="selectProduct(product)"
      >
        {{ product.name }}
      </li>
    </ul>
    <label for="newProductAmount">{{ $t("amount") }}:</label>
    <input
      type="number"
      v-model.number="newProductAmount"
      id="newProductAmount"
      min="1"
    />
    <button type="button" @click="addProduct">
      {{ $t("addProduct") }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { Product } from "@/types/products";

import { searchProductsByName } from "@/services/productService";

const props = defineProps<{
  existingProductIds: string[];
}>();

const emits = defineEmits(["addProduct"]);

const newProductName = ref("");
const newProductAmount = ref(1);
const searchResults = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);

const searchProducts = async () => {
  if (newProductName.value) {
    try {
      const response = await searchProductsByName(newProductName.value);
      const allProducts = response.data.products;

      // Filter out products that are already in the order
      searchResults.value = allProducts.filter(
        (product: { _id: string }) =>
          !props.existingProductIds.includes(product._id)
      );
    } catch (error) {
      console.error("Error searching products:", error);
    }
  } else {
    searchResults.value = [];
  }
};

const selectProduct = (product: Product) => {
  selectedProduct.value = product;
  newProductName.value = product.name;
  searchResults.value = [];
};

const addProduct = () => {
  if (selectedProduct.value && newProductAmount.value > 0) {
    emits("addProduct", {
      productId: selectedProduct.value._id,
      name: selectedProduct.value.name,
      amount: newProductAmount.value,
      productPrice: selectedProduct.value.price.euros.amount,
    });
    newProductName.value = "";
    newProductAmount.value = 1;
    selectedProduct.value = null;
  }
};
</script>

<style scoped>
.add-product-fields {
  margin-top: 10px;
}

.add-product-fields label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.add-product-fields input,
.add-product-fields select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.add-product-fields button {
  display: inline-block;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-product-fields button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.add-product-fields button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.8);
}

.add-product-fields button:active {
  background-color: #004085;
  transform: scale(0.95);
}
</style>
