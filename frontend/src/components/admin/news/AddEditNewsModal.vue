<template>
  <div>
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto py-4"
      @click="close"
    >
      <div
        class="bg-white rounded-2xl w-11/12 max-w-2xl shadow-2xl border border-gray-200 my-auto max-h-[85vh] overflow-hidden flex flex-col relative"
        @click.stop
      >
        <!-- Modal Header -->
        <div
          class="p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10"
        >
          <h3 class="text-2xl font-extrabold text-gray-800 text-center w-full">
            {{ isEdit ? $t("editNews") : $t("addNews") }}
          </h3>
          <button
            @click="close"
            class="absolute right-6 top-6 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 bg-white overflow-y-auto flex-1">
          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- News Title -->
            <div>
              <label
                for="title"
                class="block text-sm font-semibold text-gray-700 mb-1"
              >
                {{ $t("newsTitle") }}:
              </label>
              <input
                type="text"
                id="title"
                v-model="newsData.title"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
                :placeholder="$t('newsTitlePlaceholder')"
              />
            </div>

            <!-- News Language -->
            <div>
              <label
                for="language"
                class="block text-sm font-semibold text-gray-700 mb-1"
              >
                {{ $t("language") }}:
              </label>
              <select
                id="language"
                v-model="newsData.language"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">
                {{ $t("languageHelpText") }}
              </p>
            </div>

            <!-- News Content -->
            <div>
              <label
                for="text"
                class="block text-sm font-semibold text-gray-700 mb-1"
              >
                {{ $t("newsContent") }}:
              </label>
              <QuillEditor
                id="text"
                v-model:content="newsData.text"
                contentType="html"
                theme="snow"
                toolbar="full"
                :placeholder="$t('newsContentPlaceholder')"
                class="bg-white border border-gray-300 rounded-lg min-h-[200px]"
              />
            </div>

            <!-- News Image -->
            <div>
              <label
                for="imageUrl"
                class="block text-sm font-semibold text-gray-700 mb-1"
              >
                {{ $t("newsImage") }}:
              </label>

              <div class="flex items-center gap-4 mb-2">
                <div
                  v-if="newsData.imageUrl"
                  class="w-24 h-24 bg-gray-100 rounded overflow-hidden"
                >
                  <img
                    :src="newsData.imageUrl"
                    alt="News image"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <input
                    type="text"
                    id="imageUrl"
                    v-model="newsData.imageUrl"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition mb-2"
                    :placeholder="$t('imageUrlPlaceholder')"
                    readonly
                  />
                  <button
                    type="button"
                    @click="openImageManager"
                    class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {{ $t("chooseFromImageManager") }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Active Status -->
            <div v-if="isEdit" class="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                v-model="newsData.isActive"
                class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                for="isActive"
                class="ml-2 text-sm font-medium text-gray-700"
              >
                {{ $t("activeStatus") }}
              </label>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="close"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                {{ $t("cancel") }}
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <div
                  v-if="isSubmitting"
                  class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                ></div>
                {{ isEdit ? $t("saveChanges") : $t("addNews") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Image Manager Modal -->
    <ImageManagerModal
      v-if="showImageManager"
      :show="showImageManager"
      :allow-multiple="false"
      @close="closeImageManager"
      @confirm="handleImageSelection"
      class="z-[60]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import type { NewsInput, UpdateNewsInput, News } from "@/types/news";
import type { ImageInfo } from "@/types/image";
import ImageManagerModal from "@/components/admin/image-manager/ImageManagerModal.vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  news: {
    type: Object as () => News | null,
    default: null,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", data: NewsInput | UpdateNewsInput): void;
  (e: "openImageManager"): void;
}>();

const getCurrentLanguage = (): string => {
  return sessionStorage.getItem("language") || "en";
};

// State management
const newsData = ref<UpdateNewsInput>({
  title: "",
  text: "",
  imageUrl: "",
  language: getCurrentLanguage(),
  isActive: true,
});

const resetForm = () => {
  newsData.value = {
    title: "",
    text: "",
    imageUrl: "",
    language: getCurrentLanguage(),
    isActive: true,
  };
};

const showImageManager = ref(false);

watch(
  () => props.news,
  (newValue) => {
    if (newValue) {
      newsData.value = {
        title: newValue.title || "",
        text: newValue.text || "",
        imageUrl: newValue.imageUrl || "",
        language: newValue.language || getCurrentLanguage(),
        isActive: newValue.isActive,
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

watch(
  () => props.show,
  (showValue) => {
    if (showValue) {
      if (!props.isEdit) {
        resetForm();
      }
    }
  }
);

// Image manager methods
const openImageManager = () => {
  showImageManager.value = true;
};

const closeImageManager = () => {
  showImageManager.value = false;
};

const handleImageSelection = (selectedImages: ImageInfo[]) => {
  if (selectedImages.length > 0) {
    newsData.value.imageUrl = selectedImages[0].url;
  }
  closeImageManager();
};

// Action handlers
const submitForm = () => {
  emit("submit", newsData.value);
  if (!props.isEdit) {
    resetForm();
  }
};

const close = () => {
  showImageManager.value = false;
  emit("close");
};

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      showImageManager.value = false;
    }
  }
);
</script>

<style>
.ql-editor {
  min-height: 150px;
}
</style>
