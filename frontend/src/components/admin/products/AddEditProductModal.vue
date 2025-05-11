<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto py-4"
    @click="close"
  >
    <div
      class="bg-white rounded-lg w-11/12 max-w-2xl p-6 shadow-lg my-4"
      @click.stop
    >
      <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">
        {{ isEdit ? $t("editProduct") : $t("addNewProduct") }}
      </h3>

      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Product Name -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("productName") }}:
          </label>
          <input
            type="text"
            id="name"
            v-model="product.name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="generateSlugFromName"
          />
        </div>

        <!-- Product Slug -->
        <div>
          <label
            for="slug"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("slug") }}:
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              id="slug"
              v-model="product.slug"
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

        <!-- Price Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              for="priceRubles"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ $t("priceRubles") }}:
            </label>
            <input
              type="number"
              id="priceRubles"
              v-model="product.priceRubles"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              for="priceEuros"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              {{ $t("priceEuros") }}:
            </label>
            <input
              type="number"
              id="priceEuros"
              v-model="product.priceEuros"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Product Details -->
        <div>
          <label
            for="artist"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("artist") }}:
          </label>
          <input
            type="text"
            id="artist"
            v-model="product.artist"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            for="size"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("size") }}:
          </label>
          <input
            type="text"
            id="size"
            v-model="product.size"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            for="material"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("material") }}:
          </label>
          <input
            type="text"
            id="material"
            v-model="product.material"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            for="parts"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("parts") }}:
          </label>
          <input
            type="text"
            id="parts"
            v-model="product.parts"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            for="boxArt"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("boxArt") }}:
          </label>
          <input
            type="text"
            id="boxArt"
            v-model="product.boxArt"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("productDescription") }}:
          </label>
          <textarea
            id="description"
            v-model="product.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- Main Image -->
        <div>
          <label
            for="mainImageUrl"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("mainImageUrl") }}:
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              id="mainImageUrl"
              v-model="product.mainImageUrl"
              readonly
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
            <button
              type="button"
              @click="openImageManager(false)"
              class="px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              {{ $t("selectImage") }}
            </button>
          </div>

          <!-- Image Preview -->
          <div v-if="product.mainImageUrl" class="mt-2">
            <img
              :src="product.mainImageUrl"
              alt="Main product image"
              class="h-32 object-contain rounded-md border border-gray-200"
            />
          </div>
        </div>

        <!-- Secondary Images -->
        <div>
          <label
            for="secondaryImageUrls"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            {{ $t("secondaryImageUrls") }}:
          </label>
          <div class="flex gap-2">
            <textarea
              id="secondaryImageUrls"
              v-model="product.secondaryImageUrls"
              readonly
              rows="2"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            ></textarea>
            <button
              type="button"
              @click="openImageManager(true)"
              class="px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              {{ $t("selectImages") }}
            </button>
          </div>

          <!-- Secondary Images Preview -->
          <div
            v-if="product.secondaryImageUrls"
            class="mt-2 flex flex-wrap gap-2"
          >
            <img
              v-for="(url, index) in product.secondaryImageUrls.split(',')"
              :key="index"
              :src="url.trim()"
              alt="Secondary product image"
              class="h-24 object-contain rounded-md border border-gray-200"
            />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            {{ $t("cancel") }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {{ isEdit ? $t("updateProduct") : $t("addProduct") }}
          </button>
        </div>
      </form>

      <!-- Image Manager Modal -->
      <ImageManagerModal
        :show="showImageManager"
        :allowMultiple="allowMultiple"
        @close="closeImageManager"
        @confirm="handleImageSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import ImageManagerModal from "@/components/admin/image-manager/ImageManagerModal.vue";

// Props & Emits
const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  product: {
    type: Object,
    default: () => ({
      name: "",
      slug: "",
      priceRubles: 0,
      priceEuros: 0,
      artist: "",
      size: "",
      material: "",
      parts: "",
      boxArt: "",
      description: "",
      mainImageUrl: "",
      secondaryImageUrls: "",
    }),
  },
});

const emits = defineEmits(["close", "submitForm"]);

// State Management
const showImageManager = ref(false);
const allowMultiple = ref(false);

// Generate slug from product name
const generateSlugFromName = () => {
  if (props.product.name) {
    props.product.slug = props.product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
};

// Image Manager Methods
const openImageManager = (multiple: boolean) => {
  allowMultiple.value = multiple;
  showImageManager.value = true;
};

const closeImageManager = () => {
  showImageManager.value = false;
};

const handleImageSelection = (selectedImages: { url: string }[]) => {
  if (allowMultiple.value) {
    props.product.secondaryImageUrls = selectedImages
      .map((img) => img.url)
      .join(", ");
  } else {
    props.product.mainImageUrl = selectedImages[0]?.url || "";
  }
  closeImageManager();
};

// Form Actions
const close = () => {
  emits("close");
};

const submitForm = () => {
  emits("submitForm", props.product);
};
</script>
