<template>
  <nav
    v-if="!translationsLoading"
    class="bg-gray-800 text-white px-4 py-3 shadow-md"
  >
    <div
      class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center"
    >
      <!-- Main Navigation Links -->
      <div class="flex space-x-6 mb-4 sm:mb-0 items-center">
        <router-link
          to="/"
          class="text-white hover:text-gray-200 transition-colors"
        >
          {{ $t("mainPage") }}
        </router-link>
        <router-link
          to="/collections"
          class="text-white hover:text-gray-200 transition-colors"
        >
          {{ $t("collections") }}
        </router-link>
        <router-link
          to="/news"
          class="text-white hover:text-gray-200 transition-colors"
        >
          {{ $t("news") }}
        </router-link>
        <router-link
          to="/about"
          class="text-white hover:text-gray-200 transition-colors"
        >
          {{ $t("about") }}
        </router-link>
        <router-link
          to="/contact"
          class="text-white hover:text-gray-200 transition-colors"
        >
          {{ $t("contact") }}
        </router-link>
      </div>

      <!-- Right Side Navigation -->
      <div class="flex items-center space-x-6">
        <!-- Language Switcher -->
        <button
          @click="toggleLanguage"
          class="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
        >
          {{ currentLanguage }}
        </button>

        <!-- Cart Icon with Badge -->
        <div class="relative group">
          <router-link
            to="/cart"
            class="text-white hover:text-gray-200 transition-colors"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <!-- Cart Badge -->
            <span
              v-if="cartItemsCount > 0"
              class="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
            >
              {{ cartItemsCount }}
            </span>
          </router-link>

          <!-- Transparent bridge for cart dropdown -->
          <div class="absolute w-full h-2 top-full left-0 bg-transparent"></div>

          <!-- Cart Hover Panel -->
          <div
            v-if="!isCartPage && cartItemsCount > 0"
            class="hidden group-hover:block absolute right-0 mt-0 w-80 bg-white rounded-md shadow-lg z-50 cart-hover-panel"
          >
            <CartHoover />
          </div>
        </div>

        <!-- User Management Links -->
        <div
          v-if="!authStore.isAuthenticated"
          class="flex items-center space-x-4"
        >
          <router-link
            to="/login"
            class="text-white hover:text-gray-200 transition-colors"
          >
            {{ $t("login") }}
          </router-link>
          <router-link
            to="/signup"
            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {{ $t("signup") }}
          </router-link>
        </div>

        <!-- User Dropdown -->
        <div v-if="authStore.isAuthenticated" class="relative group">
          <button
            class="flex items-center space-x-1 hover:text-gray-200 focus:outline-none"
          >
            <span class="hidden md:inline">{{ authStore.userEmail }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Transparent bridge for user dropdown -->
          <div class="absolute w-full h-2 top-full left-0 bg-transparent"></div>

          <div
            class="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50"
          >
            <router-link
              to="/settings"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {{ $t("settings") }}
            </router-link>
            <router-link
              to="/orders"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {{ $t("orders") }}
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {{ $t("adminPanel") }}
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {{ $t("logout") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Loading State -->
  <div v-else class="bg-gray-800 text-white p-4 text-center">
    <div
      class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"
    ></div>
    <span>{{ $t("loadingTranslations") }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import i18n from "@/i18n";
import { translationsLoaded, loadLocaleMessages } from "@/i18n";

import CartHoover from "./CartHoover.vue";

import { useAuthStore } from "@/stores/authStore";

import { getCartItemsCount } from "@/services/cartService";

import { useEventBus } from "@/utils/eventBus";

// Composables Setup
const authStore = useAuthStore();
const route = useRoute();
const { locale } = useI18n();
const { on } = useEventBus();

// State Management
const cartItemsCount = ref<number>(0);

// Computed Properties
const isCartPage = computed<boolean>(
  () => route.path === "/cart" || route.path === "/checkout"
);
const currentLanguage = computed<string>(() =>
  locale.value === "en" ? "EN" : "RU"
);
const translationsLoading = computed<boolean>(() => !translationsLoaded.value);

// Language Management
const toggleLanguage = async (): Promise<void> => {
  const newLanguage = locale.value === "en" ? "ru" : "en";

  // Update locale
  locale.value = newLanguage;
  sessionStorage.setItem("language", newLanguage);

  // Update i18n
  const messages = await loadLocaleMessages(newLanguage);
  i18n.global.setLocaleMessage(newLanguage, messages);
};

// Authentication Management
const handleLogout = async (): Promise<void> => {
  try {
    await authStore.logout();
    updateCartCount(); // Refresh cart count after logout
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Cart Management
const updateCartCount = (): void => {
  cartItemsCount.value = getCartItemsCount();
};

// Lifecycle Hooks
onMounted(() => {
  updateCartCount();
  on("cart-updated", updateCartCount);
});
</script>
