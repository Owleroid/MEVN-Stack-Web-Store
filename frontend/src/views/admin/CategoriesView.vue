<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header Section -->
    <div class="bg-white rounded-t-lg shadow-sm border-b border-gray-200">
      <div class="flex justify-between items-center px-6 py-4">
        <div class="text-lg font-semibold text-gray-800">
          {{ $t("categoriesList") }}
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium flex items-center"
        >
          <span class="mr-1">+</span> {{ $t("addNewCategory") }}
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-b-lg shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-12"
      >
        <div
          class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600">{{ $t("loading") }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center p-8 bg-red-50 text-red-600">
        <p>{{ error }}</p>
        <button
          @click="fetchCategories"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {{ $t("retry") }}
        </button>
      </div>

      <!-- Actual Table Content -->
      <div v-else>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th
                class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-16"
              >
                {{ $t("image") }}
              </th>
              <th
                class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
              >
                {{ $t("categoryName") }}
              </th>
              <th
                class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
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
              <td class="p-4 border-b border-gray-200">{{ category.name }}</td>
              <td class="p-4 border-b border-gray-200">
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(category)"
                    class="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                  >
                    {{ $t("editCategory") }}
                  </button>
                  <button
                    @click="confirmRemoveCategory(category._id ?? '')"
                    class="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    {{ $t("delete") }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <p
          v-if="categories.length === 0"
          class="text-center py-8 text-gray-500 italic"
        >
          {{ $t("noCategories") }}
        </p>
      </div>
    </div>

    <!-- Modals -->
    <DeleteCategoryModal
      :show="showDeleteModal"
      @confirmDelete="selectedCategoryId && removeCategory(selectedCategoryId)"
      @openReassignModal="
        showReassignModal = true;
        showDeleteModal = false;
      "
      @cancelRemove="cancelRemove"
    />
    <ReassignCategoryModal
      :show="showReassignModal"
      :categories="categories.filter((cat) => cat._id !== selectedCategoryId)"
      :selectedCategoryId="selectedCategoryId"
      @reassignAndRemoveCategory="reassignAndRemoveCategory"
      @cancelRemove="cancelRemove"
    />
    <AddEditCategoryModal
      :show="showAddEditModal"
      :mode="isEdit ? 'edit' : 'add'"
      :initialCategoryName="editCategoryName"
      :initialCategoryImageUrl="editCategoryImageUrl"
      :initialCategorySlug="editCategorySlug"
      @submitForm="submitForm"
      @cancelAction="cancelAddEdit"
    />
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
