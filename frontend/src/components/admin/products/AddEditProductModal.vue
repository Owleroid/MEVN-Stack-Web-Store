<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center z-50 overflow-y-auto py-4"
    @click="close"
  >
    <div
      class="bg-white rounded-2xl w-11/12 max-w-2xl shadow-2xl border border-gray-200 my-4 max-h-[90vh] overflow-y-auto relative"
      @click.stop
    >
      <!-- Modal Header -->
      <div
        class="p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10"
      >
        <h3 class="text-2xl font-extrabold text-gray-800 text-center w-full">
          {{ isEdit ? $t("editProduct") : $t("addNewProduct") }}
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
      <div class="p-6 bg-white">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Product Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >{{ $t("productName") }}:</label
            >
            <input
              type="text"
              id="name"
              v-model="product.name"
              required
              placeholder="e.g. US Marine Infantryman"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              @input="generateSlugFromName"
            />
          </div>

          <!-- Product Slug -->
          <div>
            <label
              for="slug"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >{{ $t("slug") }}:</label
            >
            <div class="flex gap-2">
              <input
                type="text"
                id="slug"
                v-model="product.slug"
                required
                placeholder="us-marine-infantryman"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
              <button
                type="button"
                @click="generateSlugFromName"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition flex items-center gap-1 shadow-sm"
              >
                <span class="material-icons text-base" aria-hidden="true"
                  >autorenew</span
                >
                <span>{{ $t("generate") }}</span>
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">{{ $t("slugHelpText") }}</p>
          </div>

          <!-- Product Number -->
          <div>
            <label
              for="productNumber"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >{{ $t("productNumber") }}:</label
            >
            <div class="flex gap-2">
              <input
                type="text"
                id="productNumber"
                v-model="product.productNumber"
                required
                placeholder="e.g. 8D91LA"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
              <button
                type="button"
                @click="generateProductNumber"
                class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition flex items-center gap-1 shadow-sm"
              >
                <span class="material-icons text-base" aria-hidden="true"
                  >confirmation_number</span
                >
                <span>{{ $t("generate") }}</span>
              </button>
            </div>
          </div>

          <!-- Price Section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                for="priceRubles"
                class="block text-sm font-semibold text-gray-700 mb-1"
                >{{ $t("priceRubles") }}:</label
              >
              <input
                type="number"
                id="priceRubles"
                v-model="product.priceRubles"
                required
                placeholder="e.g. 5000"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
            </div>
            <div>
              <label
                for="priceEuros"
                class="block text-sm font-semibold text-gray-700 mb-1"
                >{{ $t("priceEuros") }}:</label
              >
              <input
                type="number"
                id="priceEuros"
                v-model="product.priceEuros"
                required
                placeholder="e.g. 100"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
            </div>
          </div>

          <!-- Product Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                for="artist"
                class="block text-sm font-semibold text-gray-700 mb-1"
                >{{ $t("artist") }}:</label
              >
              <input
                type="text"
                id="artist"
                v-model="product.artist"
                placeholder="e.g. John Doe"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
            </div>
            <div>
              <label
                for="size"
                class="block text-sm font-semibold text-gray-700 mb-1"
                >{{ $t("size") }}:</label
              >
              <input
                type="text"
                id="size"
                v-model="product.size"
                required
                placeholder="e.g. 54mm"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
            </div>
            <div>
              <label
                for="material"
                class="block text-sm font-semibold text-gray-700 mb-1"
                >{{ $t("material") }}:</label
              >
              <input
                type="text"
                id="material"
                v-model="product.material"
                required
                placeholder="e.g. Resin"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
            </div>
            <div>
              <label
                for="parts"
                class="block text-sm font-semibold text-gray-700 mb-1"
                >{{ $t("parts") }}:</label
              >
              <input
                type="text"
                id="parts"
                v-model="product.parts"
                placeholder="e.g. 5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
            </div>
            <div class="sm:col-span-2">
              <label
                for="boxArt"
                class="block text-sm font-semibold text-gray-700 mb-1"
                >{{ $t("boxArt") }}:</label
              >
              <input
                type="text"
                id="boxArt"
                v-model="product.boxArt"
                required
                placeholder="e.g. Classic WWII Art"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
              />
            </div>
          </div>

          <!-- Description -->
          <div>
            <label
              for="description"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >{{ $t("productDescription") }}:</label
            >
            <textarea
              id="description"
              v-model="product.description"
              rows="4"
              placeholder="Enter a detailed product description..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-gray-50 transition"
            ></textarea>
          </div>

          <!-- Main Image -->
          <div>
            <label
              for="mainImageUrl"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >{{ $t("mainImageUrl") }}:</label
            >
            <!-- Main Image Preview -->
            <div v-if="product.mainImageUrl" class="mb-2">
              <div
                class="bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col items-center"
              >
                <span class="text-xs text-gray-500 mb-1">Preview</span>
                <img
                  :src="product.mainImageUrl"
                  alt="Main product image"
                  class="h-32 object-contain rounded-lg border border-gray-200 shadow-md bg-white"
                />
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <input
                type="text"
                id="mainImageUrl"
                v-model="product.mainImageUrl"
                readonly
                placeholder="Paste or select image URL"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-700"
              />
              <button
                type="button"
                @click="openImageManager(false)"
                class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-1 shadow-sm"
              >
                <span class="material-icons text-base" aria-hidden="true"
                  >image</span
                >
                <span>{{ $t("selectImage") }}</span>
              </button>
            </div>
          </div>

          <!-- Secondary Images -->
          <div>
            <label
              for="secondaryImageUrls"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >{{ $t("secondaryImageUrls") }}:</label
            >
            <!-- Secondary Images Preview -->
            <div v-if="product.secondaryImageUrls" class="mb-2">
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-2">
                <span class="text-xs text-gray-500 mb-1 block">Preview</span>
                <div class="flex flex-wrap gap-2">
                  <img
                    v-for="(url, index) in product.secondaryImageUrls.split(
                      ','
                    )"
                    :key="index"
                    :src="url.trim()"
                    alt="Secondary product image"
                    class="h-24 object-contain rounded-lg border border-gray-200 shadow-md bg-white"
                  />
                </div>
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <textarea
                id="secondaryImageUrls"
                v-model="product.secondaryImageUrls"
                readonly
                rows="2"
                placeholder="Paste or select image URLs, separated by commas"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-700"
              ></textarea>
              <button
                type="button"
                @click="openImageManager(true)"
                class="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-1 shadow-sm"
              >
                <span class="material-icons text-base" aria-hidden="true"
                  >collections</span
                >
                <span>{{ $t("selectImages") }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Form Actions -->
      <div
        class="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white rounded-b-2xl"
      >
        <button
          type="button"
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
        >
          {{ $t("cancel") }}
        </button>
        <button
          type="button"
          @click="submitForm"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-md"
        >
          {{ isEdit ? $t("updateProduct") : $t("addProduct") }}
        </button>
      </div>

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
      productNumber: "",
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

const generateSlugFromName = () => {
  if (props.product.name) {
    props.product.slug = props.product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
};

const generateProductNumber = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  props.product.productNumber = result;
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
