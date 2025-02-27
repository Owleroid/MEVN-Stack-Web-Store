<template>
    <div>
        <h1>Categories</h1>
        <div v-if="categories.length === 0">
            <p>No categories found.</p>
            <button @click="addCategory">Add New Category</button>
        </div>
        <ul v-else>
            <li v-for="category in categories" :key="category._id">
                {{ category.name }}
                <button @click="editCategory(category._id ?? '')">Edit</button>
                <button @click="confirmRemoveCategory(category._id ?? '')">Delete</button>
            </li>
        </ul>
        <button v-if="categories.length > 0" @click="addCategory">Add New Category</button>
        <router-view></router-view>

        <!-- Modal for delete confirmation -->
        <div v-if="showDeleteModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="cancelRemove">&times;</span>
                <p>Category might have related products. Choose an option:</p>
                <button @click="selectedCategoryId && removeCategory(selectedCategoryId)">Delete with all related
                    products</button>
                <button @click="showReassignModal = true; showDeleteModal = false;">Reassign and Delete</button>
                <button @click="cancelRemove">Cancel</button>
            </div>
        </div>

        <!-- Modal for reassigning category -->
        <div v-if="showReassignModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="cancelRemove">&times;</span>
                <label for="newCategory">Choose new category for related products:</label>
                <select v-model="newCategoryId">
                    <option v-for="category in categories.filter(cat => cat._id !== selectedCategoryId)"
                        :key="category._id" :value="category._id">
                        {{ category.name }}
                    </option>
                </select>
                <button @click="reassignAndRemoveCategory">Reassign and Delete</button>
                <button @click="cancelRemove">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import type { Category } from '../../../types/categories';

import { getAllCategories, deleteCategory, deleteCategoryAndReassignProducts } from '../../../services/categoryService';

import { useEventBus } from '../../../utils/eventBus';

const categories = ref<Category[]>([]);
const router = useRouter();
const { on } = useEventBus();
const toast = useToast();

const showDeleteModal = ref(false);
const showReassignModal = ref(false);
const selectedCategoryId = ref<string | null>(null);
const newCategoryId = ref<string | null>(null);

const fetchCategories = async () => {
    try {
        const response = await getAllCategories();
        categories.value = response.data.categories;
    } catch (error) {
        toast.error('Failed to fetch categories');
        console.error('Failed to fetch categories:', error);
    }
};

const editCategory = (id: string) => {
    router.push({ name: 'EditCategory', params: { id } });
};

const confirmRemoveCategory = (id: string) => {
    selectedCategoryId.value = id;
    showDeleteModal.value = true;
};

const removeCategory = async (id: string) => {
    try {
        await deleteCategory(id);
        fetchCategories();
        toast.success('Category removed successfully');
    } catch (error) {
        toast.error('Failed to remove category');
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
            toast.success('Category reassigned and removed successfully');
            showReassignModal.value = false;
        } else {
            toast.error('Please select a category to reassign');
        }
    } catch (error) {
        toast.error('Failed to reassign and remove category');
        console.error('Failed to reassign and remove category:', error);
    }
};

const addCategory = () => {
    router.push({ name: 'AddCategory' });
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
</style>