<template>
    <div class="edit-category-container">
        <h1>Edit Category</h1>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Category Name:</label>
                <input type="text" id="name" v-model="name" required />
            </div>
            <button type="submit">Update Category</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getCategory, updateCategory } from '../../services/categoryService';
import { useEventBus } from '../../utils/eventBus';

const name = ref('');
const router = useRouter();
const route = useRoute();
const { emit } = useEventBus();
const categoryId = route.params.id as string;

const fetchCategory = async () => {
    try {
        const response = await getCategory(categoryId);
        name.value = response.data.name;
    } catch (error) {
        console.error('Failed to fetch category:', error);
    }
};

const submitForm = async () => {
    try {
        await updateCategory(categoryId, { name: name.value });
        emit('categoryUpdated');
        router.push({ name: 'AdminCategories' });
    } catch (error) {
        console.error('Failed to update category:', error);
    }
};

onMounted(fetchCategory);
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

button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    width: fit-content;
    align-self: flex-end;
}

button:hover {
    background-color: #0056b3;
}
</style>