<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section with Card -->
      <div class="mb-6">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <button
            @click="openAddModal"
            class="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center shadow-sm"
          >
            <span class="mr-1.5">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            {{ $t("addNewCategory") }}
          </button>
        </div>
      </div>

      <!-- Main Content Card -->
      <div
        class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
      >
        <!-- Loading State -->
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-16"
        >
          <div
            class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
          ></div>
          <p class="text-gray-600">{{ $t("loading") }}</p>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="p-8 bg-red-50 text-red-600 rounded-md m-4"
        >
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{{ error }}</p>
          </div>
          <button
            @click="fetchCategories"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {{ $t("retry") }}
          </button>
        </div>

        <!-- Table Content -->
        <div v-else>
          <!-- Empty State -->
          <div
            v-if="categories.length === 0"
            class="flex flex-col items-center justify-center py-16 px-4 text-center"
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
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p class="text-gray-500 text-lg mb-4">{{ $t("noCategories") }}</p>
            <button
              @click="openAddModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {{ $t("addNewCategory") }}
            </button>
          </div>

          <!-- Actual Table -->
          <div v-else class="overflow-x-auto">
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
                    {{ $t("categoryName") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-right font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-40"
                  >
                    {{ $t("actions") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="category in categories"
                  :key="category._id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="p-4 border-b border-gray-200">
                    <div
                      class="w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center"
                    >
                      <img
                        v-if="category.imageUrl"
                        :src="category.imageUrl"
                        :alt="category.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      <span v-else class="text-gray-400 text-xs">
                        {{ $t("noImage") }}
                      </span>
                    </div>
                  </td>
                  <td
                    class="p-4 border-b border-gray-200 font-medium text-gray-700"
                  >
                    {{ category.name }}
                  </td>
                  <td class="p-4 border-b border-gray-200">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="openEditModal(category)"
                        class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        :title="$t('editCategory')"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="confirmRemoveCategory(category._id ?? '')"
                        class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        :title="$t('delete')"
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
        </div>
      </div>

      <!-- Modals -->
      <transition name="fade" mode="out-in">
        <DeleteCategoryModal
          v-if="showDeleteModal"
          :show="showDeleteModal"
          @confirmDelete="
            selectedCategoryId && removeCategory(selectedCategoryId)
          "
          @openReassignModal="
            showReassignModal = true;
            showDeleteModal = false;
          "
          @cancelRemove="cancelRemove"
        />
      </transition>

      <transition name="fade" mode="out-in">
        <ReassignCategoryModal
          v-if="showReassignModal"
          :show="showReassignModal"
          :categories="
            categories.filter((cat) => cat._id !== selectedCategoryId)
          "
          :selectedCategoryId="selectedCategoryId"
          @reassignAndRemoveCategory="reassignAndRemoveCategory"
          @cancelRemove="cancelRemove"
        />
      </transition>

      <transition name="fade" mode="out-in">
        <AddEditCategoryModal
          v-if="showAddEditModal"
          :show="showAddEditModal"
          :mode="isEdit ? 'edit' : 'add'"
          :initialCategoryName="editCategoryName"
          :initialCategoryImageUrl="editCategoryImageUrl"
          :initialCategorySlug="editCategorySlug"
          @submitForm="submitForm"
          @cancelAction="cancelAddEdit"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

import { useEventBus } from "@/utils/eventBus";

import DeleteCategoryModal from "@/components/admin/categories/DeleteCategoryModal.vue";
import ReassignCategoryModal from "@/components/admin/categories/ReassignCategoryModal.vue";
import AddEditCategoryModal from "@/components/admin/categories/AddEditCategoryModal.vue";

import type { Category } from "@/types/category";

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryAndReassignProducts,
} from "@/services/categoryService";

// Composables Setup
const { t } = useI18n();
const toast = useToast();
const { on } = useEventBus();

// State Management
// Data state
const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref("");

// UI state
const showDeleteModal = ref(false);
const showReassignModal = ref(false);
const showAddEditModal = ref(false);
const isEdit = ref(false);

// Form state
const selectedCategoryId = ref<string | undefined>(undefined);
const newCategoryId = ref<string | null>(null);
const editCategoryName = ref("");
const editCategoryImageUrl = ref("");
const editCategorySlug = ref("");

// UI Helpers
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "/images/placeholder-category.png";
};

// Data Fetching
const fetchCategories = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAllCategories();
    categories.value = response.categories;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    error.value = errorMessage || t("fetchCategoriesError");
    console.error("Failed to fetch categories:", err);
  } finally {
    loading.value = false;
  }
};

// Reset form fields helper function to avoid duplication
const resetFormFields = () => {
  selectedCategoryId.value = undefined;
  editCategoryName.value = "";
  editCategoryImageUrl.value = "";
  editCategorySlug.value = "";
  isEdit.value = false;
};

// Modal Management
const openAddModal = () => {
  resetFormFields();

  showAddEditModal.value = true;
};

const openEditModal = (category: Category) => {
  isEdit.value = true;

  // Set form data
  selectedCategoryId.value = category._id;
  editCategoryName.value = category.name;
  editCategoryImageUrl.value = category.imageUrl || "";
  editCategorySlug.value = category.slug || "";

  // Then open modal
  showAddEditModal.value = true;
};

const confirmRemoveCategory = (id: string) => {
  selectedCategoryId.value = id;
  showDeleteModal.value = true;
};

const cancelAddEdit = () => {
  showAddEditModal.value = false;

  setTimeout(() => {
    resetFormFields();
  }, 100);
};

const cancelRemove = () => {
  showDeleteModal.value = false;
  showReassignModal.value = false;
  selectedCategoryId.value = undefined;
  newCategoryId.value = null;
};

// CRUD Operations
const submitForm = async (
  formData: Pick<Category, "name" | "imageUrl" | "slug">
) => {
  try {
    if (isEdit.value && selectedCategoryId.value) {
      await updateCategory(selectedCategoryId.value, formData);
      toast.success(t("updateCategorySuccess"));
    } else {
      await createCategory(formData);
      toast.success(t("addCategorySuccess"));
    }

    showAddEditModal.value = false;

    fetchCategories();

    setTimeout(() => {
      resetFormFields();
    }, 100);
  } catch (error) {
    const errorMessage = isEdit.value
      ? t("updateCategoryError")
      : t("addCategoryError");
    toast.error(errorMessage);
    console.error("Failed to submit category form:", error);
  }
};

const removeCategory = async (id: string) => {
  try {
    await deleteCategory(id);
    fetchCategories();
    toast.success(t("removeCategorySuccess"));
  } catch (error) {
    toast.error(t("removeCategoryError"));
    console.error("Failed to remove category:", error);
  } finally {
    showDeleteModal.value = false;
    selectedCategoryId.value = undefined;
  }
};

const reassignAndRemoveCategory = async (newCategoryId: string) => {
  try {
    if (selectedCategoryId.value && newCategoryId) {
      await deleteCategoryAndReassignProducts(
        selectedCategoryId.value,
        newCategoryId
      );
      fetchCategories();
      toast.success(t("reassignAndRemoveCategorySuccess"));
    } else {
      toast.error(t("reassignAndRemoveCategoryError"));
    }
  } catch (error) {
    toast.error(t("reassignAndRemoveCategoryError"));
    console.error("Failed to reassign and remove category:", error);
  } finally {
    showReassignModal.value = false;
    selectedCategoryId.value = undefined;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchCategories();
  on("categoryAdded", fetchCategories);
  on("categoryUpdated", fetchCategories);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
