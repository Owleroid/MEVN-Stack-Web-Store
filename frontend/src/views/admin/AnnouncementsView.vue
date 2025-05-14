<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
      <!-- Product Search Section -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">
          {{ $t("addAnnouncement") }}
        </h2>

        <!-- Search input -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            @input="searchProducts"
            class="w-full p-2 border border-gray-300 rounded-md"
            :placeholder="$t('searchProducts')"
            type="text"
          />
        </div>

        <!-- Search results -->
        <div
          v-if="searchResults.length > 0"
          class="mt-4 border border-gray-200 rounded-md overflow-hidden"
        >
          <div class="max-h-60 overflow-y-auto">
            <div
              v-for="product in searchResults"
              :key="product._id"
              @click="selectProduct(product)"
              class="p-3 flex items-center gap-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
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

        <!-- New announcement form -->
        <div
          v-if="selectedProduct"
          class="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200"
        >
          <div class="flex gap-4 items-start">
            <div class="w-20 h-20 bg-gray-100 rounded overflow-hidden">
              <img
                v-if="selectedImage"
                :src="selectedImage"
                :alt="selectedProduct.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <h3 class="font-medium mb-2">{{ selectedProduct.name }}</h3>

              <!-- Image selection dropdown -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ $t("selectImage") }}
                </label>
                <select
                  v-model="selectedImage"
                  class="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option :value="selectedProduct.imageUrls.main">
                    {{ $t("mainImage") }}
                  </option>
                  <option
                    v-for="(url, index) in selectedProduct.imageUrls.secondary"
                    :key="index"
                    :value="url"
                  >
                    {{ $t("secondaryImage") }} {{ index + 1 }}
                  </option>
                </select>
              </div>

              <!-- Image Manager Button -->
              <button
                @click="openImageManager"
                class="mb-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                {{ $t("chooseFromImageManager") }}
              </button>

              <div class="flex gap-2">
                <button
                  @click="createAnnouncement"
                  :disabled="!selectedImage || creatingAnnouncement"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <div
                    v-if="creatingAnnouncement"
                    class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                  ></div>
                  {{ $t("createAnnouncement") }}
                </button>
                <button
                  @click="cancelSelection"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {{ $t("cancel") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Announcements List -->
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">
        {{ $t("currentAnnouncements") }}
      </h2>

      <!-- Loading state -->
      <div v-if="loadingAnnouncements" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"
        ></div>
        <p class="mt-4 text-gray-500">{{ $t("loadingAnnouncements") }}</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="announcements.length === 0" class="text-center py-12">
        <p class="text-gray-500">{{ $t("noAnnouncements") }}</p>
      </div>

      <!-- Announcements list -->
      <div v-else class="space-y-4">
        <div
          v-for="announcement in announcements"
          :key="announcement._id"
          class="border border-gray-200 rounded-lg overflow-hidden"
        >
          <div class="p-4 flex flex-wrap gap-6">
            <!-- Product image -->
            <div class="w-full sm:w-auto">
              <div
                class="w-full sm:w-40 h-40 bg-gray-100 rounded overflow-hidden mx-auto"
              >
                <img
                  :src="announcement.imageUrl"
                  :alt="announcement.product.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <!-- Announcement details -->
            <div class="flex-1">
              <h3 class="text-lg font-medium mb-2">
                {{ announcement.product.name }}
              </h3>

              <div class="flex flex-wrap gap-2 justify-between items-center">
                <div class="flex gap-2">
                  <button
                    @click="startImageEdit(announcement)"
                    class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {{ $t("changeImage") }}
                  </button>
                  <button
                    @click="showDeleteConfirmation(announcement._id)"
                    :disabled="deletingAnnouncementId === announcement._id"
                    class="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <div
                      v-if="deletingAnnouncementId === announcement._id"
                      class="inline-block animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"
                    ></div>
                    {{ $t("delete") }}
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500">{{
                    formatDate(announcement.createdAt)
                  }}</span>
                  <div class="relative inline-block">
                    <label class="flex items-center cursor-pointer">
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
                        class="relative w-10 h-5 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out"
                        :class="{ 'bg-green-500': announcement.isActive }"
                      >
                        <div
                          class="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out"
                          :class="{ 'translate-x-5': announcement.isActive }"
                          :style="{
                            opacity:
                              updatingStatusId === announcement._id
                                ? '0.7'
                                : '1',
                          }"
                        ></div>
                      </div>
                      <span class="ml-2 text-sm">
                        {{
                          announcement.isActive ? $t("active") : $t("inactive")
                        }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <delete-confirmation-modal
    :show="showDeleteModal"
    :title="$t('confirmDeleteTitle')"
    :message="$t('confirmDeleteAnnouncement')"
    :confirm-text="$t('confirmDelete')"
    :cancel-text="$t('cancel')"
    :is-loading="deletingAnnouncementId !== null"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />

  <!-- Image Edition Modal -->
  <image-edition-modal
    :show="showImageModal"
    :announcement="editingAnnouncement"
    :initial-image="selectedEditImage"
    :is-loading="updatingImage"
    @cancel="closeImageModal"
    @save="saveImageEdit"
    @open-image-manager="openImageManager"
  />

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

import { searchProductsByName } from "@/services/productService";
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
const searchProducts = debounce(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    const { success, products } = await searchProductsByName(searchQuery.value);
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
