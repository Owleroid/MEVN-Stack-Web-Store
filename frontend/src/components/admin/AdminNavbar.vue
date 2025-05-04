<template>
  <nav
    v-if="!translationsLoading"
    class="bg-gray-800 text-white px-4 py-3 shadow-md"
  >
    <div
      class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center"
    >
      <!-- Admin Navigation Links -->
      <ul class="flex flex-wrap gap-2 sm:gap-6 mb-4 sm:mb-0 justify-center">
        <li>
          <router-link
            to="/admin/categories"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
            active-class="bg-gray-900 text-white"
          >
            {{ $t("categories") }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/products"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
            active-class="bg-gray-900 text-white"
          >
            {{ $t("products") }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/warehouse"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
            active-class="bg-gray-900 text-white"
          >
            {{ $t("warehouse") }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/orders"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
            active-class="bg-gray-900 text-white"
          >
            {{ $t("orders") }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/image-manager"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
            active-class="bg-gray-900 text-white"
          >
            {{ $t("imageManager") }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/clients"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
            active-class="bg-gray-900 text-white"
          >
            {{ $t("clients") }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/support"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
            active-class="bg-gray-900 text-white"
          >
            {{ $t("supportMessages") }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/news"
            class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
            active-class="bg-gray-900 text-white"
          >
            {{ $t("news") }}
          </router-link>
        </li>
      </ul>

      <!-- Return to Home Link -->
      <div class="flex justify-end">
        <router-link
          to="/"
          class="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          {{ $t("home") }}
        </router-link>
      </div>
    </div>
  </nav>

  <!-- Loading state -->
  <div v-else class="bg-gray-800 text-white p-4 text-center">
    <span class="inline-block animate-pulse">Loading translations...</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { translationsLoaded } from "@/i18n";

// ==============================
// State Management
// ==============================

/**
 * Computed property to check if translations are still loading
 */
const translationsLoading = computed(() => !translationsLoaded.value);
</script>
