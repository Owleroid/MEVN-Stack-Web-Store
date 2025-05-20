<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
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
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Product Detail -->
    <div
      v-else-if="product"
      class="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <!-- Breadcrumb -->
      <div class="px-6 pt-6 pb-3">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <router-link to="/" class="text-gray-500 hover:text-gray-700">
                {{ $t("home") }}
              </router-link>
            </li>
            <li class="flex items-center">
              <svg
                class="h-4 w-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <router-link
                :to="`/${categorySlug}`"
                class="ml-2 text-gray-500 hover:text-gray-700"
              >
                {{ $t("collections") }}
              </router-link>
            </li>
            <li class="flex items-center">
              <svg
                class="h-4 w-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="ml-2 text-gray-900 font-medium">{{
                product.name
              }}</span>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Product Content -->
      <div class="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image Gallery -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div
            class="bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer"
            @click="openImageModal(currentImage)"
          >
            <img
              :src="currentImage"
              :alt="product.name"
              class="w-full h-full object-contain"
              @error="handleImageError"
            />
          </div>

          <!-- Thumbnail Navigation - Only show if there are secondary images -->
          <div
            v-if="hasSecondaryImages"
            class="flex space-x-2 overflow-x-auto pb-2"
          >
            <button
              v-if="product.imageUrls && product.imageUrls.main"
              @click="setActiveImage(product.imageUrls.main)"
              class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{
                'ring-2 ring-blue-500': currentImage === product.imageUrls.main,
              }"
            >
              <img
                :src="product.imageUrls.main"
                :alt="product.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </button>
            <button
              v-for="(image, index) in product.imageUrls.secondary"
              :key="index"
              @click="setActiveImage(image)"
              class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'ring-2 ring-blue-500': currentImage === image }"
            >
              <img
                :src="image"
                :alt="`${product.name} - image ${index + 1}`"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          <div v-if="product.productNumber" class="mt-1">
            <span
              class="inline-block bg-blue-50 text-blue-700 text-xs font-semibold rounded px-2 py-1"
              >#{{ product.productNumber }}</span
            >
          </div>

          <div class="flex items-center space-x-4">
            <div v-if="product.discount" class="flex flex-col">
              <p class="text-2xl font-bold text-gray-900">
                {{ formatPrice(product.price[currency]) }}
              </p>
              <div class="flex items-center space-x-2">
                <p class="text-lg line-through text-gray-500">
                  {{ formatPrice(product.discount.originalPrice[currency]) }}
                </p>
              </div>
            </div>
            <p v-else class="text-2xl font-bold text-gray-900">
              {{ formatPrice(product.price[currency]) }}
            </p>
          </div>

          <div class="space-y-4 border-t border-b border-gray-200 py-6">
            <div v-if="product.artist" class="flex">
              <span class="w-32 text-sm font-medium text-gray-600"
                >{{ $t("artist") }}:</span
              >
              <span class="text-gray-800">{{ product.artist }}</span>
            </div>
            <div class="flex">
              <span class="w-32 text-sm font-medium text-gray-600"
                >{{ $t("size") }}:</span
              >
              <span class="text-gray-800">{{ product.size }}</span>
            </div>
            <div class="flex">
              <span class="w-32 text-sm font-medium text-gray-600"
                >{{ $t("material") }}:</span
              >
              <span class="text-gray-800">{{ product.material }}</span>
            </div>
            <div v-if="product.parts" class="flex">
              <span class="w-32 text-sm font-medium text-gray-600"
                >{{ $t("parts") }}:</span
              >
              <span class="text-gray-800">{{ product.parts }}</span>
            </div>
            <div class="flex">
              <span class="w-32 text-sm font-medium text-gray-600"
                >{{ $t("boxArt") }}:</span
              >
              <span class="text-gray-800">{{ product.boxArt }}</span>
            </div>
          </div>

          <div v-if="product.description" class="space-y-3">
            <h3 class="text-lg font-medium text-gray-900">
              {{ $t("description") }}
            </h3>
            <p class="text-gray-700 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Add to Cart Button -->
          <div class="mt-8">
            <AddToCartButton
              :product="product"
              class="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-base font-medium"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl max-h-[90vh] p-2">
        <button
          @click.stop="closeImageModal"
          class="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          :src="modalImage"
          :alt="product?.name || ''"
          class="max-w-full max-h-[80vh] object-contain mx-auto"
          @error="handleImageError"
          @click.stop
        />

        <!-- Navigation buttons only if there are multiple images -->
        <div
          v-if="hasSecondaryImages"
          class="absolute left-0 right-0 bottom-4 flex justify-center space-x-4"
        >
          <button
            v-if="product?.imageUrls?.main && hasMultipleImages"
            @click.stop="navigateImages('prev')"
            class="text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            v-if="product?.imageUrls?.main && hasMultipleImages"
            @click.stop="navigateImages('next')"
            class="text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { useAuthStore } from "@/stores/authStore";

import { getProductBySlug } from "@/services/productService";

import AddToCartButton from "@/components/general/AddToCartButton.vue";

import type { Product } from "@/types/products";

// Composables
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();

// State
const product = ref<Product | null>(null);
const loading = ref<boolean>(true);
const error = ref<string>("");
const currentImage = ref<string>("");

// URL params
const categorySlug = computed(() => route.params.categorySlug as string);
const productSlug = computed(() => route.params.productSlug as string);

// Modal state
const showImageModal = ref<boolean>(false);
const modalImage = ref<string>("");

// Get user's preferred currency
const currency = authStore.currency as "rubles" | "euros";

// Utilities
const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(currency === "rubles" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Computed
const hasSecondaryImages = computed(
  () =>
    product.value?.imageUrls?.secondary &&
    Array.isArray(product.value.imageUrls.secondary) &&
    product.value.imageUrls.secondary.length > 0
);

const hasMultipleImages = computed(() => {
  if (!product.value?.imageUrls) return false;

  const secondaryCount = product.value.imageUrls.secondary?.length || 0;
  return secondaryCount > 0;
});

const allImages = computed(() => {
  if (!product.value?.imageUrls) return [];

  const images = [];
  if (product.value.imageUrls.main) {
    images.push(product.value.imageUrls.main);
  }

  if (Array.isArray(product.value.imageUrls.secondary)) {
    images.push(...product.value.imageUrls.secondary);
  }

  return images;
});

// Methods
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
  target.src = "/images/placeholder-product.png";
};

const setActiveImage = (imageUrl: string): void => {
  if (imageUrl) {
    currentImage.value = imageUrl;
  }
};

const openImageModal = (imageUrl: string): void => {
  modalImage.value = imageUrl;
  showImageModal.value = true;

  document.addEventListener("keydown", handleEscapeKey);
};

const closeImageModal = (): void => {
  showImageModal.value = false;
  document.removeEventListener("keydown", handleEscapeKey);
};

const handleEscapeKey = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    closeImageModal();
  }
};

const navigateImages = (direction: "next" | "prev"): void => {
  const images = allImages.value;
  if (images.length <= 1) return;

  const currentIndex = images.findIndex((img) => img === modalImage.value);
  let newIndex;

  if (direction === "next") {
    newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
  } else {
    newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
  }

  modalImage.value = images[newIndex];
};

// Fetch product data
const fetchProductData = async (): Promise<void> => {
  loading.value = true;
  error.value = "";
  currentImage.value = "";

  try {
    const response = await getProductBySlug(
      productSlug.value,
      categorySlug.value
    );

    if (response.redirectNeeded && response.correctCategorySlug) {
      router.replace(`/${response.correctCategorySlug}/${productSlug.value}`);
      return;
    }

    product.value = response.product;

    if (
      product.value &&
      product.value.imageUrls &&
      product.value.imageUrls.main
    ) {
      currentImage.value = product.value.imageUrls.main;
    } else {
      currentImage.value = "/images/placeholder-product.png";
      if (product.value && !product.value.imageUrls) {
        product.value.imageUrls = { main: currentImage.value, secondary: [] };
      } else if (product.value && !product.value.imageUrls.main) {
        product.value.imageUrls.main = currentImage.value;
      }

      if (product.value && !product.value.imageUrls.secondary) {
        product.value.imageUrls.secondary = [];
      }

      error.value = product.value ? "" : t("productNotFound");
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    error.value = t("fetchProductError") + ": " + errorMessage;
    console.error("Error fetching product data:", err);
  } finally {
    loading.value = false;
  }
};

// Cleanup function
const cleanup = (): void => {
  document.removeEventListener("keydown", handleEscapeKey);
};

// Watchers
watch(
  () => [route.params.categorySlug, route.params.productSlug],
  async () => {
    if (productSlug.value) {
      await fetchProductData();
    }
  }
);

// Lifecycle Hooks
onMounted(async () => {
  await fetchProductData();
});

// Cleanup on component unmount
onUnmounted(() => {
  cleanup();
});
</script>
