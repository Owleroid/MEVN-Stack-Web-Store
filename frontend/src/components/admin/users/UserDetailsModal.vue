<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-lg w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg"
      @click.stop
    >
      <div
        class="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200"
      >
        <h2 class="text-2xl text-gray-700 font-medium m-0">
          {{ $t("userDetails.title") }}
        </h2>
        <button
          class="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer transition-colors"
          @click="closeModal"
        >
          &times;
        </button>
      </div>

      <div class="p-4 sm:p-6" v-if="user">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info -->
          <div class="bg-gray-50 rounded-md p-4 border border-gray-200">
            <h3
              class="text-lg text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200"
            >
              {{ $t("userDetails.basicInfo") }}
            </h3>

            <div class="mb-3 flex flex-col sm:flex-row">
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.name") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">{{ formatName(user) }}</span>
            </div>

            <div class="mb-3 flex flex-col sm:flex-row">
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.email") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">{{ user.email }}</span>
            </div>

            <div class="mb-3 flex flex-col sm:flex-row">
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.phone") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">
                {{ user.phone || $t("userDetails.notProvided") }}
              </span>
            </div>

            <div class="mb-3 flex flex-col sm:flex-row">
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.role") }}:
              </span>
              <span class="sm:w-3/5">
                <span
                  :class="
                    user.isAdmin
                      ? 'bg-orange-500 text-white'
                      : 'bg-blue-500 text-white'
                  "
                  class="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                >
                  {{
                    user.isAdmin
                      ? $t("userDetails.admin")
                      : $t("userDetails.user")
                  }}
                </span>
              </span>
            </div>

            <div class="mb-3 flex flex-col sm:flex-row">
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.registrationDate") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">
                {{ formatDate(user.registrationDate) }}
              </span>
            </div>
          </div>

          <!-- Delivery Info -->
          <div
            v-if="hasDeliveryData"
            class="bg-gray-50 rounded-md p-4 border border-gray-200"
          >
            <h3
              class="text-lg text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200"
            >
              {{ $t("userDetails.deliveryInfo") }}
            </h3>

            <div
              v-if="user.deliveryData?.country"
              class="mb-3 flex flex-col sm:flex-row"
            >
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.country") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">{{
                user.deliveryData.country
              }}</span>
            </div>

            <div
              v-if="user.deliveryData?.city"
              class="mb-3 flex flex-col sm:flex-row"
            >
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.city") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">{{
                user.deliveryData.city
              }}</span>
            </div>

            <div
              v-if="user.deliveryData?.street"
              class="mb-3 flex flex-col sm:flex-row"
            >
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.street") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">{{
                user.deliveryData.street
              }}</span>
            </div>

            <div
              v-if="user.deliveryData?.buildingNumber"
              class="mb-3 flex flex-col sm:flex-row"
            >
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.buildingNumber") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">{{
                user.deliveryData.buildingNumber
              }}</span>
            </div>

            <div
              v-if="user.deliveryData?.apartment"
              class="mb-3 flex flex-col sm:flex-row"
            >
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
              >
                {{ $t("userDetails.apartment") }}:
              </span>
              <span class="text-gray-800 sm:w-3/5">{{
                user.deliveryData.apartment
              }}</span>
            </div>

            <div
              v-if="user.deliveryData?.postalCode"
              class="mb-3 flex flex-col sm:flex-row"
            >
              <span
                class="font-semibold text-gray-500 text-sm sm:w-2/5 mb-1 sm:mb-0"
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

      <div class="p-4 sm:p-6 border-t border-gray-200 flex justify-end">
        <button
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded transition-colors"
          @click="closeModal"
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

import type { User } from "@/types/users";

const { t, locale } = useI18n();

const props = defineProps<{
  show: boolean;
  user: User | null;
}>();

const emits = defineEmits(["close"]);

const closeModal = () => {
  emits("close");
};

const formatName = (user: User): string => {
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

const formatDate = (dateString: string): string => {
  if (!dateString) return t("userDetails.notProvided");

  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale.value === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const hasDeliveryData = computed(() => {
  const data = props.user?.deliveryData;
  return (
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
