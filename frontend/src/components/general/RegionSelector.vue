<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
      <h2 class="mb-4 text-xl font-semibold text-gray-800">
        {{ $t("regionSelector.title") }}
      </h2>
      <p class="mb-6 text-gray-600">
        {{ $t("regionSelector.description") }}
      </p>

      <div class="grid grid-cols-1 gap-4 mb-6">
        <button
          v-for="option in regionOptions"
          :key="option.value"
          @click="selectRegion(option.value)"
          class="flex items-center justify-between p-4 text-left transition-colors border rounded-lg hover:bg-gray-50"
          :class="{
            'border-blue-500 bg-blue-50': selectedRegion === option.value,
            'border-gray-200': selectedRegion !== option.value,
          }"
        >
          <div class="flex items-center">
            <span class="mr-3 text-xl">{{ option.flag }}</span>
            <span>{{ option.label }}</span>
          </div>
          <div v-if="selectedRegion === option.value" class="text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>

      <button
        @click="confirmRegion"
        :disabled="!selectedRegion"
        class="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ $t("regionSelector.confirm") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { useAuthStore } from "@/stores/authStore";

import { setUserRegion } from "@/services/geolocationService";

// Composables Setup
const emit = defineEmits(["region-selected"]);
const { t } = useI18n();
const authStore = useAuthStore();

// State Management
const selectedRegion = ref("");

// Region Options Configuration
const regionOptions = [
  { value: "RU", label: t("regionSelector.russia"), flag: "🇷🇺" },
  { value: "EU", label: t("regionSelector.eu"), flag: "🇪🇺" },
  { value: "OTHER", label: t("regionSelector.other"), flag: "🌎" },
];

// Event Handlers
const selectRegion = (region: string) => {
  selectedRegion.value = region;
};

const confirmRegion = () => {
  if (!selectedRegion.value) return;

  // Store the current language to check if it changed
  const previousLanguage = authStore.language;

  // Set the region in session storage
  setUserRegion(selectedRegion.value);

  // Update the store
  authStore.userRegion = selectedRegion.value;

  // Set language and currency based on selected region
  if (selectedRegion.value === "RU") {
    authStore.setLanguage("ru");
    authStore.setCurrency("rubles");
  } else {
    authStore.setLanguage("en");
    authStore.setCurrency("euros");
  }

  // Emit the event to notify parent components
  emit("region-selected", selectedRegion.value);

  // If language changed, reload the page to apply translations everywhere
  if (previousLanguage !== authStore.language) {
    // Small timeout to ensure the event is processed before reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
};
</script>
