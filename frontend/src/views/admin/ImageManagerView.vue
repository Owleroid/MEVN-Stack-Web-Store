<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Upload Section -->
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        {{ $t("imageManager") }}
      </h1>
      <h2 class="text-lg font-medium text-gray-700 mb-4">
        {{ $t("uploadImages") }}
      </h2>

      <div class="flex flex-wrap gap-4 items-center">
        <label
          for="fileUpload"
          class="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
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

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow border border-gray-200">
      <!-- Image List Header -->
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ $t("availableImages") }}
        </h2>
      </div>

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
      <div v-else class="p-4">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="image in images"
            :key="image.url"
            @click="toggleImageSelection(image)"
            class="relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
            :class="{ 'ring-2 ring-blue-500 bg-blue-50': isSelected(image) }"
          >
            <img
              :src="image.url"
              :alt="image.name"
              class="w-full h-32 object-cover"
            />
            <p class="p-2 text-sm text-gray-700 truncate">{{ image.name }}</p>
          </div>
        </div>
      </div>

      <!-- Batch Actions Footer -->
      <div
        class="sticky bottom-0 p-4 border-t border-gray-200 bg-white rounded-b-lg flex flex-wrap gap-2"
        v-if="selectedImages.length > 0"
      >
        <button
          @click="copySelectedUrls"
          class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {{ $t("copyUrls") }}
        </button>

        <button
          @click="deleteSelectedImages"
          class="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {{ $t("deleteSelected") }}
        </button>

        <button
          @click="cancelSelection"
          class="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {{ $t("cancel") }}
        </button>

        <span class="ml-auto text-sm text-gray-600 self-center">
          {{ $t("selectedCount", { count: selectedImages.length }) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

import type { ImageInfo } from "@/types/image";

import {
  fetchImages,
  uploadImages as uploadImagesService,
  deleteImages,
} from "@/services/imageManagerService";

// Composables Setup
const toast = useToast();
const { t } = useI18n();

// State Management
// Image state
const images = ref<ImageInfo[]>([]);
const selectedImages = ref<ImageInfo[]>([]);

// Upload state
const selectedFiles = ref<File[]>([]);
const loading = ref(false);

// Configuration constants
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

// Data Fetching
const fetchImagesFromBackend = async (): Promise<void> => {
  loading.value = true;

  try {
    const { images: fetchedImages } = await fetchImages();
    images.value = fetchedImages;
  } catch (error: unknown) {
    console.error("Error fetching images:", error);
    toast.error(t("fetchImagesError"));
  } finally {
    loading.value = false;
  }
};

// File Upload Operations
const handleFileUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement | null;
  const files = target?.files;

  if (files) {
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Validate file type
      if (!allowedMimeTypes.includes(file.type)) {
        toast.error(t("invalidFileType", { fileName: file.name }));
        continue;
      }

      // Validate file size
      if (file.size > maxFileSize) {
        toast.error(t("fileTooLarge", { fileName: file.name }));
        continue;
      }

      validFiles.push(file);
    }

    selectedFiles.value = validFiles;

    if (validFiles.length > 0) {
      toast.success(t("filesSelected", { count: validFiles.length }));
    }
  }
};

const handleUploadImages = async (): Promise<void> => {
  if (selectedFiles.value.length === 0) return;

  loading.value = true;

  try {
    await uploadImagesService(selectedFiles.value);
    toast.success(t("uploadSuccess"));
    selectedFiles.value = [];
    await fetchImagesFromBackend();
  } catch (error: unknown) {
    console.error("Upload Error:", error);
    toast.error(t("uploadError"));
  } finally {
    loading.value = false;
  }
};

// Image Selection Operations
const isSelected = (image: ImageInfo): boolean => {
  return selectedImages.value.some((img) => img.url === image.url);
};

const toggleImageSelection = (image: ImageInfo): void => {
  if (isSelected(image)) {
    selectedImages.value = selectedImages.value.filter(
      (img) => img.url !== image.url
    );
  } else {
    selectedImages.value.push(image);
  }
};

const cancelSelection = (): void => {
  selectedImages.value = [];
};

// Batch Actions
const copySelectedUrls = (): void => {
  const urls = selectedImages.value.map((image) => image.url).join(", ");

  navigator.clipboard
    .writeText(urls)
    .then(() => {
      toast.success(t("copySuccess"));
    })
    .catch((error: unknown) => {
      console.error("Clipboard error:", error);
      toast.error(t("copyError"));
    });
};

const deleteSelectedImages = async (): Promise<void> => {
  if (selectedImages.value.length === 0) return;

  loading.value = true;

  try {
    const imageNames = selectedImages.value.map((image) => image.name);
    await deleteImages(imageNames);

    // Remove deleted images from the local state
    images.value = images.value.filter((img) => !imageNames.includes(img.name));

    selectedImages.value = [];
    toast.success(t("deleteSuccess"));
  } catch (error: unknown) {
    console.error("Delete error:", error);
    toast.error(t("deleteError"));
  } finally {
    loading.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchImagesFromBackend();
});
</script>
