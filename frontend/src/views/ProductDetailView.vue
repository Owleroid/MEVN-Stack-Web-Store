<template>
  <div class="px-4 py-8 md:py-10 max-w-7xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="w-14 h-14 border-4 border-white border-opacity-20 border-t-main-red rounded-full animate-spin"
      ></div>
      <span class="ml-3 text-sm text-main-gray-hover">{{
        $t("loadingProduct")
      }}</span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-black bg-opacity-30 border border-red-600 rounded-md p-4 mb-8 text-center"
    >
      <div class="flex items-center justify-center">
        <div class="flex-shrink-0">
          <svg
            class="h-6 w-6 text-red-500"
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
          <p class="text-sm text-red-400">
            {{ error }}
          </p>
          <button
            @click="fetchProductData"
            class="mt-2 px-4 py-1 bg-red-800 hover:bg-red-700 text-white text-sm rounded-md transition-colors duration-200"
          >
            {{ $t("retry") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <nav class="flex flex-wrap" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <router-link
                to="/"
                class="text-main-gray-hover hover:text-white transition-colors"
              >
                {{ $t("home") }}
              </router-link>
            </li>
            <li class="flex items-center">
              <svg
                class="h-4 w-4 text-main-gray-hover mx-1"
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
                class="text-main-gray-hover hover:text-white transition-colors"
              >
                {{ $t("collections") }}
              </router-link>
            </li>
            <li class="flex items-center">
              <svg
                class="h-4 w-4 text-main-gray-hover mx-1"
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
              <span
                class="text-main-gray-hover font-medium truncate max-w-[180px] md:max-w-none"
                >{{ product.name }}</span
              >
            </li>
          </ol>
        </nav>
      </div>

      <!-- Product Name (Centered) -->
      <h1
        class="text-3xl md:text-4xl font-medium uppercase font-display bg-gradient-to-b from-[#F1F1F1] to-[#818181] bg-clip-text text-transparent mb-6 text-center"
      >
        {{ product.name }}
      </h1>

      <!-- Product Content -->
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Image Gallery -->
        <div class="w-full md:w-1/2 space-y-4">
          <!-- Main Image with Light Background -->
          <div
            class="relative h-[300px] md:h-[400px] overflow-hidden cursor-pointer rounded-md"
            @click="openImageModal(currentImage)"
          >
            <!-- Background Effect -->
            <div class="absolute inset-0 overflow-hidden">
              <!-- Light gray shine/smoke effect -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-[50%] h-[50%] rounded-full bg-gray-200/20 blur-xl opacity-60"
                ></div>
                <div
                  class="absolute w-[40%] h-[40%] rounded-full bg-gray-100/30 blur-lg opacity-60"
                ></div>
                <div
                  class="absolute w-[20%] h-[20%] rounded-full bg-white/30 blur-md opacity-70"
                ></div>
              </div>

              <!-- Product Image -->
              <img
                :src="currentImage"
                :alt="product.name"
                class="w-full h-full object-contain relative z-10"
                @error="handleImageError"
              />
            </div>
          </div>

          <!-- Thumbnail Navigation - Only show if there are secondary images -->
          <div
            v-if="hasSecondaryImages"
            class="flex space-x-2 overflow-x-auto pb-2"
          >
            <button
              v-if="product.imageUrls && product.imageUrls.main"
              @click="setActiveImage(product.imageUrls.main)"
              class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none border-2 transition-all duration-200"
              :class="{
                'border-main-red': currentImage === product.imageUrls.main,
                'border-transparent': currentImage !== product.imageUrls.main,
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
              class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none border-2 transition-all duration-200"
              :class="{
                'border-main-red': currentImage === image,
                'border-transparent': currentImage !== image,
              }"
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
        <div class="w-full md:w-1/2 space-y-6">
          <div v-if="product.productNumber" class="mt-1">
            <span
              class="inline-block text-main-gray-hover text-sm rounded px-3 py-1 border border-main-red border-opacity-20"
              >#{{ product.productNumber }}</span
            >
          </div>

          <!-- Price -->
          <div class="flex items-center space-x-4">
            <div v-if="product.discount" class="flex flex-col">
              <p
                class="text-2xl font-medium bg-gradient-to-b from-main-red to-[#818181] bg-clip-text text-transparent"
              >
                {{ formatPrice(product.price[currency]) }}
              </p>
              <div class="flex items-center space-x-2">
                <p class="text-lg line-through text-main-gray-hover">
                  {{ formatPrice(product.discount.originalPrice[currency]) }}
                </p>
              </div>
            </div>
            <p
              v-else
              class="text-2xl font-medium bg-gradient-to-b from-[#F1F1F1] to-[#818181] bg-clip-text text-transparent"
            >
              {{ formatPrice(product.price[currency]) }}
            </p>
          </div>

          <div
            class="space-y-4 border-t border-b border-main-gray-hover border-opacity-20 py-6"
          >
            <div v-if="product.artist" class="flex gap-2">
              <span class="text-main-gray-hover text-sm"
                >{{ $t("artist") }}:</span
              >
              <span class="text-white/80 text-sm">{{ product.artist }}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-main-gray-hover text-sm"
                >{{ $t("size") }}:</span
              >
              <span class="text-white/80 text-sm">{{ product.size }}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-main-gray-hover text-sm"
                >{{ $t("material") }}:</span
              >
              <span class="text-white/80 text-sm">{{ product.material }}</span>
            </div>
            <div v-if="product.parts" class="flex gap-2">
              <span class="text-main-gray-hover text-sm"
                >{{ $t("parts") }}:</span
              >
              <span class="text-white/80 text-sm">{{ product.parts }}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-main-gray-hover text-sm"
                >{{ $t("boxArt") }}:</span
              >
              <span class="text-white/80 text-sm">{{ product.boxArt }}</span>
            </div>
          </div>

          <div v-if="product.description" class="space-y-3">
            <h3
              class="text-lg font-medium bg-gradient-to-b from-[#F1F1F1] to-[#818181] bg-clip-text text-transparent"
            >
              {{ $t("description") }}
            </h3>
            <p class="text-white/80 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Amount selector and Add to Cart Section -->
          <div class="mt-8 flex items-center gap-4">
            <div class="w-32" @click.stop>
              <AmountSelector v-model:amount="quantity" />
            </div>
            <div class="flex-1" @click.stop>
              <AddToCartButton :product="product" :quantity="quantity" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <Transition
      enter-active-class="transition-all ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showImageModal"
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        @click="closeImageModal"
      >
        <div class="relative max-w-4xl max-h-[90vh] p-2">
          <button
            @click.stop="closeImageModal"
            class="absolute top-4 right-4 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 transition-colors"
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

          <Transition
            enter-active-class="transition-all ease-out duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all ease-in duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <img
              :src="modalImage"
              :alt="product?.name || ''"
              class="max-w-full max-h-[80vh] object-contain mx-auto"
              @error="handleImageError"
              @click.stop
            />
          </Transition>

          <!-- Navigation buttons only if there are multiple images -->
          <div
            v-if="hasMultipleImages"
            class="absolute left-0 right-0 bottom-8 flex justify-center space-x-6"
          >
            <button
              @click.stop="navigateImages('prev')"
              class="text-white bg-black bg-opacity-60 rounded-full p-3 hover:bg-opacity-80 transition-colors"
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
              @click.stop="navigateImages('next')"
              class="text-white bg-black bg-opacity-60 rounded-full p-3 hover:bg-opacity-80 transition-colors"
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
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { useAuthStore } from "@/stores/authStore";

import { getProductBySlug } from "@/services/productService";

import AddToCartButton from "@/components/general/AddToCartButton.vue";
import AmountSelector from "@/components/general/AmountSelector.vue";

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
const quantity = ref<number>(1);

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
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleEscapeKey);
};

const closeImageModal = (): void => {
  showImageModal.value = false;
  document.body.style.overflow = "";
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
  document.body.style.overflow = "";
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
