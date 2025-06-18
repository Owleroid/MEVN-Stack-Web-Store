<template>
  <div class="px-4 py-8 md:py-10 max-w-7xl mx-auto">
    <!-- Initial Page Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="w-14 h-14 border-4 border-white border-opacity-20 border-t-main-red rounded-full animate-spin"
      ></div>
      <span class="ml-3 text-sm text-main-gray-hover">{{
        $t("loadingCategories")
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
            @click="retryFetch"
            class="mt-2 px-4 py-1 bg-red-800 hover:bg-red-700 text-white text-sm rounded-md transition-colors duration-200"
          >
            {{ $t("retry") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col md:flex-row gap-4 md:gap-6">
      <!-- Mobile Category Toggle Button -->
      <div class="flex justify-between items-center md:hidden mb-0">
        <div
          @click="toggleMobileCategories($event)"
          class="flex items-center w-full pb-3 cursor-pointer relative border-b-2 border-main-red border-opacity-40"
          :class="{ 'border-opacity-100': isMobileCategoriesOpen }"
        >
          <div
            class="absolute left-0 h-12 w-8 flex flex-col justify-center items-center space-y-1.5"
            :class="{
              'text-main-red': isMobileCategoriesOpen,
              'text-main-gray-hover': !isMobileCategoriesOpen,
            }"
          >
            <span
              class="block w-full h-0.5 bg-current transition-all duration-300"
              :class="{ 'rotate-45 translate-y-2': isMobileCategoriesOpen }"
            ></span>
            <span
              class="block w-full h-0.5 bg-current transition-all duration-300"
              :class="{ 'opacity-0': isMobileCategoriesOpen }"
            ></span>
            <span
              class="block w-full h-0.5 bg-current transition-all duration-300"
              :class="{ '-rotate-45 -translate-y-2': isMobileCategoriesOpen }"
            ></span>
          </div>
          <div class="flex-1 text-center">
            <h2 class="text-2xl font-semibold text-main-red px-8">
              {{ category ? category.name : $t("collections") }}
            </h2>
          </div>
        </div>
      </div>

      <!-- Mobile Categories Overlay (Full Screen) -->
      <Transition
        enter-active-class="transition-all ease-out duration-500"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all ease-in duration-500"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isMobileCategoriesOpen"
          class="fixed inset-0 bg-gradient-to-r from-[#191919] to-[#0E0E0E] z-40 md:hidden"
          @click.prevent="closeMobileCategories($event)"
        ></div>
      </Transition>

      <!-- Categories Sidebar - Desktop and Mobile -->
      <Transition
        enter-active-class="transition-all ease-out duration-500"
        enter-from-class="transform -translate-x-full"
        enter-to-class="transform translate-x-0"
        leave-active-class="transition-all ease-in duration-500"
        leave-from-class="transform translate-x-0"
        leave-to-class="transform -translate-x-full"
      >
        <div
          v-if="!isMobile || isMobileCategoriesOpen"
          :class="[
            'overflow-y-auto z-50',
            isMobile
              ? 'fixed inset-0 w-full max-w-full bg-gradient-to-r from-[#191919] to-[#0E0E0E] flex flex-col'
              : 'w-64 sticky top-4 self-start ',
          ]"
        >
          <!-- Categories List Container -->
          <div :class="[isMobile ? 'p-4 flex-1 flex flex-col' : 'p-4']">
            <!-- Mobile Header with Close Button -->
            <div v-if="isMobile" class="flex justify-end items-center mb-6">
              <button
                @click="toggleMobileCategories($event)"
                class="text-main-red p-2"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Categories Content -->
            <div
              :class="[
                isMobile ? 'flex-1 flex justify-center items-center -mt-8' : '',
              ]"
            >
              <div :class="[isMobile ? 'w-full max-w-md' : 'w-full']">
                <div :class="[isMobile ? 'space-y-6' : 'space-y-0']">
                  <div
                    v-for="cat in categories"
                    :key="cat._id"
                    @click.stop="changeCategory(cat, $event)"
                    class="cursor-pointer transition-all duration-200 relative group"
                    :class="[isMobile ? 'p-4 text-center' : 'py-3 px-4']"
                  >
                    <!-- Background gradient for active/hover states - positioned behind the content (PC only) -->
                    <div
                      v-if="!isMobile"
                      class="absolute inset-0 z-0 transition-opacity duration-200"
                      :class="[
                        cat._id === category?._id
                          ? 'bg-gradient-to-b from-[#BA0913] to-[#530109] opacity-100'
                          : 'bg-gradient-to-b from-[#BA0913] to-[#530109] opacity-0 group-hover:opacity-100',
                      ]"
                    ></div>

                    <!-- Mobile background -->
                    <div
                      v-if="isMobile && cat._id === category?._id"
                      class="absolute inset-0 bg-gradient-to-r from-[#BA0913] to-[#530109] shadow-lg"
                    ></div>

                    <!-- PC layout with arrow -->
                    <div
                      v-if="!isMobile"
                      class="flex items-center justify-between w-full relative z-10"
                    >
                      <span
                        :class="[
                          'font-medium uppercase transition-colors duration-200 text-sm',
                          cat._id === category?._id
                            ? 'text-white'
                            : 'text-main-gray-hover group-hover:text-white',
                        ]"
                      >
                        {{ cat.name }}
                      </span>

                      <!-- Right arrow (PC only) -->
                      <svg
                        width="9"
                        height="15"
                        viewBox="0 0 9 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        :class="[
                          'transition-opacity duration-200',
                          cat._id === category?._id
                            ? 'opacity-100'
                            : 'opacity-50 group-hover:opacity-100',
                        ]"
                      >
                        <path
                          d="M1.28711 0.787109L8.00024 7.50024L1.28711 14.2134"
                          stroke="url(#paint0_linear_884_456)"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_884_456"
                            x1="7.77967"
                            y1="7.27967"
                            x2="-4.9757"
                            y2="9.22113"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="white" />
                            <stop
                              offset="1"
                              stop-color="white"
                              stop-opacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <!-- Mobile/tablet layout (original style) -->
                    <span
                      v-if="isMobile"
                      class="relative z-10 text-xl font-medium uppercase transition-colors duration-200"
                      :class="[
                        cat._id === category?._id
                          ? 'text-white'
                          : 'text-main-gray-hover',
                      ]"
                    >
                      {{ cat.name }}
                    </span>

                    <!-- Bottom border line -->
                    <div
                      v-if="!isMobile"
                      class="absolute bottom-0 left-0 right-0 h-[2px] z-20 bg-gradient-to-r from-transparent to-gray-500 transition-opacity duration-200"
                      :class="[
                        cat._id === category?._id
                          ? ''
                          : 'group-hover:opacity-0',
                      ]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Products Section -->
      <div class="flex-1 md:pl-8">
        <!-- Empty State -->
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-300"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div
            v-if="!loadingProducts && products.length === 0"
            class="border border-main-gray border-opacity-20 p-8 text-center"
          >
            <svg
              class="mx-auto h-12 w-12 text-main-red"
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
            <h3 class="mt-2 text-sm font-medium text-white">
              {{ $t("noProductsForCategory") }}
            </h3>
            <p class="mt-1 text-sm text-main-gray-hover">
              {{ $t("checkBackLater") }}
            </p>
          </div>
        </transition>

        <!-- Products Loading State -->
        <div
          v-if="loadingProducts && products.length === 0"
          class="flex justify-center items-center py-12"
        >
          <div
            class="w-12 h-12 border-4 border-white border-opacity-20 border-t-main-red rounded-full animate-spin"
          ></div>
          <span class="ml-3 text-sm text-main-gray-hover">{{
            $t("loadingProducts")
          }}</span>
        </div>

        <!-- Products Grid with Transition Wrapper -->
        <transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <!-- Dynamic content with a different key for each category -->
          <div
            v-if="products.length > 0 && !loadingProducts"
            :key="`products-for-${category?._id}`"
            class="flex flex-col space-y-8 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 md:gap-8"
          >
            <div
              v-for="(product, index) in products"
              :key="product._id"
              class="group cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 sm:flex sm:justify-center"
              :style="{
                'transition-delay': `${isMobile ? index * 50 : index * 100}ms`,
              }"
              @click="goToProduct(product)"
            >
              <div
                class="relative w-full mx-auto max-w-[350px] sm:max-w-[95%] flex flex-col"
              >
                <!-- Product Name -->
                <h2
                  class="text-3xl font-medium uppercase font-display bg-gradient-to-b from-[#F1F1F1] to-[#818181] bg-clip-text text-transparent mb-4 text-center line-clamp-2"
                  :title="product.name"
                >
                  {{ isTablet ? truncateText(product.name, 21) : product.name }}
                </h2>

                <!-- Product Info Section -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <!-- Left side: Product Image with Light Background -->
                  <div class="relative h-[250px] overflow-hidden">
                    <!-- Background Effect -->
                    <div class="absolute inset-0 overflow-hidden">
                      <!-- Light gray shine/smoke effect -->
                      <div
                        class="absolute inset-0 flex items-center justify-center"
                      >
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
                        :src="product.imageUrls?.main"
                        :alt="product.name"
                        class="w-full h-full object-contain relative z-10"
                        loading="lazy"
                        @error="handleProductImageError"
                      />
                    </div>
                  </div>

                  <!-- Right side: Product Info -->
                  <div class="flex flex-col gap-2">
                    <!-- Price -->
                    <div v-if="product.discount" class="mb-2">
                      <p class="text-2xl font-medium text-main-red">
                        {{ formatPrice(product.price?.[currency] ?? 0) }}
                      </p>
                      <p class="text-sm line-through text-main-gray-hover">
                        {{
                          formatPrice(
                            product.discount.originalPrice?.[currency] ?? 0
                          )
                        }}
                      </p>
                    </div>
                    <p
                      v-else
                      class="text-2xl font-medium bg-gradient-to-b from-[#F1F1F1] to-[#818181] bg-clip-text text-transparent mb-2"
                    >
                      {{ formatPrice(product.price?.[currency] ?? 0) }}
                    </p>

                    <!-- Product Number -->
                    <div class="flex gap-2">
                      <span class="text-main-gray-hover text-sm"
                        >{{ $t("productNumber") }}:</span
                      >
                      <span class="text-white/80 text-sm uppercase">{{
                        product.productNumber
                      }}</span>
                    </div>

                    <!-- Artist Name -->
                    <div v-if="product.artist" class="flex gap-2">
                      <span class="text-main-gray-hover text-sm"
                        >{{ $t("artist") }}:</span
                      >
                      <span class="text-white/80 text-sm">{{
                        product.artist
                      }}</span>
                    </div>

                    <!-- Product Size -->
                    <div v-if="product.size" class="flex gap-2">
                      <span class="text-main-gray-hover text-sm"
                        >{{ $t("size") }}:</span
                      >
                      <span class="text-white/80 text-sm">{{
                        product.size
                      }}</span>
                    </div>

                    <!-- Product Material -->
                    <div v-if="product.material" class="flex gap-2">
                      <span class="text-main-gray-hover text-sm"
                        >{{ $t("material") }}:</span
                      >
                      <span class="text-white/80 text-sm">{{
                        product.material
                      }}</span>
                    </div>

                    <!-- Product Box Art -->
                    <div v-if="product.boxArt" class="flex gap-2">
                      <span class="text-main-gray-hover text-sm"
                        >{{ $t("boxArt") }}:</span
                      >
                      <span class="text-white/80 text-sm">{{
                        product.boxArt
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Amount selector and Add to Cart Section -->
                <div class="mt-2 flex items-center justify-center gap-4">
                  <div class="w-32" @click.stop>
                    <AmountSelector
                      v-model:amount="productQuantities[product._id]"
                    />
                  </div>
                  <div class="w-auto" @click.stop>
                    <AddToCartButton
                      :product="product"
                      :quantity="productQuantities[product._id]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { useAuthStore } from "@/stores/authStore";

import { getProductsByCategoryId } from "@/services/productService";

import {
  getAllCategories,
  getCategoryBySlug,
} from "@/services/categoryService";

import AddToCartButton from "@/components/general/AddToCartButton.vue";
import AmountSelector from "@/components/general/AmountSelector.vue";

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
const isMobileCategoriesOpen = ref<boolean>(false);
const windowWidth = ref(window.innerWidth);
const productQuantities = reactive<Record<string, number>>({});

// Computed properties
const isMobile = computed(() => windowWidth.value < 768);
const isTablet = computed(
  () => windowWidth.value >= 640 && windowWidth.value < 1024
);

// Watch for window resize
onMounted(() => {
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});

// Watch for window size changes to handle category sidebar
watch(isMobile, (newIsMobile) => {
  if (!newIsMobile && isMobileCategoriesOpen.value) {
    isMobileCategoriesOpen.value = false;
  }
});

// Get user's preferred currency
const currency = authStore.currency as "rubles" | "euros";

// Utilities
const formatPrice = (price: number): string => {
  if (currency === "rubles") {
    return `${price.toFixed(2)} ₽`;
  } else {
    return `${price.toFixed(2)} €`;
  }
};

const toggleMobileCategories = (event?: Event): void => {
  if (event) {
    event.stopPropagation();
  }

  isMobileCategoriesOpen.value = !isMobileCategoriesOpen.value;

  if (isMobileCategoriesOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeMobileCategories = (event?: Event): void => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  isMobileCategoriesOpen.value = false;
  document.body.style.overflow = "";
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
  const loadingDelay = isMobile ? 100 : 200;
  const loadingTimer = setTimeout(() => {
    loadingProducts.value = true;
  }, loadingDelay);

  try {
    error.value = "";

    const response = await getProductsByCategoryId(categoryId);

    products.value = response.products;

    products.value.forEach((product) => {
      if (!productQuantities[product._id]) {
        productQuantities[product._id] = 1;
      }
    });
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
    clearTimeout(loadingTimer);
    loadingProducts.value = false;
  }
};

const fetchCategoryData = async (): Promise<void> => {
  if (categories.value.length === 0) {
    loading.value = true;
  }

  const slug = route.params.slug as string;

  if (!slug) {
    error.value = t("noCategorySelected");
    loading.value = false;
    return;
  }

  try {
    error.value = "";

    const response = await getCategoryBySlug(slug);
    category.value = response.category;

    if (!category.value) {
      error.value = t("categoryNotFound");
    } else {
      await fetchProducts(category.value._id);

      if (isMobile.value) {
        closeMobileCategories();
      }
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
const changeCategory = (cat: Category, event?: Event): void => {
  if (!cat || !cat.slug) return;

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  error.value = "";

  if (isMobile.value) {
    closeMobileCategories();
  }

  router.push(`/${cat.slug}`);
};

// Retry functionality
const retryFetch = async (): Promise<void> => {
  error.value = "";
  loading.value = true;
  await fetchCategories();
  await fetchCategoryData();
};

// Navigation to product detail page
const goToProduct = (product: Product): void => {
  if (!product || !product.slug || !category?.value?.slug) return;
  router.push(`/${category.value.slug}/${product.slug}`);
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

// Helper functions
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  let truncateIndex = maxLength;
  while (
    truncateIndex > 0 &&
    text[truncateIndex] !== " " &&
    text[truncateIndex - 1] !== " "
  ) {
    truncateIndex--;
  }

  if (truncateIndex <= maxLength / 2) {
    truncateIndex = maxLength;
  }

  return text.substring(0, truncateIndex).trim() + "...";
};
</script>

<style scoped>
:deep(body.no-scroll) {
  overflow: hidden;
}
</style>
