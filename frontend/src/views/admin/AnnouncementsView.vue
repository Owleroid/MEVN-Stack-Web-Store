<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Add Announcement Section -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6"
      >
        <!-- Section Header -->
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ $t("addAnnouncement") }}
          </h2>
        </div>

        <div class="p-4">
          <!-- Search input -->
          <div class="mb-4">
            <input
              v-model="searchQuery"
              @input="searchProductsHandler"
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              :placeholder="$t('searchProducts')"
              type="text"
            />
          </div>

          <!-- Search results -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 transform -translate-y-4"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform -translate-y-4"
          >
            <div
              v-if="searchResults.length > 0"
              class="mt-4 border border-gray-200 rounded-md overflow-hidden shadow-sm"
            >
              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="product in searchResults"
                  :key="product._id"
                  @click="selectProduct(product)"
                  class="p-3 flex items-center gap-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                    <img
                      v-if="product.imageUrls?.main"
                      :src="product.imageUrls.main"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-gray-400 text-xs"
                    >
                      {{ $t("noImage") }}
                    </div>
                  </div>
                  <div>
                    <div class="font-medium">{{ product.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- New announcement form -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 transform scale-95"
            enter-to-class="opacity-100 transform scale-100"
            leave-from-class="opacity-100 transform scale-100"
            leave-to-class="opacity-0 transform scale-95"
          >
            <div
              v-if="selectedProduct"
              class="mt-4 bg-blue-50 rounded-md border border-blue-200 overflow-hidden"
            >
              <!-- Header -->
              <div class="bg-blue-100 px-4 py-3 border-b border-blue-200">
                <h3 class="font-medium text-blue-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                    />
                  </svg>
                  {{ selectedProduct.name }}
                </h3>
              </div>

              <div class="p-4">
                <div class="flex gap-6">
                  <!-- Image preview section -->
                  <div class="w-40">
                    <div
                      class="bg-white rounded-md border border-gray-200 p-1 shadow-sm"
                    >
                      <div
                        class="aspect-square rounded overflow-hidden bg-gray-100"
                      >
                        <img
                          v-if="selectedImage"
                          :src="selectedImage"
                          :alt="selectedProduct.name"
                          class="w-full h-full object-cover"
                        />
                        <div
                          v-else
                          class="w-full h-full flex items-center justify-center text-gray-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-10 w-10"
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
                        </div>
                      </div>
                    </div>

                    <!-- Image source indicators -->
                    <div class="mt-2 flex gap-1">
                      <div
                        class="w-2 h-2 rounded-full mt-1"
                        :class="selectedImage ? 'bg-green-500' : 'bg-gray-300'"
                      ></div>
                      <span class="text-xs text-gray-500">
                        {{
                          selectedImage
                            ? $t("imageSelected")
                            : $t("noImageSelected")
                        }}
                      </span>
                    </div>
                  </div>

                  <!-- Form controls -->
                  <div class="flex-1">
                    <!-- Image selection dropdown -->
                    <div class="mb-4">
                      <label
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {{ $t("selectProductImage") }}
                      </label>
                      <div class="flex gap-2">
                        <select
                          v-model="selectedImage"
                          class="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option :value="selectedProduct.imageUrls.main">
                            {{ $t("mainImage") }}
                          </option>
                          <option
                            v-for="(url, index) in selectedProduct.imageUrls
                              .secondary"
                            :key="index"
                            :value="url"
                          >
                            {{ $t("secondaryImage") }} {{ index + 1 }}
                          </option>
                        </select>

                        <!-- Image Manager Button - Inline -->
                        <button
                          @click="openImageManager"
                          class="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors shadow-sm flex items-center justify-center"
                          :title="$t('chooseFromImageManager')"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
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
                        </button>
                      </div>
                    </div>

                    <!-- Action buttons -->
                    <div class="flex gap-3 mt-4">
                      <button
                        @click="cancelSelection"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors shadow-sm flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-1.5"
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
                        {{ $t("cancel") }}
                      </button>
                      <button
                        @click="createAnnouncement"
                        :disabled="!selectedImage || creatingAnnouncement"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <svg
                          v-if="!creatingAnnouncement"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <div
                          v-if="creatingAnnouncement"
                          class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                        ></div>
                        {{ $t("createAnnouncement") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Announcements List -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ $t("currentAnnouncements") }}
          </h2>
        </div>

        <transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <!-- Loading state -->
          <div
            v-if="loadingAnnouncements"
            class="flex-1 flex items-center justify-center py-16"
            key="loading-state"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"
              ></div>
              <p class="text-gray-600 text-sm">
                {{ $t("loadingAnnouncements") }}
              </p>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="announcements.length === 0"
            class="flex-1 flex flex-col items-center justify-center py-16"
            key="empty-state"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            <p class="text-gray-500 text-lg mb-1">
              {{ $t("noAnnouncements") }}
            </p>
          </div>

          <!-- Announcements table -->
          <div v-else class="overflow-x-auto" key="announcements-table">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-20"
                  >
                    {{ $t("image") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("product") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-36"
                  >
                    {{ $t("date") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-28"
                  >
                    {{ $t("status") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-right font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-28"
                  >
                    {{ $t("actions") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(announcement, index) in announcements"
                  :key="announcement._id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{
                      'border-b-0': index === announcements.length - 1,
                    }"
                  >
                    <div
                      class="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200"
                    >
                      <img
                        :src="announcement.imageUrl"
                        :alt="announcement.product.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td
                    class="p-4 border-b border-gray-200 font-medium text-gray-700"
                    :class="{
                      'border-b-0': index === announcements.length - 1,
                    }"
                  >
                    {{ announcement.product.name }}
                  </td>
                  <td
                    class="p-4 border-b border-gray-200 text-sm text-gray-500"
                    :class="{
                      'border-b-0': index === announcements.length - 1,
                    }"
                  >
                    {{ formatDate(announcement.createdAt) }}
                  </td>
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{
                      'border-b-0': index === announcements.length - 1,
                    }"
                  >
                    <div class="flex items-center">
                      <div class="relative inline-block mr-2">
                        <input
                          type="checkbox"
                          :checked="announcement.isActive"
                          @change="
                            toggleAnnouncementStatus(
                              announcement._id,
                              !announcement.isActive
                            )
                          "
                          class="sr-only"
                          :disabled="updatingStatusId === announcement._id"
                        />
                        <div
                          class="relative w-10 h-5 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out cursor-pointer"
                          :class="{ 'bg-green-500': announcement.isActive }"
                          @click="
                            toggleAnnouncementStatus(
                              announcement._id,
                              !announcement.isActive
                            )
                          "
                        >
                          <div
                            class="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm"
                            :class="{ 'translate-x-5': announcement.isActive }"
                            :style="{
                              opacity:
                                updatingStatusId === announcement._id
                                  ? '0.7'
                                  : '1',
                            }"
                          ></div>
                        </div>
                      </div>
                      <div class="w-16 text-center">
                        <span
                          class="inline-block px-2 py-1 rounded-full text-xs font-medium min-w-[60px]"
                          :class="
                            announcement.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          "
                        >
                          {{
                            announcement.isActive
                              ? $t("active")
                              : $t("inactive")
                          }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{
                      'border-b-0': index === announcements.length - 1,
                    }"
                  >
                    <div class="flex justify-end gap-2">
                      <button
                        @click="startImageEdit(announcement)"
                        class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                        :title="$t('changeImage')"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
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
                      </button>
                      <button
                        @click="showDeleteConfirmation(announcement._id)"
                        :disabled="deletingAnnouncementId === announcement._id"
                        class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center"
                        :title="$t('delete')"
                      >
                        <div
                          v-if="deletingAnnouncementId === announcement._id"
                          class="inline-block animate-spin rounded-full h-3 w-3 border-2 border-red-600 border-t-transparent"
                        ></div>
                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    appear
  >
    <delete-confirmation-modal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :title="$t('confirmDeleteTitle')"
      :message="$t('confirmDeleteAnnouncement')"
      :confirm-text="$t('confirmDelete')"
      :cancel-text="$t('cancel')"
      :is-loading="deletingAnnouncementId !== null"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </transition>

  <!-- Image Edition Modal -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    appear
  >
    <image-edition-modal
      v-if="showImageModal"
      :show="showImageModal"
      :announcement="editingAnnouncement"
      :initial-image="selectedEditImage"
      :is-loading="updatingImage"
      @cancel="closeImageModal"
      @save="saveImageEdit"
      @open-image-manager="openImageManager"
    />
  </transition>

  <!-- Image Manager Modal -->
  <admin-image-manager-modal
    v-if="showImageManagerModal"
    :show="showImageManagerModal"
    :allow-multiple="false"
    @close="closeImageManagerModal"
    @confirm="handleImageManagerConfirm"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import debounce from "lodash/debounce";

import AdminImageManagerModal from "@/components/admin/image-manager/ImageManagerModal.vue";
import DeleteConfirmationModal from "@/components/admin/announcements/DeleteConfirmationModal.vue";
import ImageEditionModal from "@/components/admin/announcements/ImageEditionModal.vue";

import type { Product } from "@/types/products";
import type { Announcement } from "@/types/announcement";
import type { ImageInfo } from "@/types/image";

import { searchProducts } from "@/services/productService";
import {
  getAllAnnouncements,
  createAnnouncement as createAnnouncementService,
  updateAnnouncementStatus,
  updateAnnouncementImage,
  deleteAnnouncement as deleteAnnouncementService,
} from "@/services/announcementService";

// Composables
const toast = useToast();
const { t } = useI18n();

// State for product search and selection
const searchQuery = ref("");
const searchResults = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);
const selectedImage = ref<string>("");

// State for image manager
const showImageManagerModal = ref(false);
const isEditingImage = ref(false);

// State for announcements
const announcements = ref<Announcement[]>([]);
const loadingAnnouncements = ref(false);
const creatingAnnouncement = ref(false);
const updatingStatusId = ref<string | null>(null);
const deletingAnnouncementId = ref<string | null>(null);

// Image editing state
const showImageModal = ref(false);
const editingAnnouncement = ref<Announcement | null>(null);
const selectedEditImage = ref<string>("");
const updatingImage = ref(false);

// Delete confirmation modal state
const showDeleteModal = ref(false);
const announcementToDelete = ref<string | null>(null);

// Search for products
const searchProductsHandler = debounce(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    const { success, products } = await searchProducts(searchQuery.value);
    if (success) {
      searchResults.value = products;
    }
  } catch (error) {
    console.error("Error searching products:", error);
    toast.error(t("searchProductsError"));
  }
}, 300);

// Select a product for creating announcement
const selectProduct = (product: Product) => {
  selectedProduct.value = product;
  selectedImage.value = product.imageUrls.main;
  searchResults.value = [];
};

// Cancel product selection
const cancelSelection = () => {
  selectedProduct.value = null;
  selectedImage.value = "";
};

// Create a new announcement
const createAnnouncement = async () => {
  if (!selectedProduct.value || !selectedImage.value) return;

  creatingAnnouncement.value = true;

  try {
    const { success } = await createAnnouncementService({
      productId: selectedProduct.value._id,
      imageUrl: selectedImage.value,
    });

    if (success) {
      toast.success(t("announcementCreated"));
      selectedProduct.value = null;
      selectedImage.value = "";
      await fetchAnnouncements();
    }
  } catch (error) {
    console.error("Error creating announcement:", error);
    toast.error(t("createAnnouncementError"));
  } finally {
    creatingAnnouncement.value = false;
  }
};

// Fetch all announcements
const fetchAnnouncements = async () => {
  loadingAnnouncements.value = true;

  try {
    const { success, announcements: fetchedAnnouncements } =
      await getAllAnnouncements();
    if (success) {
      announcements.value = fetchedAnnouncements;
    }
  } catch (error) {
    console.error("Error fetching announcements:", error);
    toast.error(t("fetchAnnouncementsError"));
  } finally {
    loadingAnnouncements.value = false;
  }
};

// Toggle announcement active status
const toggleAnnouncementStatus = async (
  announcementId: string,
  isActive: boolean
) => {
  updatingStatusId.value = announcementId;

  try {
    const { success } = await updateAnnouncementStatus(announcementId, {
      isActive,
    });

    if (success) {
      // Update the local state
      const index = announcements.value.findIndex(
        (a) => a._id === announcementId
      );
      if (index !== -1) {
        announcements.value[index].isActive = isActive;
      }

      toast.success(
        isActive ? t("announcementActivated") : t("announcementDeactivated")
      );
    }
  } catch (error) {
    console.error("Error updating announcement status:", error);
    toast.error(t("updateStatusError"));
  } finally {
    updatingStatusId.value = null;
  }
};

// Start editing announcement image
const startImageEdit = (announcement: Announcement) => {
  editingAnnouncement.value = announcement;
  selectedEditImage.value = announcement.imageUrl;
  showImageModal.value = true;
};

// Close image edit modal
const closeImageModal = () => {
  showImageModal.value = false;
  editingAnnouncement.value = null;
  selectedEditImage.value = "";
};

// Open image manager
const openImageManager = () => {
  showImageManagerModal.value = true;
  isEditingImage.value = !!editingAnnouncement.value;
};

// Close image manager modal
const closeImageManagerModal = () => {
  showImageManagerModal.value = false;
};

// Handle image selection from image manager
const handleImageManagerConfirm = (selectedImages: ImageInfo[]) => {
  if (selectedImages.length > 0) {
    const imageUrl = selectedImages[0].url;

    if (isEditingImage.value && editingAnnouncement.value) {
      selectedEditImage.value = imageUrl;
    } else {
      selectedImage.value = imageUrl;
    }
  }

  showImageManagerModal.value = false;
};

// Save edited image
const saveImageEdit = async (newImageUrl: string) => {
  if (!editingAnnouncement.value || !newImageUrl) return;

  updatingImage.value = true;

  try {
    const { success } = await updateAnnouncementImage(
      editingAnnouncement.value._id,
      {
        imageUrl: newImageUrl,
      }
    );

    if (success) {
      // Update the local state
      const index = announcements.value.findIndex(
        (a) => a._id === editingAnnouncement.value?._id
      );
      if (index !== -1) {
        announcements.value[index].imageUrl = newImageUrl;
      }

      toast.success(t("announcementImageUpdated"));
      closeImageModal();
    }
  } catch (error) {
    console.error("Error updating announcement image:", error);
    toast.error(t("updateImageError"));
  } finally {
    updatingImage.value = false;
  }
};

// Show delete confirmation modal
const showDeleteConfirmation = (announcementId: string) => {
  announcementToDelete.value = announcementId;
  showDeleteModal.value = true;
};

// Close delete confirmation modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  announcementToDelete.value = null;
};

// Confirm and execute delete
const confirmDelete = async () => {
  if (!announcementToDelete.value) return;

  deletingAnnouncementId.value = announcementToDelete.value;

  try {
    const { success } = await deleteAnnouncementService(
      announcementToDelete.value
    );

    if (success) {
      // Update the local state
      announcements.value = announcements.value.filter(
        (a) => a._id !== announcementToDelete.value
      );

      toast.success(t("announcementDeleted"));
      closeDeleteModal();
    }
  } catch (error) {
    console.error("Error deleting announcement:", error);
    toast.error(t("deleteAnnouncementError"));
  } finally {
    deletingAnnouncementId.value = null;
  }
};

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(
    document.documentElement.lang === "ru" ? "ru-RU" : "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );
};

// Initialize the component
onMounted(() => {
  fetchAnnouncements();
});
</script>
