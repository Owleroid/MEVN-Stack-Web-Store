<template>
    <div class="add-category-container">
        <h1>Add New Category</h1>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Category Name:</label>
                <input type="text" id="name" v-model="name" required />
            </div>
            <button type="submit">Add Category</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createCategory } from '../../../services/categoryService';
import { useEventBus } from '../../../utils/eventBus';

const name = ref('');
const router = useRouter();
const { emit } = useEventBus();

const submitForm = async () => {
    try {
        await createCategory({ name: name.value });
        emit('categoryAdded');
        router.push({ name: 'AdminCategories' });
    } catch (error) {
        console.error('Failed to add category:', error);
    }
};
</script>

<style scoped>
.add-category-container {
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