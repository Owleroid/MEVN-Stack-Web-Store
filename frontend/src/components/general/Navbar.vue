<template>
  <nav v-if="!translationsLoading" class="px-4 py-3 shadow-md">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <!-- Logo -->
      <router-link to="/" class="text-2xl"> IRBIS </router-link>

      <!-- Mobile Navigation -->
      <div class="flex items-center space-x-5">
        <!-- Cart Icon with Badge -->
        <div class="relative group">
          <router-link
            to="/cart"
            class="transition-colors duration-500 ease-in-out"
            :class="{
              'text-main-red': cartItemsCount > 0 && isMobile,
              'text-main-gray-hover': !(cartItemsCount > 0 && isMobile),
            }"
          >
            <svg
              width="17"
              height="14"
              viewBox="0 0 17 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.3424 1.55535L16.8242 1.55535L16.8242 0.5L13.6637 0.5L12.5597 2.92177L0.799732 2.92177L2.59554 10.19L11.2535 10.19L13.3916 3.64137L14.3424 1.55535ZM12.1718 3.97712L10.4879 9.13469L3.42188 9.13469L2.14757 3.97712L12.1718 3.97712Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.59108 11.102C4.19368 11.102 3.87152 11.4241 3.87152 11.8215C3.87152 12.2189 4.19368 12.5411 4.59108 12.5411C4.98848 12.5411 5.31064 12.2189 5.31064 11.8215C5.31064 11.4241 4.98848 11.102 4.59108 11.102ZM2.91211 11.8215C2.91211 10.8943 3.66381 10.1426 4.59108 10.1426C5.51835 10.1426 6.27005 10.8943 6.27005 11.8215C6.27005 12.7488 5.51835 13.5005 4.59108 13.5005C3.66381 13.5005 2.91211 12.7488 2.91211 11.8215Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.38795 11.102C8.99055 11.102 8.66839 11.4241 8.66839 11.8215C8.66839 12.2189 8.99055 12.5411 9.38795 12.5411C9.78535 12.5411 10.1075 12.2189 10.1075 11.8215C10.1075 11.4241 9.78535 11.102 9.38795 11.102ZM7.70898 11.8215C7.70898 10.8943 8.46068 10.1426 9.38795 10.1426C10.3152 10.1426 11.0669 10.8943 11.0669 11.8215C11.0669 12.7488 10.3152 13.5005 9.38795 13.5005C8.46068 13.5005 7.70898 12.7488 7.70898 11.8215Z"
                fill="currentColor"
              />
            </svg>
            <!-- Cart Badge - Only visible on non-mobile devices -->
            <span
              v-if="cartItemsCount > 0 && !isMobile"
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

        <!-- Language Switcher -->
        <button
          @click="toggleLanguage"
          class="px-2 py-1 rounded-[28px] text-main-red text-sm font-normal transition-colors duration-500 ease-in-out"
        >
          {{ currentLanguage }}
        </button>

        <!-- Hamburger Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="flex flex-col justify-center items-center w-6 h-10 p-1 space-y-1 transition-colors duration-500 ease-in-out"
          :class="{
            'text-main-red': mobileMenuOpen,
            'text-main-gray': !mobileMenuOpen,
          }"
        >
          <span class="block w-full h-0.5 bg-current"></span>
          <span class="block w-full h-0.5 bg-current"></span>
          <span class="block w-full h-0.5 bg-current"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-x-full opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed top-16 right-0 z-50 shadow-lg bg-gradient-to-l from-[#191919] to-[#0E0E0E] rounded-l-md w-auto min-w-[200px] h-[calc(100vh-56px)] overflow-y-auto"
      >
        <div class="flex flex-col p-4 space-y-4 items-center text-center">
          <!-- Main Navigation Links -->
          <router-link
            to="/"
            class="text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
            :class="{ 'text-main-red': route.path === '/' }"
            @click="closeMobileMenu"
          >
            {{ $t("mainPage") }}
          </router-link>
          <router-link
            to="/collections"
            class="text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
            :class="{ 'text-main-red': route.path.startsWith('/collections') }"
            @click="closeMobileMenu"
          >
            {{ $t("collections") }}
          </router-link>
          <router-link
            to="/news"
            class="text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
            :class="{ 'text-main-red': route.path.startsWith('/news') }"
            @click="closeMobileMenu"
          >
            {{ $t("news") }}
          </router-link>
          <router-link
            to="/about"
            class="text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
            :class="{ 'text-main-red': route.path === '/about' }"
            @click="closeMobileMenu"
          >
            {{ $t("about") }}
          </router-link>
          <router-link
            to="/contact"
            class="text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
            :class="{ 'text-main-red': route.path === '/contact' }"
            @click="closeMobileMenu"
          >
            {{ $t("contact") }}
          </router-link>

          <!-- User Management Links -->
          <div
            v-if="!authStore.isAuthenticated"
            class="pt-2 border-t border-main-red"
          >
            <router-link
              to="/login"
              class="block py-2 text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
              :class="{ 'text-main-red': route.path === '/login' }"
              @click="closeMobileMenu"
            >
              {{ $t("login") }}
            </router-link>
            <router-link
              to="/signup"
              class="block py-2 text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
              :class="{ 'text-main-red': route.path === '/signup' }"
              @click="closeMobileMenu"
            >
              {{ $t("signup") }}
            </router-link>
          </div>

          <!-- User Options when logged in -->
          <div
            v-if="authStore.isAuthenticated"
            class="pt-2 border-t border-gray-700"
          >
            <p class="text-gray-400">{{ authStore.userEmail }}</p>
            <router-link
              to="/settings"
              class="block py-2 text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
              :class="{ 'text-main-red': route.path === '/settings' }"
              @click="closeMobileMenu"
            >
              {{ $t("settings") }}
            </router-link>
            <router-link
              to="/orders"
              class="block py-2 text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
              :class="{ 'text-main-red': route.path.startsWith('/orders') }"
              @click="closeMobileMenu"
            >
              {{ $t("orders") }}
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="block py-2 text-main-gray-hover transition-colors whitespace-nowrap duration-500 ease-in-out"
              :class="{ 'text-main-red': route.path.startsWith('/admin') }"
              @click="closeMobileMenu"
            >
              {{ $t("adminPanel") }}
            </router-link>
            <button
              @click="handleLogoutAndCloseMobileMenu"
              class="block w-full text-left py-2 text-main-gray-hover hover:text-main-red transition-colors whitespace-nowrap duration-500 ease-in-out"
            >
              {{ $t("logout") }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Desktop Navigation - Hidden on Mobile, Visible on Medium Screens and Up -->
    <div
      class="hidden md:flex md:flex-row md:justify-between md:items-center md:mt-4"
    >
      <!-- Main Navigation Links -->
      <div class="flex space-x-6 items-center">
        <router-link
          to="/"
          class="text-main-gray-hover transition-colors duration-500 ease-in-out"
          :class="{ 'text-main-red': route.path === '/' }"
        >
          {{ $t("mainPage") }}
        </router-link>
        <router-link
          to="/collections"
          class="text-main-gray-hover transition-colors duration-500 ease-in-out"
          :class="{ 'text-main-red': route.path.startsWith('/collections') }"
        >
          {{ $t("collections") }}
        </router-link>
        <router-link
          to="/news"
          class="text-main-gray-hover transition-colors duration-500 ease-in-out"
          :class="{ 'text-main-red': route.path.startsWith('/news') }"
        >
          {{ $t("news") }}
        </router-link>
        <router-link
          to="/about"
          class="text-main-gray-hover transition-colors duration-500 ease-in-out"
          :class="{ 'text-main-red': route.path === '/about' }"
        >
          {{ $t("about") }}
        </router-link>
        <router-link
          to="/contact"
          class="text-main-gray-hover transition-colors duration-500 ease-in-out"
          :class="{ 'text-main-red': route.path === '/contact' }"
        >
          {{ $t("contact") }}
        </router-link>
      </div>

      <!-- User Management Links for Desktop -->
      <div
        v-if="!authStore.isAuthenticated"
        class="flex items-center space-x-4"
      >
        <router-link
          to="/login"
          class="text-main-gray-hover transition-colors duration-500 ease-in-out"
          :class="{ 'text-main-red': route.path === '/login' }"
        >
          {{ $t("login") }}
        </router-link>
        <router-link
          to="/signup"
          class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-white"
        >
          {{ $t("signup") }}
        </router-link>
      </div>

      <!-- User Dropdown for Desktop -->
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
  </nav>

  <!-- Loading State -->
  <div v-else class="bg-gray-800 p-4 text-center">
    <div
      class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"
    ></div>
    <span>{{ $t("loadingTranslations") }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, onUnmounted } from "vue";
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
const { on, emit } = useEventBus();

// State Management
const cartItemsCount = ref<number>(0);
const mobileMenuOpen = ref<boolean>(false);
const isMobile = ref<boolean>(false);

// Check if device is mobile
const checkMobile = (): void => {
  isMobile.value = window.innerWidth < 768; // 768px is typically md breakpoint in Tailwind
};

// Watch for mobile menu state changes to control body scroll
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    // Prevent body scrolling when menu is open
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  } else {
    // Restore scrolling when menu is closed
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  }
});

// Computed Properties
const isCartPage = computed<boolean>(
  () => route.path === "/cart" || route.path === "/checkout"
);
const currentLanguage = computed<string>(() =>
  locale.value === "en" ? "EN" : "RU"
);
const translationsLoading = computed<boolean>(() => !translationsLoaded.value);

// Mobile Menu Management
const toggleMobileMenu = (): void => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = (): void => {
  mobileMenuOpen.value = false;
};

// Language Management
const toggleLanguage = async (): Promise<void> => {
  const newLanguage = locale.value === "en" ? "ru" : "en";

  // Update locale
  locale.value = newLanguage;
  sessionStorage.setItem("language", newLanguage);

  // Update i18n
  const messages = await loadLocaleMessages(newLanguage);
  i18n.global.setLocaleMessage(newLanguage, messages);

  // Emit event to notify components about language change
  emit("language-changed", newLanguage);
};

// Authentication Management
const handleLogout = async (): Promise<void> => {
  try {
    await authStore.logout();
    updateCartCount();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const handleLogoutAndCloseMobileMenu = async (): Promise<void> => {
  closeMobileMenu();
  await handleLogout();
};

// Cart Management
const updateCartCount = (): void => {
  cartItemsCount.value = getCartItemsCount();
};

// Lifecycle Hooks
onMounted(() => {
  updateCartCount();
  on("cart-updated", updateCartCount);
  checkMobile();

  // Add window resize listener
  window.addEventListener("resize", checkMobile);
});

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  // Remove window resize listener
  window.removeEventListener("resize", checkMobile);
});
</script>
