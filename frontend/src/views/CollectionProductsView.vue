<template>
  <div class="category-view">
    <div class="main-layout">
      <div class="categories-sidebar">
        <div
          v-for="cat in categories"
          :key="cat._id"
          class="category-small-card"
          :class="{ active: cat._id === category?._id }"
          @click="changeCategory(cat._id ?? '')"
        >
          <img :src="cat.imageUrl" :alt="cat.name" />
          <h3>{{ cat.name }}</h3>
        </div>
      </div>

      <div class="products-section">
        <h1>{{ category?.name }}</h1>
        <div v-if="products.length === 0" class="no-products">
          <p>{{ $t("noProductsForCategory", { category: category?.name }) }}</p>
        </div>
        <div v-else class="products-grid">
          <div
            v-for="product in products"
            :key="product._id"
            class="product-card"
          >
            <img :src="product.imageUrls?.main" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p>{{ formatPrice(product.price[currency]?.amount) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";

import type { Product } from "@/types/products";
import type { Category } from "@/types/categories";
import {
  getProductsByCategoryId,
  getAllCategories,
} from "@/services/storeService";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();

const category = ref<Category | null>(null);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const currency = authStore.currency as "rubles" | "euros";

const formatPrice = (price: number): string => {
  return currency === "rubles" ? `${price} ₽` : `${price} €`;
};

const fetchCategories = async () => {
  try {
    const categoriesResponse = await getAllCategories();
    categories.value = categoriesResponse.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const fetchProducts = async (categoryId: string) => {
  try {
    products.value = [];
    const productsResponse = await getProductsByCategoryId(categoryId);
    products.value = productsResponse.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    products.value = [];
  }
};

const fetchCategoryData = async () => {
  const categoryId = route.params.categoryId as string;
  try {
    category.value =
      categories.value.find((cat) => cat._id === categoryId) || null;

    await fetchProducts(categoryId);
  } catch (error) {
    console.error("Error fetching category data:", error);
  }
};

const changeCategory = (categoryId: string) => {
  router.push(`/collections/${categoryId}`);
};

watch(
  () => route.params.categoryId,
  async (newCategoryId) => {
    if (newCategoryId) {
      await fetchCategoryData();
    }
  }
);

onMounted(async () => {
  await fetchCategories();
  await fetchCategoryData();
});
</script>

<style scoped>
.category-view {
  padding: 20px;
}

.main-layout {
  display: flex;
  gap: 20px;
}

.categories-sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 1px solid #ddd;
  padding-right: 10px;
}

.category-small-card {
  cursor: pointer;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  transition: transform 0.2s;
}

.category-small-card.active {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.category-small-card:hover {
  transform: scale(1.05);
}

.category-small-card img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.products-section {
  flex: 1;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.product-card {
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
}

.product-card img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.no-products {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}
</style>
