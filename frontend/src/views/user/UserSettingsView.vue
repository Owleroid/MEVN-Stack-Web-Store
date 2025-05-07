<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mb-6">{{ $t("title") }}</h1>

    <!-- Personal Information Form -->
    <form @submit.prevent="updateUserSettings" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("email") }}</label
          >
          <input
            type="email"
            id="email"
            v-model="user.email"
            disabled
            class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
          />
        </div>

        <div>
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("name") }}</label
          >
          <input
            type="text"
            id="name"
            v-model="user.name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="surname"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("surname") }}</label
          >
          <input
            type="text"
            id="surname"
            v-model="user.surname"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="phone"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("phone") }}</label
          >
          <input
            type="tel"
            id="phone"
            v-model="user.phone"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <h2 class="text-xl font-semibold mb-4">{{ $t("deliveryData.title") }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            for="country"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("deliveryData.country") }}</label
          >
          <input
            type="text"
            id="country"
            v-model="safeDeliveryData.country"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="city"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("deliveryData.city") }}</label
          >
          <input
            type="text"
            id="city"
            v-model="safeDeliveryData.city"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="street"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("deliveryData.street") }}</label
          >
          <input
            type="text"
            id="street"
            v-model="safeDeliveryData.street"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="buildingNumber"
            class="block mb-2 text-sm font-medium text-gray-700"
          >
            {{ $t("deliveryData.buildingNumber") }}
          </label>
          <input
            type="text"
            id="buildingNumber"
            v-model="safeDeliveryData.buildingNumber"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="apartment"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("deliveryData.apartment") }}</label
          >
          <input
            type="text"
            id="apartment"
            v-model="safeDeliveryData.apartment"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="postalCode"
            class="block mb-2 text-sm font-medium text-gray-700"
            >{{ $t("deliveryData.postalCode") }}</label
          >
          <input
            type="text"
            id="postalCode"
            v-model="safeDeliveryData.postalCode"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {{ $t("update") }}
      </button>
    </form>

    <!-- Region Settings Section -->
    <div class="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">
        {{ $t("regionSettings.title") }}
      </h2>

      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-700">
          {{ $t("regionSettings.currentRegion") }}
        </label>
        <div
          class="flex items-center gap-2 p-3 bg-white rounded-md border border-gray-200"
        >
          <span class="text-xl" v-if="currentRegion === 'RU'">🇷🇺</span>
          <span class="text-xl" v-else-if="currentRegion === 'EU'">🇪🇺</span>
          <span class="text-xl" v-else>🌎</span>
          <span>{{ getRegionName(currentRegion) }}</span>
        </div>
      </div>

      <button
        @click="openRegionSelector"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {{ $t("regionSettings.change") }}
      </button>
    </div>

    <!-- Password Change Form -->
    <form @submit.prevent="changePassword" class="mb-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ $t("changePassword.title") }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="md:col-span-2">
          <label
            for="currentPassword"
            class="block mb-2 text-sm font-medium text-gray-700"
          >
            {{ $t("changePassword.currentPassword") }}
          </label>
          <input
            type="password"
            id="currentPassword"
            v-model="passwords.currentPassword"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="newPassword"
            class="block mb-2 text-sm font-medium text-gray-700"
          >
            {{ $t("changePassword.newPassword") }}
          </label>
          <input
            type="password"
            id="newPassword"
            v-model="passwords.newPassword"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block mb-2 text-sm font-medium text-gray-700"
          >
            {{ $t("changePassword.confirmPassword") }}
          </label>
          <input
            type="password"
            id="confirmPassword"
            v-model="passwords.confirmPassword"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {{ $t("changePassword.update") }}
      </button>
    </form>

    <!-- Region Selector Modal -->
    <RegionSelector
      v-if="showRegionSelector"
      @region-selected="onRegionSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import { useAuthStore } from "@/stores/authStore";

import { getUserRegion, setUserRegion } from "@/services/geolocationService";

import RegionSelector from "@/components/general/RegionSelector.vue";

import {
  getUserData,
  updateUserData,
  changeUserPassword,
} from "@/services/authService";

// Create a more specific type that guarantees deliveryData exists
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
      // Handle potential undefined fields
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

  // Update region in auth store and session storage
  authStore.userRegion = region;
  setUserRegion(region);

  // Update language and currency based on selected region
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
  try {
    await updateUserData(authStore.userId, user.value);
    toast.success(t("success"));
  } catch (error) {
    console.error("Failed to update user settings:", error);
    toast.error(t("error"));
  }
};

const changePassword = async () => {
  try {
    if (passwords.value.newPassword === passwords.value.confirmPassword) {
      await changeUserPassword(
        authStore.userId,
        passwords.value.currentPassword,
        passwords.value.newPassword
      );
      toast.success(t("passwordChangeSuccess"));
      // Clear password fields after successful change
      passwords.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    } else {
      toast.error(t("passwordMismatch"));
    }
  } catch (error) {
    console.error("Failed to change password:", error);
    toast.error(t("passwordChangeError"));
  }
};
</script>
