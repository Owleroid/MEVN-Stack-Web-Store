<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
      <h3 class="text-xl font-medium mb-6 text-gray-800 border-b pb-3">
        {{ $t("changeAnnouncementImage") }}
      </h3>

      <!-- Product Images Section -->
      <div v-if="announcement?.product" class="mb-6">
        <div class="mb-6">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <span class="mr-2">{{ $t("productImages") }}</span>
            <span
              v-if="!isCustomImage"
              class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
              >{{ $t("selected") }}</span
            >
          </h4>

          <div class="grid grid-cols-3 gap-4 mb-4">
            <div
              @click="selectProductImage(announcement.product.imageUrls.main)"
              class="relative cursor-pointer border overflow-hidden h-24 rounded-md transition-all hover:shadow-md"
              :class="{
                'ring-2 ring-blue-500 ring-offset-1':
                  selectedImage === announcement.product.imageUrls.main &&
                  !isCustomImage,
              }"
            >
              <img
                :src="announcement.product.imageUrls.main"
                class="w-full h-full object-cover"
                alt="Main product image"
              />
            </div>

            <div
              v-for="(url, index) in announcement.product.imageUrls.secondary"
              :key="index"
              @click="selectProductImage(url)"
              class="relative cursor-pointer border overflow-hidden h-24 rounded-md transition-all hover:shadow-md"
              :class="{
                'ring-2 ring-blue-500 ring-offset-1':
                  selectedImage === url && !isCustomImage,
              }"
            >
              <img
                :src="url"
                class="w-full h-full object-cover"
                :alt="`Secondary product image ${index + 1}`"
              />
            </div>
          </div>
        </div>

        <!-- Custom Image Section -->
        <div class="mb-6">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <span class="mr-2">{{ $t("customImage") }}</span>
            <span
              v-if="isCustomImage"
              class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
              >{{ $t("selected") }}</span
            >
          </h4>

          <div v-if="isCustomImage" class="mb-4">
            <div
              class="w-full bg-gray-50 rounded-lg overflow-hidden aspect-video border border-gray-200 shadow-sm"
            >
              <img
                :src="selectedImage"
                alt="Custom selected image"
                class="w-full h-full object-contain"
              />
            </div>
            <button
              @click="clearCustomImage"
              class="mt-3 text-sm text-red-600 hover:text-red-800 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ $t("removeCustomImage") }}
            </button>
          </div>

          <button
            @click="$emit('openImageManager')"
            class="w-full px-3 py-2.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ $t("chooseFromImageManager") }}
          </button>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          {{ $t("cancel") }}
        </button>
        <button
          @click="$emit('save', selectedImage)"
          :disabled="!selectedImage || isLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <div
            v-if="isLoading"
            class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
          ></div>
          {{ $t("saveImage") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import type { Announcement } from "@/types/announcement";

// Props Definition
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  announcement: {
    type: Object as () => Announcement | null,
    default: null,
    required: false,
  },
  initialImage: {
    type: String,
    default: "",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

// State Management
const selectedImage = ref(props.initialImage);
const isCustomImage = ref(false);

// Watch for prop changes
watch(
  [() => props.initialImage, () => props.announcement],
  ([newImageValue, newAnnouncement]) => {
    selectedImage.value = newImageValue || "";

    if (newAnnouncement && newImageValue) {
      const productImages = [
        newAnnouncement.product.imageUrls.main,
        ...(newAnnouncement.product.imageUrls.secondary || []),
      ];

      isCustomImage.value = !productImages.includes(newImageValue);
    } else {
      isCustomImage.value = false;
    }
  },
  { immediate: true }
);

// Image Selection Methods
const selectProductImage = (url: string) => {
  selectedImage.value = url;
  isCustomImage.value = false;
};

const setCustomImage = (url: string) => {
  selectedImage.value = url;
  isCustomImage.value = true;
};

const clearCustomImage = () => {
  if (props.announcement?.product) {
    selectedImage.value = props.announcement.product.imageUrls.main;
    isCustomImage.value = false;
  }
};

// Events Definition
defineEmits(["cancel", "save", "openImageManager"]);

// Exposed Methods
defineExpose({
  setCustomImage,
});
</script>
