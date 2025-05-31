<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Upload Section -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 transition-all duration-300 hover:shadow"
      >
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          {{ $t("uploadImages") }}
        </h2>

        <div class="flex flex-wrap gap-4 items-center">
          <label
            for="fileUpload"
            class="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
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
            :disabled="selectedFiles.length === 0 || uploadingImages"
            class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center gap-2 transform hover:scale-105"
          >
            <div
              v-if="uploadingImages"
              class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
            ></div>
            {{ $t("upload") }}
          </button>

          <span v-if="selectedFiles.length > 0" class="text-sm text-gray-600">
            {{ $t("filesSelected", { count: selectedFiles.length }) }}
          </span>
        </div>
      </div>

      <!-- Main Content -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Image List Header with Sorting Controls -->
        <div class="p-4 border-b border-gray-200">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <h2 class="text-lg font-semibold text-gray-800">
              {{ $t("availableImages") }}
            </h2>

            <!-- Sorting Controls -->
            <div class="flex items-center space-x-4">
              <label class="text-sm text-gray-600">{{ $t("sortBy") }}:</label>
              <select
                v-model="sortBy"
                class="py-1.5 px-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              >
                <option value="createdAt">{{ $t("uploadDate") }}</option>
                <option value="name">{{ $t("fileName") }}</option>
              </select>

              <button
                @click="toggleSortDirection"
                class="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
                title="Toggle sort direction"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-600 transition-transform duration-200"
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
        </div>

        <!-- Image List Container -->
        <div>
          <transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
          >
            <!-- Loading State --->
            <div v-if="loadingImages" class="text-center py-16" key="loading">
              <div
                class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-600 mb-4"
              ></div>
              <p class="text-gray-500">{{ $t("loadingImages") }}</p>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="images.length === 0"
              class="text-center py-16"
              key="empty"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p class="text-gray-500 text-lg mb-2">{{ $t("noImages") }}</p>
              <p class="text-gray-400 text-sm">{{ $t("uploadSomeImages") }}</p>
            </div>

            <!-- Image Grid -->
            <div v-else class="p-4" key="images">
              <transition-group
                tag="div"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 transform scale-95"
                enter-to-class="opacity-100 transform scale-100"
                leave-from-class="opacity-100 transform scale-100"
                leave-to-class="opacity-0 transform scale-95"
              >
                <div
                  v-for="image in sortedImages"
                  :key="image.url"
                  @click="toggleImageSelection(image)"
                  class="relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  :class="{
                    'ring-2 ring-blue-500 bg-blue-50': isSelected(image),
                  }"
                >
                  <div class="aspect-w-1 aspect-h-1 w-full">
                    <img
                      :src="image.url"
                      :alt="image.name"
                      class="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                    />
                  </div>
                  <div class="p-2">
                    <p class="text-sm text-gray-700 truncate">
                      {{ image.name }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatDate(image.createdAt) }}
                    </p>
                  </div>
                </div>
              </transition-group>
            </div>
          </transition>
        </div>

        <!-- Batch Actions Footer -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 transform translate-y-4"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform translate-y-4"
        >
          <div
            class="sticky bottom-0 p-4 border-t border-gray-200 bg-white rounded-b-lg flex flex-wrap gap-2 shadow-md"
            v-if="selectedImages.length > 0"
          >
            <button
              @click="copySelectedUrls"
              class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transform hover:scale-105"
            >
              {{ $t("copyUrls") }}
            </button>

            <button
              @click="deleteSelectedImages"
              :disabled="deletingImages"
              class="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <div
                v-if="deletingImages"
                class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
              ></div>
              {{ $t("deleteSelected") }}
            </button>

            <button
              @click="cancelSelection"
              class="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transform hover:scale-105"
            >
              {{ $t("cancel") }}
            </button>

            <span class="ml-auto text-sm text-gray-600 self-center">
              {{ $t("selectedCount", { count: selectedImages.length }) }}
            </span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
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

// Load state management
const loadingImages = ref(false);
const uploadingImages = ref(false);
const deletingImages = ref(false);

// Upload state
const selectedFiles = ref<File[]>([]);

// Sorting state
const sortBy = ref<"createdAt" | "name">("createdAt");
const sortDirection = ref<"asc" | "desc">("desc");

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
  loadingImages.value = true;

  try {
    const { images: fetchedImages } = await fetchImages();
    images.value = fetchedImages;
  } catch (error: unknown) {
    console.error("Error fetching images:", error);
    toast.error(t("fetchImagesError"));
  } finally {
    loadingImages.value = false;
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
      if (!allowedMimeTypes.includes(file.type)) {
        toast.error(t("invalidFileType", { fileName: file.name }));
        continue;
      }

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

  uploadingImages.value = true;

  try {
    await uploadImagesService(selectedFiles.value);
    toast.success(t("uploadSuccess"));
    selectedFiles.value = [];
    await fetchImagesFromBackend();
  } catch (error: unknown) {
    console.error("Upload Error:", error);
    toast.error(t("uploadError"));
  } finally {
    uploadingImages.value = false;
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

  deletingImages.value = true;

  try {
    const imageNames = selectedImages.value.map((image) => image.name);
    await deleteImages(imageNames);

    images.value = images.value.filter((img) => !imageNames.includes(img.name));

    selectedImages.value = [];
    toast.success(t("deleteSuccess"));
  } catch (error: unknown) {
    console.error("Delete error:", error);
    toast.error(t("deleteError"));
  } finally {
    deletingImages.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchImagesFromBackend();
});
</script>
