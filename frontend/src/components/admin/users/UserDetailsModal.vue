<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-10 overflow-auto"
    @click="closeModal"
  >
    <div
      class="relative w-11/12 max-w-3xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Modal Header -->
      <div
        class="sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 rounded-t-xl px-6 pt-6 pb-4"
      >
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors focus:outline-none focus:text-blue-600"
        >
          &times;
        </button>
        <h2 class="text-xl font-bold text-gray-800">
          {{ $t("userDetails.title") }}
        </h2>
      </div>

      <!-- Modal Content -->
      <div class="p-6 space-y-6" v-if="user">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info -->
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center"
            >
              <h3 class="text-lg font-semibold text-gray-800">
                {{ $t("userDetails.basicInfo") }}
              </h3>
            </div>

            <div class="p-6 space-y-4">
              <div class="flex flex-col sm:flex-row">
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.name") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">{{
                  formatName(user)
                }}</span>
              </div>

              <div class="flex flex-col sm:flex-row">
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.email") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">{{ user.email }}</span>
              </div>

              <div class="flex flex-col sm:flex-row">
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.phone") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">
                  {{ user.phone || $t("userDetails.notProvided") }}
                </span>
              </div>

              <div class="flex flex-col sm:flex-row">
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.role") }}:
                </span>
                <span class="sm:w-3/5">
                  <span
                    :class="user.isAdmin ? 'bg-orange-500' : 'bg-blue-500'"
                    class="px-2.5 py-1 rounded-full text-xs font-medium text-white inline-flex items-center"
                  >
                    {{
                      user.isAdmin
                        ? $t("userDetails.admin")
                        : $t("userDetails.user")
                    }}
                  </span>
                </span>
              </div>

              <div class="flex flex-col sm:flex-row">
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.registrationDate") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">
                  {{ formatDate(user.registrationDate) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Delivery Info -->
          <div
            v-if="hasDeliveryData"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center"
            >
              <h3 class="text-lg font-semibold text-gray-800">
                {{ $t("userDetails.deliveryInfo") }}
              </h3>
            </div>

            <div class="p-6 space-y-4">
              <div
                v-if="user.deliveryData?.country"
                class="flex flex-col sm:flex-row"
              >
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.country") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">{{
                  user.deliveryData.country
                }}</span>
              </div>

              <div
                v-if="user.deliveryData?.city"
                class="flex flex-col sm:flex-row"
              >
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.city") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">{{
                  user.deliveryData.city
                }}</span>
              </div>

              <div
                v-if="user.deliveryData?.street"
                class="flex flex-col sm:flex-row"
              >
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.street") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">{{
                  user.deliveryData.street
                }}</span>
              </div>

              <div
                v-if="user.deliveryData?.buildingNumber"
                class="flex flex-col sm:flex-row"
              >
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.buildingNumber") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">{{
                  user.deliveryData.buildingNumber
                }}</span>
              </div>

              <div
                v-if="user.deliveryData?.apartment"
                class="flex flex-col sm:flex-row"
              >
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.apartment") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">{{
                  user.deliveryData.apartment
                }}</span>
              </div>

              <div
                v-if="user.deliveryData?.postalCode"
                class="flex flex-col sm:flex-row"
              >
                <span
                  class="text-sm font-medium text-gray-600 sm:w-2/5 mb-1 sm:mb-0"
                >
                  {{ $t("userDetails.postalCode") }}:
                </span>
                <span class="text-gray-800 sm:w-3/5">{{
                  user.deliveryData.postalCode
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 border-t border-gray-100 flex justify-end">
        <button
          @click="closeModal"
          class="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 shadow-sm"
        >
          {{ $t("userDetails.close") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import type { UserData } from "@/types/auth";

// Composables Setup
const { t, locale } = useI18n();

// Props Definition
const props = defineProps<{
  show: boolean;
  user: UserData | null;
}>();

// Events Definition
const emit = defineEmits<{
  (e: "close"): void;
}>();

// Modal Management
const closeModal = (): void => {
  emit("close");
};

// Formatting Helpers
const formatName = (user: UserData): string => {
  if (user.name && user.surname) {
    return `${user.name} ${user.surname}`;
  } else if (user.name) {
    return user.name;
  } else if (user.surname) {
    return user.surname;
  } else {
    return t("userDetails.noName");
  }
};

const formatDate = (dateString?: Date | string): string => {
  if (!dateString) return t("userDetails.notProvided");

  const date = dateString instanceof Date ? dateString : new Date(dateString);

  // Check if date is valid before formatting
  if (isNaN(date.getTime())) return t("userDetails.notProvided");

  return new Intl.DateTimeFormat(locale.value === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Computed Properties
const hasDeliveryData = computed((): boolean => {
  const data = props.user?.deliveryData;
  return !!(
    data &&
    (data.country ||
      data.city ||
      data.street ||
      data.buildingNumber ||
      data.apartment ||
      data.postalCode)
  );
});
</script>
