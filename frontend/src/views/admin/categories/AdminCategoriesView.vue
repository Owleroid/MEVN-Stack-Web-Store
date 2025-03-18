<template>
    <div>
        <h1>{{ $t('adminCategoriesView.categories') }}</h1>
        <div v-if="categories.length === 0">
            <p>{{ $t('adminCategoriesView.noCategories') }}</p>
            <button @click="showAddModal = true">{{ $t('adminCategoriesView.addNewCategory') }}</button>
        </div>
        <ul v-else>
            <li v-for="category in categories" :key="category._id">
                {{ category.name }}
                <button @click="openEditModal(category)">{{ $t('adminCategoriesView.editCategory') }}</button>
                <button @click="confirmRemoveCategory(category._id ?? '')">{{ $t('adminCategoriesView.delete') }}</button>
            </li>
        </ul>
        <button v-if="categories.length > 0" @click="showAddModal = true">{{ $t('adminCategoriesView.addNewCategory') }}</button>

        <!-- Modal for delete confirmation -->
        <div v-if="showDeleteModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="cancelRemove">&times;</span>
                <p>{{ $t('adminCategoriesView.deleteConfirmation') }}</p>
                <button @click="selectedCategoryId && removeCategory(selectedCategoryId)">{{ $t('adminCategoriesView.deleteWithProducts') }}</button>
                <button @click="showReassignModal = true; showDeleteModal = false;">{{ $t('adminCategoriesView.reassignAndDelete') }}</button>
                <button @click="cancelRemove">{{ $t('adminCategoriesView.cancel') }}</button>
            </div>
        </div>

        <!-- Modal for reassigning category -->
        <div v-if="showReassignModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="cancelRemove">&times;</span>
                <label for="newCategory">{{ $t('adminCategoriesView.chooseNewCategory') }}</label>
                <select v-model="newCategoryId">
                    <option v-for="category in categories.filter(cat => cat._id !== selectedCategoryId)"
                        :key="category._id" :value="category._id">
                        {{ category.name }}
                    </option>
                </select>
                <button @click="reassignAndRemoveCategory">{{ $t('adminCategoriesView.reassignAndDelete') }}</button>
                <button @click="cancelRemove">{{ $t('adminCategoriesView.cancel') }}</button>
            </div>
        </div>

        <!-- Modal for adding category -->
        <div v-if="showAddModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="cancelAdd">&times;</span>
                <h2>{{ $t('adminCategoriesView.addNewCategory') }}</h2>
                <form @submit.prevent="submitAddForm">
                    <div class="form-group">
                        <label for="newCategoryName">{{ $t('adminCategoriesView.categoryName') }}</label>
                        <input type="text" id="newCategoryName" v-model="newCategoryName" required />
                    </div>
                    <div class="form-actions">
                        <button type="submit">{{ $t('adminCategoriesView.addCategory') }}</button>
                        <button type="button" @click="cancelAdd">{{ $t('adminCategoriesView.cancel') }}</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal for editing category -->
        <div v-if="showEditModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="cancelEdit">&times;</span>
                <h2>{{ $t('adminCategoriesView.editCategory') }}</h2>
                <form @submit.prevent="submitEditForm">
                    <div class="form-group">
                        <label for="editCategoryName">{{ $t('adminCategoriesView.categoryName') }}</label>
                        <input type="text" id="editCategoryName" v-model="editCategoryName" required />
                    </div>
                    <div class="form-actions">
                        <button type="submit">{{ $t('adminCategoriesView.updateCategory') }}</button>
                        <button type="button" @click="cancelEdit">{{ $t('adminCategoriesView.cancel') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

import type { Category } from '../../../types/categories';

import { getAllCategories, deleteCategory, deleteCategoryAndReassignProducts, createCategory, updateCategory } from '../../../services/categoryService';

import { useEventBus } from '../../../utils/eventBus';

const { t } = useI18n();
const categories = ref<Category[]>([]);
const { on } = useEventBus();
const toast = useToast();

const showDeleteModal = ref(false);
const showReassignModal = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedCategoryId = ref<string | null>(null);
const newCategoryId = ref<string | null>(null);
const newCategoryName = ref('');
const editCategoryName = ref('');

const fetchCategories = async () => {
    try {
        const response = await getAllCategories();
        categories.value = response.data.categories;
    } catch (error) {
        toast.error(t('adminCategoriesView.fetchCategoriesError'));
        console.error('Failed to fetch categories:', error);
    }
};

const openEditModal = (category: Category) => {
    selectedCategoryId.value = category._id ?? null;
    editCategoryName.value = category.name;
    showEditModal.value = true;
};

const confirmRemoveCategory = (id: string) => {
    selectedCategoryId.value = id;
    showDeleteModal.value = true;
};

const removeCategory = async (id: string) => {
    try {
        await deleteCategory(id);
        fetchCategories();
        toast.success(t('adminCategoriesView.removeCategorySuccess'));
    } catch (error) {
        toast.error(t('adminCategoriesView.removeCategoryError'));
        console.error('Failed to remove category:', error);
    } finally {
        showDeleteModal.value = false;
    }
};

const reassignAndRemoveCategory = async () => {
    try {
        if (selectedCategoryId.value && newCategoryId.value) {
            await deleteCategoryAndReassignProducts(selectedCategoryId.value, newCategoryId.value);
            fetchCategories();
            toast.success(t('adminCategoriesView.reassignAndRemoveCategorySuccess'));
            showReassignModal.value = false;
        } else {
            toast.error(t('adminCategoriesView.reassignAndRemoveCategoryError'));
        }
    } catch (error) {
        toast.error(t('adminCategoriesView.reassignAndRemoveCategoryError'));
        console.error('Failed to reassign and remove category:', error);
    }
};

const submitAddForm = async () => {
    try {
        await createCategory({ name: newCategoryName.value });
        fetchCategories();
        toast.success(t('adminCategoriesView.addCategorySuccess'));
        showAddModal.value = false;
        newCategoryName.value = '';
    } catch (error) {
        toast.error(t('adminCategoriesView.addCategoryError'));
        console.error('Failed to add category:', error);
    }
};

const submitEditForm = async () => {
    try {
        if (selectedCategoryId.value) {
            await updateCategory(selectedCategoryId.value, { name: editCategoryName.value });
            fetchCategories();
            toast.success(t('adminCategoriesView.updateCategorySuccess'));
            showEditModal.value = false;
            selectedCategoryId.value = null;
            editCategoryName.value = '';
        }
    } catch (error) {
        toast.error(t('adminCategoriesView.updateCategoryError'));
        console.error('Failed to update category:', error);
    }
};

const cancelAdd = () => {
    showAddModal.value = false;
    newCategoryName.value = '';
};

const cancelEdit = () => {
    showEditModal.value = false;
    selectedCategoryId.value = null;
    editCategoryName.value = '';
};

const cancelRemove = () => {
    showDeleteModal.value = false;
    showReassignModal.value = false;
    selectedCategoryId.value = null;
    newCategoryId.value = null;
};

onMounted(() => {
    fetchCategories();
    on('categoryAdded', fetchCategories);
    on('categoryUpdated', fetchCategories);
});
</script>

<style scoped>
button {
    margin-left: 10px;
    margin-bottom: 10px;
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
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
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

button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    width: fit-content;
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
</style>