<template>
  <div class="admin-categories-container">
    <div class="categories-menu">
      <h2>{{ $t("categories") }}</h2>
      <button @click="openAddModal" class="add-category-button">
        {{ $t("addNewCategory") }}
      </button>
    </div>
    <div class="categories-list">
      <table>
        <thead>
          <tr>
            <th>{{ $t("categoryName") }}</th>
            <th>{{ $t("actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category._id">
            <td>{{ category.name }}</td>
            <td class="actions">
              <button @click="openEditModal(category)">
                {{ $t("editCategory") }}
              </button>
              <button @click="confirmRemoveCategory(category._id ?? '')">
                {{ $t("delete") }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
      @submitForm="submitForm"
      @cancelAction="cancelAddEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

import DeleteCategoryModal from "@/components/admin/categories/DeleteCategoryModal.vue";
import ReassignCategoryModal from "@/components/admin/categories/ReassignCategoryModal.vue";
import AddEditCategoryModal from "@/components/admin/categories/AddEditCategoryModal.vue";

import type { Category } from "@/types/categories";

import {
  getAllCategories,
  deleteCategory,
  deleteCategoryAndReassignProducts,
  createCategory,
  updateCategory,
} from "@/services/categoryService";

import { useEventBus } from "@/utils/eventBus";

const { t } = useI18n();
const categories = ref<Category[]>([]);
const { on } = useEventBus();
const toast = useToast();

const showDeleteModal = ref(false);
const showReassignModal = ref(false);
const showAddEditModal = ref(false);
const selectedCategoryId = ref<string | undefined>(undefined);
const newCategoryId = ref<string | null>(null);
const editCategoryName = ref("");
const editCategoryImageUrl = ref("");
const isEdit = ref(false);

const fetchCategories = async () => {
  try {
    const response = await getAllCategories();
    categories.value = response.data.categories;
  } catch (error) {
    toast.error(t("fetchCategoriesError"));
    console.error("Failed to fetch categories:", error);
  }
};

const openAddModal = () => {
  isEdit.value = false;
  editCategoryName.value = "";
  editCategoryImageUrl.value = "";
  showAddEditModal.value = true;
};

const openEditModal = (category: Category) => {
  isEdit.value = true;
  selectedCategoryId.value = category._id ?? undefined;
  editCategoryName.value = category.name;
  editCategoryImageUrl.value = category.imageUrl;
  showAddEditModal.value = true;
};

const confirmRemoveCategory = (id: string) => {
  selectedCategoryId.value = id;
  showDeleteModal.value = true;
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
      showReassignModal.value = false;
    } else {
      toast.error(t("reassignAndRemoveCategoryError"));
    }
  } catch (error) {
    toast.error(t("reassignAndRemoveCategoryError"));
    console.error("Failed to reassign and remove category:", error);
  }
};

const submitForm = async (formData: { name: string; imageUrl: string }) => {
  try {
    if (isEdit.value && selectedCategoryId.value) {
      await updateCategory(selectedCategoryId.value, formData);
      toast.success(t("updateCategorySuccess"));
    } else {
      await createCategory(formData);
      toast.success(t("addCategorySuccess"));
    }
    fetchCategories();
    showAddEditModal.value = false;
    selectedCategoryId.value = undefined;
  } catch (error) {
    const errorMessage = isEdit.value
      ? t("updateCategoryError")
      : t("addCategoryError");
    toast.error(errorMessage);
    console.error("Failed to submit category form:", error);
  }
};

const cancelAddEdit = () => {
  showAddEditModal.value = false;
  isEdit.value = false;
  editCategoryName.value = "";
  editCategoryImageUrl.value = "";
  selectedCategoryId.value = undefined;
};

const cancelRemove = () => {
  showDeleteModal.value = false;
  showReassignModal.value = false;
  selectedCategoryId.value = undefined;
  newCategoryId.value = null;
};

onMounted(() => {
  fetchCategories();
  on("categoryAdded", fetchCategories);
  on("categoryUpdated", fetchCategories);
});
</script>

<style scoped>
.admin-categories-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.categories-menu {
  flex: 1;
  max-width: 300px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.categories-menu h2 {
  font-size: 1.4em;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.categories-menu button {
  display: block;
  margin-bottom: 12px;
  padding: 12px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  width: 100%;
  text-align: center;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.categories-menu button.active {
  background-color: #0056b3;
}

.categories-menu button:hover {
  background-color: #0056b3;
  transform: scale(1.02);
}

.categories-list {
  flex: 3;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.categories-list h2 {
  font-size: 1.6em;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.categories-list table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
}

.categories-list th,
.categories-list td {
  border: 1px solid #ddd;
  padding: 12px;
  vertical-align: middle;
  text-align: center;
}

.categories-list th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.categories-list tr:nth-child(even) {
  background-color: #f9f9f9;
}

.categories-list tr:hover {
  background-color: #f1f1f1;
}

.categories-list .actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.categories-list button {
  margin: 0;
  padding: 10px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.categories-list button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>
