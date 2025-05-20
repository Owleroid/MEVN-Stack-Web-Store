<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Page Title -->
    <h1
      v-if="category"
      class="text-3xl font-bold text-gray-900 mb-8 text-center"
    >
      {{ category.name }}
    </h1>
    <h1 v-else class="text-3xl font-bold text-gray-900 mb-8 text-center">
      {{ $t("collections") }}
    </h1>

    <!-- Initial Page Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
      <span class="ml-3 text-sm text-gray-600">{{
        $t("loadingCategories")
      }}</span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-md p-4 mb-8"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col md:flex-row gap-8">
      <!-- Categories Sidebar -->
      <div class="w-full md:w-64 shrink-0">
        <div class="bg-white rounded-lg shadow-md p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            {{ $t("categories") }}
          </h2>
          <div class="space-y-2">
            <div
              v-for="cat in categories"
              :key="cat._id"
              @click="changeCategory(cat)"
              class="p-3 rounded-md cursor-pointer transition-colors duration-200 flex items-center gap-3"
              :class="
                cat._id === category?._id
                  ? 'bg-blue-50 border border-blue-100'
                  : 'hover:bg-gray-50 border border-transparent'
              "
            >
              <div
                class="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0"
              >
                <img
                  :src="cat.imageUrl"
                  :alt="cat.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
              <span
                class="text-sm font-medium"
                :class="
                  cat._id === category?._id ? 'text-blue-600' : 'text-gray-700'
                "
              >
                {{ cat.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="flex-1">
        <!-- Empty State -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div
            v-if="!loadingProducts && products.length === 0"
            class="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              {{ $t("noProductsForCategory", { category: category?.name }) }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ $t("checkBackLater") }}
            </p>
          </div>
        </transition>

        <transition
          enter-active-class="transition-opacity ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <div
            v-if="products.length > 0"
            :key="category?._id"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div
              v-for="product in products"
              :key="product._id"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <router-link
                :to="`/${category?.slug}/${product.slug}`"
                class="block"
              >
                <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img
                    :src="product.imageUrls?.main"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                    @error="handleProductImageError"
                  />
                </div>
                <div class="p-4">
                  <h3
                    class="text-lg font-medium text-gray-900 mb-1 line-clamp-2"
                  >
                    {{ product.name }}
                  </h3>
                  <div v-if="product.discount" class="text-lg mb-3">
                    <p class="font-bold text-gray-800">
                      {{ formatPrice(product.price?.[currency] ?? 0) }}
                    </p>
                    <p class="text-sm line-through text-gray-500">
                      {{
                        formatPrice(
                          product.discount.originalPrice?.[currency] ?? 0
                        )
                      }}
                    </p>
                  </div>
                  <p v-else class="text-lg font-bold text-gray-800 mb-3">
                    {{ formatPrice(product.price?.[currency] ?? 0) }}
                  </p>
                </div>
              </router-link>
              <div class="px-4 pb-4">
                <AddToCartButton
                  :product="product"
                  class="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { useAuthStore } from "@/stores/authStore";

import { getProductsByCategoryId } from "@/services/productService";

import {
  getAllCategories,
  getCategoryBySlug,
} from "@/services/categoryService";

import AddToCartButton from "@/components/general/AddToCartButton.vue";

import type { Product } from "@/types/products";
import type { Category } from "@/types/category";

// Composables
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();

// State
const category = ref<Category | null>(null);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref<boolean>(true);
const loadingProducts = ref<boolean>(false);
const error = ref<string>("");

// Get user's preferred currency
const currency = authStore.currency as "rubles" | "euros";

// Utilities
const formatPrice = (price: number): string => {
  return currency === "rubles"
    ? new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(price)
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(price);
};

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement;
  target.src = "/images/placeholder-category.png";
};

const handleProductImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement;
  target.src = "/images/placeholder-product.png";
};

// Data Fetching
const fetchCategories = async (): Promise<void> => {
  try {
    const response = await getAllCategories();
    categories.value = response.categories;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    error.value = t("fetchCategoriesError") + ": " + errorMessage;
    console.error("Error fetching categories:", err);
  }
};

const fetchProducts = async (categoryId: string): Promise<void> => {
  loadingProducts.value = true;
  try {
    const response = await getProductsByCategoryId(categoryId);
    products.value = response.products;
  } catch (err: unknown) {
    const axiosError = err as { response?: { status: number } };
    if (axiosError.response?.status === 404) {
      products.value = [];
    } else {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error.value = t("fetchProductsError") + ": " + errorMessage;
      console.error("Error fetching products:", err);
      products.value = [];
    }
  } finally {
    loadingProducts.value = false;
  }
};

const fetchCategoryData = async (): Promise<void> => {
  if (categories.value.length === 0) {
    loading.value = true;
  }
  error.value = "";

  const slug = route.params.slug as string;

  if (!slug) {
    error.value = t("noCategorySelected");
    loading.value = false;
    return;
  }

  try {
    const response = await getCategoryBySlug(slug);
    category.value = response.category;

    if (!category.value) {
      error.value = t("categoryNotFound");
    } else {
      await fetchProducts(category.value._id);
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    error.value = t("fetchDataError") + ": " + errorMessage;
    console.error("Error fetching category data:", err);
  } finally {
    loading.value = false;
  }
};

// Navigation
const changeCategory = (cat: Category): void => {
  if (!cat || !cat.slug) return;
  router.push(`/${cat.slug}`);
};

// Watchers
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      await fetchCategoryData();
    }
  }
);

// Lifecycle Hooks
onMounted(async () => {
  await fetchCategories();
  await fetchCategoryData();
});
</script>
