<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click="cancelAction"
  >
    <div class="bg-white rounded-lg w-11/12 max-w-md p-6 shadow-lg" @click.stop>
      <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">
        {{ mode === "add" ? $t("addNewCategory") : $t("editCategory") }}
      </h2>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Category Name -->
        <div>
          <label
            for="categoryName"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("categoryName") }}
          </label>
          <input
            type="text"
            id="categoryName"
            v-model="categoryName"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="generateSlugFromName"
          />
        </div>

        <!-- Category Slug -->
        <div>
          <label
            for="categorySlug"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("slug") }}
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              id="categorySlug"
              v-model="categorySlug"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              @click="generateSlugFromName"
              class="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              {{ $t("generate") }}
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            {{ $t("slugHelpText") }}
          </p>
        </div>

        <!-- Category Image -->
        <div>
          <label
            for="categoryImage"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("categoryImage") }}
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              id="categoryImage"
              v-model="categoryImageUrl"
              readonly
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
            <button
              type="button"
              @click="openImageManager"
              class="px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              {{ $t("selectImage") }}
            </button>
          </div>
        </div>

        <!-- Preview Image if available -->
        <div v-if="categoryImageUrl" class="flex justify-center">
          <img
            :src="categoryImageUrl"
            alt="Category preview"
            class="h-32 object-cover rounded-md border border-gray-200"
          />
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="cancelAction"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            {{ $t("cancel") }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {{ mode === "add" ? $t("addCategory") : $t("updateCategory") }}
          </button>
        </div>
      </form>

      <!-- Image Manager Modal -->
      <ImageManagerModal
        :show="showImageManager"
        :allowMultiple="false"
        @close="closeImageManager"
        @confirm="handleImageSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import ImageManagerModal from "@/components/admin/image-manager/ImageManagerModal.vue";

// Props & Emits
const props = defineProps({
  show: Boolean,
  mode: {
    type: String,
    required: true,
    validator: (value: string) => ["add", "edit"].includes(value),
  },
  initialCategoryName: {
    type: String,
    default: "",
  },
  initialCategoryImageUrl: {
    type: String,
    default: "",
  },
  initialCategorySlug: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["submitForm", "cancelAction"]);

// State Management
// Form state
const categoryName = ref(props.initialCategoryName);
const categoryImageUrl = ref(props.initialCategoryImageUrl);
const categorySlug = ref(props.initialCategorySlug);

// UI state
const showImageManager = ref(false);

// Watchers
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      categoryName.value = props.initialCategoryName;
      categoryImageUrl.value = props.initialCategoryImageUrl;
      categorySlug.value = props.initialCategorySlug;
    }
  }
);

// Generate slug from category name
const generateSlugFromName = () => {
  if (categoryName.value) {
    categorySlug.value = categoryName.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
};

// Image Manager Functions
const openImageManager = () => {
  showImageManager.value = true;
};

const closeImageManager = () => {
  showImageManager.value = false;
};

const handleImageSelection = (selectedImages: { url: string }[]) => {
  if (selectedImages.length > 0) {
    categoryImageUrl.value = selectedImages[0].url;
  }
  closeImageManager();
};

// Form Actions
const submitForm = () => {
  emits("submitForm", {
    name: categoryName.value,
    imageUrl: categoryImageUrl.value,
    slug: categorySlug.value,
  });
};

const cancelAction = () => {
  emits("cancelAction");
};
</script>
