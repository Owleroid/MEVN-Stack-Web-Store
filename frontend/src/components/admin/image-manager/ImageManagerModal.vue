<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[60] flex items-center justify-center overflow-auto bg-black/40"
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
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
        >
          <h3 class="text-lg font-semibold text-gray-700">
            {{ $t("availableImages") }}
          </h3>

          <!-- Sorting Controls -->
          <div class="flex items-center space-x-4">
            <label class="text-sm text-gray-600">{{ $t("sortBy") }}:</label>
            <select
              v-model="sortBy"
              class="py-1 px-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt">{{ $t("uploadDate") }}</option>
              <option value="name">{{ $t("fileName") }}</option>
            </select>

            <button
              @click="toggleSortDirection"
              class="p-1 rounded-md hover:bg-gray-100"
              title="Toggle sort direction"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-600"
                :class="{ 'rotate-180': sortDirection === 'desc' }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
            </button>
          </div>
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
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <div
            v-for="image in sortedImages"
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
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(image.createdAt) }}
              </p>
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
import { ref, onMounted, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

import type { ImageInfo } from "@/types/image";

import { fetchImages, uploadImages } from "@/services/imageManagerService";

// Props Definition
const props = defineProps<{
  show: boolean;
  allowMultiple: boolean;
}>();

// Composables Setup
const { t } = useI18n();
const toast = useToast();

// Events Definition
const emits = defineEmits<{
  (e: "close"): void;
  (e: "confirm", images: ImageInfo[]): void;
}>();

// State Management
// Image state
const images = ref<ImageInfo[]>([]);
const selectedImages = ref<ImageInfo[]>([]);

// Upload state
const selectedFiles = ref<File[]>([]);
const loading = ref(false);

// Sorting state
const sortBy = ref<"createdAt" | "name">("createdAt");
const sortDirection = ref<"asc" | "desc">("desc"); // Default newest first

// Configuration constants
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

// Computed properties
const sortedImages = computed(() => {
  if (images.value.length === 0) return [];

  return [...images.value].sort((a, b) => {
    if (sortBy.value === "createdAt") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection.value === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      // Sort by name
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortDirection.value === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
  });
});

// Methods
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(
    document.documentElement.lang === "ru" ? "ru-RU" : "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );
};

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
    await uploadImages(selectedFiles.value);
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
  if (props.allowMultiple) {
    if (isSelected(image)) {
      selectedImages.value = selectedImages.value.filter(
        (img) => img.url !== image.url
      );
    } else {
      selectedImages.value.push(image);
    }
  } else {
    selectedImages.value = [image];
  }
};

// Modal Management
const confirmSelection = (): void => {
  emits("confirm", selectedImages.value);
};

const close = (): void => {
  emits("close");
};

// Watchers
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      // When modal opens, refresh images
      fetchImagesFromBackend();
    } else {
      selectedImages.value = [];
    }
  }
);

// Lifecycle Hooks
onMounted(() => {
  if (props.show) {
    fetchImagesFromBackend();
  }
});
</script>
