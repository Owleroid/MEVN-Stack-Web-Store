<template>
  <div
    v-if="show"
    class="fixed inset-0 z-10 flex items-center justify-center overflow-auto bg-black/40"
  >
    <div
      class="relative w-11/12 max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
    >
      <!-- Modal Header -->
      <button
        @click="close"
        class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors"
      >
        &times;
      </button>

      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        {{ $t("imageManager") }}
      </h2>

      <!-- Upload Section -->
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          {{ $t("uploadImages") }}
        </h3>

        <div class="flex flex-wrap gap-4 items-center">
          <label
            for="fileUpload"
            class="flex items-center px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span class="text-sm font-medium">{{ $t("chooseFiles") }}</span>
            <input
              id="fileUpload"
              type="file"
              @change="handleFileUpload"
              multiple
              class="hidden"
            />
          </label>

          <button
            @click="handleUploadImages"
            :disabled="selectedFiles.length === 0"
            class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {{ $t("upload") }}
          </button>

          <span v-if="selectedFiles.length > 0" class="text-sm text-gray-600">
            {{ $t("filesSelected", { count: selectedFiles.length }) }}
          </span>
        </div>
      </div>

      <!-- Image List -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          {{ $t("availableImages") }}
        </h3>

        <!-- Loading State -->
        <div v-if="loading" class="text-center p-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"
          ></div>
          <p class="mt-4 text-gray-500">{{ $t("loadingImages") }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="images.length === 0" class="text-center p-8">
          <p class="text-gray-500">{{ $t("noImages") }}</p>
        </div>

        <!-- Image Grid -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <div
            v-for="image in images"
            :key="image.url"
            @click="toggleImageSelection(image)"
            class="relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            :class="{ 'ring-2 ring-blue-500 bg-blue-50': isSelected(image) }"
          >
            <img
              :src="image.url"
              :alt="image.name"
              class="w-full h-32 object-cover"
            />
            <div class="p-2">
              <p class="text-sm text-gray-700 truncate">{{ image.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          @click="confirmSelection"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {{ $t("confirm") }}
        </button>

        <button
          @click="close"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {{ $t("cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

// ==============================
// Type Imports
// ==============================
import type { Image } from "@/types/imageManager";

// ==============================
// Service Imports
// ==============================
import { fetchImages, uploadImages } from "@/services/imageManagerService";

// ==============================
// Props Definition
// ==============================

/**
 * Component props
 */
const props = defineProps<{
  /** Whether to show the modal */
  show: boolean;
  /** Whether multiple images can be selected */
  allowMultiple: boolean;
}>();

// ==============================
// Composables Setup
// ==============================
const { t } = useI18n();
const toast = useToast();

// ==============================
// Events Definition
// ==============================

/**
 * Component events
 */
const emits = defineEmits<{
  (e: "close"): void;
  (e: "confirm", images: Image[]): void;
}>();

// ==============================
// State Management
// ==============================

// Image state
const images = ref<Image[]>([]);
const selectedImages = ref<Image[]>([]);

// Upload state
const selectedFiles = ref<File[]>([]);
const loading = ref(false);

// ==============================
// Data Fetching
// ==============================

/**
 * Fetches images from the backend API
 */
const fetchImagesFromBackend = async (): Promise<void> => {
  loading.value = true;

  try {
    const response = await fetchImages();
    images.value = response.images;
  } catch (error) {
    toast.error(t("fetchImagesError"));
  } finally {
    loading.value = false;
  }
};

// ==============================
// File Upload Operations
// ==============================

/**
 * Handles file selection from the input field
 * @param event - File input change event
 */
const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    selectedFiles.value = Array.from(files);
    toast.success(t("filesSelected", { count: files.length }));
  }
};

/**
 * Uploads selected files to the server
 */
const handleUploadImages = async (): Promise<void> => {
  try {
    await uploadImages(selectedFiles.value);
    toast.success(t("uploadSuccess"));
    selectedFiles.value = [];
    await fetchImagesFromBackend();
  } catch (error) {
    toast.error(t("uploadError"));
  }
};

// ==============================
// Image Selection Operations
// ==============================

/**
 * Checks if an image is currently selected
 * @param image - The image to check
 * @returns True if the image is selected
 */
const isSelected = (image: Image): boolean => {
  return selectedImages.value.some(
    (img) => img.url === image.url && img.name === image.name
  );
};

/**
 * Toggles selection state of an image
 * @param image - The image to select/deselect
 */
const toggleImageSelection = (image: Image): void => {
  if (props.allowMultiple) {
    if (isSelected(image)) {
      selectedImages.value = selectedImages.value.filter(
        (img) => img.url !== image.url || img.name !== image.name
      );
    } else {
      selectedImages.value.push(image);
    }
  } else {
    selectedImages.value = [image];
  }
};

// ==============================
// Modal Management
// ==============================

/**
 * Confirms the current image selection and emits event
 */
const confirmSelection = (): void => {
  emits("confirm", selectedImages.value);
};

/**
 * Closes the modal
 */
const close = (): void => {
  emits("close");
};

// ==============================
// Watchers
// ==============================

/**
 * Reset selection when modal closes
 */
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      selectedImages.value = [];
    }
  }
);

// ==============================
// Lifecycle Hooks
// ==============================
onMounted(() => {
  fetchImagesFromBackend();
});
</script>
