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
                <button @click="editCategory(category._id)">Edit</button>
                <button @click="removeCategory(category._id)">Remove</button>
            </li>
        </ul>
        <button v-if="categories.length > 0" @click="addCategory">Add New Category</button>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEventBus } from '../../utils/eventBus';

import { getAllCategories, deleteCategory } from '../../services/categoryService';
import type { Category } from '../../types/categories';

const categories = ref<Category[]>([]);
const router = useRouter();
const { on } = useEventBus();

const fetchCategories = async () => {
    try {
        const response = await getAllCategories();
        categories.value = response.data.categories;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
};

const editCategory = (id: string) => {
    router.push({ name: 'EditCategory', params: { id } });
};

const removeCategory = async (id: string) => {
    try {
        await deleteCategory(id);
        fetchCategories(); // Refresh the list after deletion
    } catch (error) {
        console.error('Failed to remove category:', error);
    }
};

const addCategory = () => {
    router.push({ name: 'AddCategory' });
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
</style>