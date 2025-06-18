<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Loading State -->
    <Loader v-if="loading" :text="$t('loading')" />

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
            @click="fetchCategories"
            class="mt-2 px-4 py-1 bg-red-800 hover:bg-red-700 text-white text-sm rounded-md transition-colors duration-200"
          >
            {{ $t("retry") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="categories.length === 0"
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
        {{ $t("noCollections") }}
      </h3>
      <p class="mt-1 text-sm text-main-gray-hover">
        {{ $t("underConstruction") }}
      </p>
    </div>

    <!-- Categories Grid -->
    <transition-group
      tag="div"
      class="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8 space-y-8 sm:space-y-0"
      v-else
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-8"
      move-class="transition-transform duration-500 ease-out"
    >
      <div
        v-for="(category, index) in categories"
        :key="category._id"
        class="group cursor-pointer transition-transform duration-300 ease-in-out sm:flex sm:justify-center"
        :style="{ 'transition-delay': getAnimationDelay(index) }"
        @click="goToCategory(category)"
      >
        <div
          class="relative w-full mx-auto max-w-[300px] sm:max-w-[250px] lg:max-w-[300px] flex flex-col items-center"
        >
          <!-- Category Frame with Background and Stars -->
          <div
            class="relative w-full sm:w-[250px] lg:w-[300px] aspect-[300/401] overflow-hidden mb-2.5"
          >
            <!-- Background Image -->
            <div class="absolute inset-0 overflow-hidden">
              <!-- Light gray shine/smoke effect with smoother transition -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-[70%] h-[70%] rounded-full bg-gray-200/20 blur-xl opacity-60 transition-opacity duration-600 group-hover:bg-red-900/40 group-hover:opacity-95"
                ></div>
                <div
                  class="absolute w-[50%] h-[50%] rounded-full bg-gray-100/30 blur-lg opacity-60 transition-opacity duration-600 group-hover:bg-red-800/50 group-hover:opacity-90"
                ></div>
                <div
                  class="absolute w-[30%] h-[30%] rounded-full bg-white/30 blur-md opacity-70 transition-opacity duration-600 group-hover:bg-red-700/60 group-hover:opacity-95"
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
            class="text-2xl font-medium text-center uppercase font-display bg-gradient-to-b from-[#F1F1F1] to-[#818181] bg-clip-text text-transparent transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-main-red group-hover:to-red-700"
          >
            {{ category.name }}
          </h2>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Loader from "@/components/general/Loader.vue";

import type { Category } from "@/types/category";

import { getAllCategories } from "@/services/categoryService";

// Composables Setup
const { t } = useI18n();
const router = useRouter();

// State Management
const categories = ref<Category[]>([]);
const loading = ref<boolean>(true);
const error = ref<string>("");

// Helper function to calculate animation delay based on index
const getAnimationDelay = (index: number): string => {
  return `${index * 100}ms`;
};

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

  if (category.slug) {
    router.push(`/${category.slug}`);
  } else {
    console.error(`Category "${category.name}" doesn't have a slug.`);

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
