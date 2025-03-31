<template>
  <div>
    <h1>{{ $t("categories") }}</h1>
    <div v-if="categories.length === 0">
      <p>{{ $t("noCategories") }}</p>
      <button @click="openAddModal">
        {{ $t("addNewCategory") }}
      </button>
    </div>
    <div v-else>
      <button @click="openAddModal" class="add-category-button">
        {{ $t("addNewCategory") }}
      </button>
      <table class="categories-table">
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
button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  width: fit-content;
  margin: 5px 0;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"] {
  background-color: #6c757d;
}

button[type="button"]:hover {
  background-color: #5a6268;
}

.add-category-button {
  margin-bottom: 20px;
}

.categories-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.categories-table th,
.categories-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.categories-table th {
  background-color: #f2f2f2;
  text-align: left;
}

.categories-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.categories-table tr:hover {
  background-color: #ddd;
}

.categories-table .actions {
  display: flex;
  gap: 10px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  width: fit-content;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
}

.form-actions button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
