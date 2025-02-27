<template>
    <div class="edit-category-container">
        <h1>Edit Category</h1>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Category Name:</label>
                <input type="text" id="name" v-model="name" required />
            </div>
            <div class="form-actions">
                <button type="submit">Update Category</button>
                <button type="button" @click="cancelEdit">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from 'vue-router';

import { getCategory, updateCategory } from '../../../services/categoryService';

import { useEventBus } from '../../../utils/eventBus';

const name = ref('');
const router = useRouter();
const route = useRoute();
const { emit } = useEventBus();
const toast = useToast();
const categoryId = ref(route.params.id as string);

const fetchCategory = async (id: string) => {
    try {
        const response = await getCategory(id);
        name.value = response.data.category.name;
    } catch (error) {
        toast.error('Failed to fetch category');
        console.error('Failed to fetch category:', error);
    }
};

const submitForm = async () => {
    try {
        await updateCategory(categoryId.value, { name: name.value });
        emit('categoryUpdated');
        toast.success('Category was successfully updated');
        router.push({ name: 'AdminCategories' });
    } catch (error) {
        toast.error('Failed to update category');
        console.error('Failed to update category:', error);
    }
};

const cancelEdit = () => {
    router.push({ name: 'AdminCategories' });
};

onMounted(() => {
    fetchCategory(categoryId.value);
});

watch(
    () => route.params.id,
    (newId) => {
        categoryId.value = newId as string;
        fetchCategory(newId as string);
    }
);
</script>

<style scoped>
.edit-category-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

form {
    display: flex;
    flex-direction: column;
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