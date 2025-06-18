<template>
  <div class="px-8 md:px-12 py-8 md:py-10 max-w-5xl mx-auto">
    <!-- Settings/Orders Toggle -->
    <div class="flex justify-center items-center mb-8 lg:hidden">
      <router-link
        to="/settings"
        class="text-3xl text-main-red px-10 border-r border-main-gray-hover"
      >
        {{ $t("settings") }}
      </router-link>
      <router-link
        to="/orders"
        class="text-3xl text-main-gray-hover px-10 border-l border-main-gray-hover"
      >
        {{ $t("orders") }}
      </router-link>
    </div>

    <!-- Personal Information Form -->
    <form @submit.prevent="updateUserSettings" class="space-y-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label
            for="email"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              'text-main-gray-hover',
            ]"
          >
            {{ $t("email") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'email'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="email"
                id="email"
                v-model="user.email"
                disabled
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'email'"
                @blur="activeInput = ''"
                ref="emailInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="name"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'name' ? 'text-main-red' : 'text-main-gray-hover',
            ]"
          >
            {{ $t("name") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'name'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="text"
                id="name"
                v-model="user.name"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'name'"
                @blur="activeInput = ''"
                ref="nameInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="surname"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'surname'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("surname") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'surname'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="text"
                id="surname"
                v-model="user.surname"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'surname'"
                @blur="activeInput = ''"
                ref="surnameInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="phone"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'phone'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("phone") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'phone'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="tel"
                id="phone"
                v-model="user.phone"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'phone'"
                @blur="activeInput = ''"
                ref="phoneInputRef"
              />
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-xl text-white mt-8 mb-4">
        {{ $t("deliveryData.title") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label
            for="country"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'country'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("deliveryData.country") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'country'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="text"
                id="country"
                v-model="safeDeliveryData.country"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'country'"
                @blur="activeInput = ''"
                ref="countryInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="city"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'city' ? 'text-main-red' : 'text-main-gray-hover',
            ]"
          >
            {{ $t("deliveryData.city") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'city'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="text"
                id="city"
                v-model="safeDeliveryData.city"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'city'"
                @blur="activeInput = ''"
                ref="cityInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="street"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'street'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("deliveryData.street") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'street'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="text"
                id="street"
                v-model="safeDeliveryData.street"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'street'"
                @blur="activeInput = ''"
                ref="streetInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="buildingNumber"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'buildingNumber'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("deliveryData.buildingNumber") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'buildingNumber'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="text"
                id="buildingNumber"
                v-model="safeDeliveryData.buildingNumber"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'buildingNumber'"
                @blur="activeInput = ''"
                ref="buildingNumberInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="apartment"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'apartment'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("deliveryData.apartment") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'apartment'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="text"
                id="apartment"
                v-model="safeDeliveryData.apartment"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'apartment'"
                @blur="activeInput = ''"
                ref="apartmentInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="postalCode"
            :class="[
              'block text-base transition-colors duration-300 ease-in-out',
              activeInput === 'postalCode'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("deliveryData.postalCode") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'postalCode'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="text"
                id="postalCode"
                v-model="safeDeliveryData.postalCode"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'postalCode'"
                @blur="activeInput = ''"
                ref="postalCodeInputRef"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <button
          type="submit"
          class="px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] border border-[#240000] focus:outline-none"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ $t("updating") }}
          </span>
          <span v-else>{{ $t("update") }}</span>
        </button>
      </div>
    </form>

    <!-- Region Settings Section -->
    <div class="mt-10 mb-8">
      <h3 class="text-xl text-white mb-4">
        {{ $t("regionSettings.title") }}
      </h3>

      <div class="mb-6">
        <label class="block text-base text-main-gray-hover mb-2">
          {{ $t("regionSettings.currentRegion") }}
        </label>
        <div class="relative p-[1px] mt-1">
          <div
            class="absolute inset-0 transition-colors duration-500 ease-in-out"
            :class="[
              activeInput === 'region'
                ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
            ]"
          ></div>
          <div
            class="relative bg-[#0E0E0E] flex items-center gap-2 p-3"
            tabindex="0"
            @focus="activeInput = 'region'"
            @blur="activeInput = ''"
          >
            <span class="text-xl" v-if="currentRegion === 'RU'">🇷🇺</span>
            <span class="text-xl" v-else-if="currentRegion === 'EU'">🇪🇺</span>
            <span class="text-xl" v-else>🌎</span>
            <span class="text-white">{{ getRegionName(currentRegion) }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          @click="openRegionSelector"
          class="px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] border border-[#240000] focus:outline-none"
        >
          {{ $t("regionSettings.change") }}
        </button>
      </div>
    </div>

    <!-- Password Change Form -->
    <form @submit.prevent="changePassword" class="space-y-6 mt-10 mb-8">
      <h3 class="text-xl text-white mb-4">
        {{ $t("changePassword.title") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1 md:col-span-2">
          <label
            for="currentPassword"
            :class="[
              'block text-base transition-colors duration-500 ease-in-out',
              activeInput === 'currentPassword'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("changePassword.currentPassword") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'currentPassword'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="password"
                id="currentPassword"
                v-model="passwords.currentPassword"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'currentPassword'"
                @blur="activeInput = ''"
                ref="currentPasswordInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="newPassword"
            :class="[
              'block text-base transition-colors duration-500 ease-in-out',
              activeInput === 'newPassword'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("changePassword.newPassword") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'newPassword'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="password"
                id="newPassword"
                v-model="passwords.newPassword"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'newPassword'"
                @blur="activeInput = ''"
                ref="newPasswordInputRef"
              />
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label
            for="confirmPassword"
            :class="[
              'block text-base transition-colors duration-500 ease-in-out',
              activeInput === 'confirmPassword'
                ? 'text-main-red'
                : 'text-main-gray-hover',
            ]"
          >
            {{ $t("changePassword.confirmPassword") }}
          </label>
          <div class="relative p-[1px] mt-1">
            <div
              class="absolute inset-0 transition-colors duration-500 ease-in-out"
              :class="[
                activeInput === 'confirmPassword'
                  ? 'bg-gradient-to-br from-[#BA0913] via-[#BA0913]/50 to-transparent opacity-80'
                  : 'bg-gradient-to-br from-white via-white/50 to-transparent opacity-80',
              ]"
            ></div>
            <div class="relative bg-[#0E0E0E]">
              <input
                type="password"
                id="confirmPassword"
                v-model="passwords.confirmPassword"
                class="w-full shadow-sm text-base bg-[#0E0E0E] text-white px-4 py-3 border-0 focus:ring-0 focus:outline-none"
                @focus="activeInput = 'confirmPassword'"
                @blur="activeInput = ''"
                ref="confirmPasswordInputRef"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <button
          type="submit"
          class="px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] border border-[#240000] focus:outline-none"
          :disabled="passwordLoading"
        >
          <span v-if="passwordLoading" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ $t("updating") }}
          </span>
          <span v-else>{{ $t("changePassword.update") }}</span>
        </button>
      </div>

      <!-- Password Change Success Message -->
      <div
        v-if="passwordChangeSuccess"
        class="mt-6 p-4 border border-green-500 bg-transparent text-green-400 rounded-md"
      >
        <div class="flex items-center">
          <svg
            class="h-5 w-5 text-green-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <p>{{ $t("passwordChangeSuccess") }}</p>
        </div>
      </div>
    </form>

    <!-- Region Selector Modal -->
    <RegionSelector
      v-if="showRegionSelector"
      @region-selected="onRegionSelected"
      @cancel="showRegionSelector = false"
    />

    <div v-if="loading">
      <Loader :text="$t('loading')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import { useAuthStore } from "@/stores/authStore";

import { getUserRegion, setUserRegion } from "@/services/geolocationService";

import RegionSelector from "@/components/general/RegionSelector.vue";
import Loader from "@/components/general/Loader.vue";

import {
  getUserData,
  updateUserData,
  changeUserPassword,
} from "@/services/authService";

interface SafeUserData {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  deliveryData: {
    country: string;
    city: string;
    street: string;
    buildingNumber: string;
    apartment: string;
    postalCode: string;
  };
}

const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const showRegionSelector = ref(false);
const currentRegion = ref(getUserRegion() || "EU");

// State Management
const activeInput = ref("");
const loading = ref(false);
const passwordLoading = ref(false);
const passwordChangeSuccess = ref(false);

// Input refs
const nameInputRef = ref<HTMLInputElement | null>(null);
const surnameInputRef = ref<HTMLInputElement | null>(null);
const phoneInputRef = ref<HTMLInputElement | null>(null);
const countryInputRef = ref<HTMLInputElement | null>(null);
const cityInputRef = ref<HTMLInputElement | null>(null);
const streetInputRef = ref<HTMLInputElement | null>(null);
const buildingNumberInputRef = ref<HTMLInputElement | null>(null);
const apartmentInputRef = ref<HTMLInputElement | null>(null);
const postalCodeInputRef = ref<HTMLInputElement | null>(null);
const currentPasswordInputRef = ref<HTMLInputElement | null>(null);
const newPasswordInputRef = ref<HTMLInputElement | null>(null);
const confirmPasswordInputRef = ref<HTMLInputElement | null>(null);
const emailInputRef = ref<HTMLInputElement | null>(null);

// Use the safe type
const user = ref<SafeUserData>({
  id: "",
  email: "",
  name: "",
  surname: "",
  phone: "",
  deliveryData: {
    country: "",
    city: "",
    street: "",
    buildingNumber: "",
    apartment: "",
    postalCode: "",
  },
});

// Create a computed property for safe access to deliveryData
const safeDeliveryData = computed(() => {
  return user.value.deliveryData;
});

const passwords = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      const response = await getUserData(authStore.userId);
      user.value = {
        id: response.id || "",
        email: response.email || "",
        name: response.name || "",
        surname: response.surname || "",
        phone: response.phone || "",
        deliveryData: {
          country: response.deliveryData?.country || "",
          city: response.deliveryData?.city || "",
          street: response.deliveryData?.street || "",
          buildingNumber: response.deliveryData?.buildingNumber || "",
          apartment: response.deliveryData?.apartment || "",
          postalCode: response.deliveryData?.postalCode || "",
        },
      };
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error(t("error"));
    }
  }
});

const getRegionName = (region: string): string => {
  if (region === "RU") return t("regionSelector.russia");
  if (region === "EU") return t("regionSelector.eu");
  return t("regionSelector.other");
};

const openRegionSelector = () => {
  showRegionSelector.value = true;
};

const onRegionSelected = (region: string) => {
  showRegionSelector.value = false;
  currentRegion.value = region;

  authStore.userRegion = region;
  setUserRegion(region);

  if (region === "RU") {
    authStore.setLanguage("ru");
    authStore.setCurrency("rubles");
  } else {
    authStore.setLanguage("en");
    authStore.setCurrency("euros");
  }

  toast.success(t("regionSettings.updateSuccess"));
};

const updateUserSettings = async () => {
  loading.value = true;
  try {
    await updateUserData(authStore.userId, user.value);
    toast.success(t("success"));
  } catch (error) {
    console.error("Failed to update user settings:", error);
    toast.error(t("error"));
  } finally {
    loading.value = false;
  }
};

const changePassword = async () => {
  if (passwords.value.newPassword !== passwords.value.confirmPassword) {
    toast.error(t("passwordMismatch"));
    return;
  }

  passwordLoading.value = true;
  try {
    await changeUserPassword(
      authStore.userId,
      passwords.value.currentPassword,
      passwords.value.newPassword
    );

    passwordChangeSuccess.value = true;

    setTimeout(() => {
      passwordChangeSuccess.value = false;
    }, 5000);

    toast.success(t("passwordChangeSuccess"));

    passwords.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  } catch (error) {
    console.error("Failed to change password:", error);
    toast.error(t("passwordChangeError"));
  } finally {
    passwordLoading.value = false;
  }
};
</script>
