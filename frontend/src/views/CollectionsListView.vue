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

    <!-- Categories Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
      <div
        v-for="category in categories"
        :key="category._id"
        class="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        @click="goToCategory(category._id ?? '')"
      >
        <!-- Category Image -->
        <div class="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-200">
          <img
            :src="category.imageUrl"
            :alt="category.name"
            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <!-- Category Name -->
        <div class="p-6">
          <h2
            class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
          >
            {{ category.name }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import type { Category } from "@/types/category";

import { getAllCategories } from "@/services/storeService";

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
    categories.value = response;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    error.value = t("fetchCategoriesError") + ": " + errorMessage;
    console.error("Error fetching categories:", err);
  } finally {
    loading.value = false;
  }
};

// Navigation Actions
const goToCategory = (categoryId: string): void => {
  if (!categoryId) return;
  router.push(`/collections/${categoryId}`);
};

// Lifecycle Hooks
onMounted(() => {
  fetchCategories();
});
</script>
