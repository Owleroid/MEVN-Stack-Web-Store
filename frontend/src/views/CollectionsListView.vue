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
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="categories.length === 0" class="text-center py-16">
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
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">
        {{ $t("noCollections") }}
      </h3>
      <p class="mt-1 text-sm text-gray-500">{{ $t("underConstruction") }}</p>
    </div>

    <!-- Categories Grid (Mobile-first, one collection per row) -->
    <transition-group
      name="fade-list"
      tag="div"
      class="flex flex-col space-y-8"
      v-else
    >
      <div
        v-for="(category, index) in categories"
        :key="category._id"
        class="group cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-1"
        :style="{ '--i': index }"
        @click="goToCategory(category)"
      >
        <div
          class="relative w-full mx-auto max-w-[300px] flex flex-col items-center"
        >
          <!-- Category Frame with Background and Stars -->
          <div class="relative w-[300px] h-[401px] overflow-hidden mb-2.5">
            <!-- Background Image -->
            <div class="absolute inset-0 overflow-hidden">
              <!-- Light gray shine/smoke effect with smoother transition -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-[70%] h-[70%] rounded-full bg-gray-200/20 blur-xl opacity-60"
                ></div>
                <div
                  class="absolute w-[50%] h-[50%] rounded-full bg-gray-100/30 blur-lg opacity-60"
                ></div>
                <div
                  class="absolute w-[30%] h-[30%] rounded-full bg-white/30 blur-md opacity-70"
                ></div>
              </div>

              <img
                :src="category.imageUrl"
                :alt="category.name"
                class="w-full h-full object-cover relative z-10"
                loading="lazy"
              />
            </div>

            <!-- Stars Overlay -->
            <div class="absolute inset-0">
              <img
                src="@/assets/icons/star1.svg"
                class="absolute"
                style="top: 41px; left: 69px; width: 19px; height: 28px"
              />
              <img
                src="@/assets/icons/star2.svg"
                class="absolute"
                style="top: 62px; left: 46px; width: 19px; height: 30px"
              />
              <img
                src="@/assets/icons/star3.svg"
                class="absolute"
                style="top: 34px; left: 46px; width: 11px; height: 16px"
              />
              <img
                src="@/assets/icons/star5.svg"
                class="absolute"
                style="top: 331px; left: 246px; width: 28px; height: 40px"
              />
              <img
                src="@/assets/icons/star4.svg"
                class="absolute"
                style="bottom: 20px; right: 20px; width: 16px; height: 23px"
              />
            </div>
          </div>

          <!-- Category Name -->
          <h2
            class="text-2xl font-medium text-center uppercase font-display bg-gradient-to-b from-[#F1F1F1] to-[#818181] bg-clip-text text-transparent"
          >
            {{ category.name }}
          </h2>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import type { Category } from "@/types/category";

import { getAllCategories } from "@/services/categoryService";

// Composables Setup
const { t } = useI18n();
const router = useRouter();

// State Management
const categories = ref<Category[]>([]);
const loading = ref<boolean>(true);
const error = ref<string>("");

// Data Fetching
const fetchCategories = async (): Promise<void> => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAllCategories();
    categories.value = response.categories;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    error.value = t("fetchCategoriesError") + ": " + errorMessage;
    console.error("Error fetching categories:", err);
  } finally {
    loading.value = false;
  }
};

// Navigation Actions
const goToCategory = (category: Category): void => {
  if (!category) return;

  // Use slug for category navigation
  if (category.slug) {
    router.push(`/${category.slug}`);
  } else {
    // Handle rare case where a category doesn't have a slug
    console.error(`Category "${category.name}" doesn't have a slug.`);

    // Show error to user or generate a temporary slug from the name
    const tempSlug = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    router.push(`/${tempSlug}`);
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
/* Transition styles for transition-group - these can't be done with Tailwind alone */
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.5s ease;
}

.fade-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Staggered entry effect - requires CSS custom property */
.fade-list-enter-active {
  transition-delay: calc(var(--i) * 0.1s);
}
</style>
