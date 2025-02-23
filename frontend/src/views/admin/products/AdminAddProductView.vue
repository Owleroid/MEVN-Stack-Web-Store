<template>
    <div class="add-product-container">
        <h1>Add New Product</h1>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="title">Product Title:</label>
                <input type="text" id="title" v-model="title" required />
            </div>
            <div class="form-group">
                <label for="price">Price:</label>
                <input type="number" id="price" v-model="price" required />
            </div>
            <div class="form-group">
                <label for="artist">Artist:</label>
                <input type="text" id="artist" v-model="artist" required />
            </div>
            <div class="form-group">
                <label for="size">Size:</label>
                <input type="text" id="size" v-model="size" required />
            </div>
            <div class="form-group">
                <label for="material">Material:</label>
                <input type="text" id="material" v-model="material" required />
            </div>
            <div class="form-group">
                <label for="parts">Parts:</label>
                <input type="text" id="parts" v-model="parts" />
            </div>
            <div class="form-group">
                <label for="boxArt">Box Art:</label>
                <input type="text" id="boxArt" v-model="boxArt" required />
            </div>
            <div class="form-group">
                <label for="amount">Amount:</label>
                <input type="number" id="amount" v-model="amount" required />
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" v-model="description"></textarea>
            </div>
            <div class="form-group">
                <label for="mainImageUrl">Main Image URL:</label>
                <input type="text" id="mainImageUrl" v-model="mainImageUrl" />
            </div>
            <div class="form-group">
                <label for="secondaryImageUrls">Secondary Image URLs:</label>
                <textarea id="secondaryImageUrls" v-model="secondaryImageUrls"></textarea>
            </div>
            <button type="submit">Add Product</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { createProduct } from '../../../services/productService';
import { useEventBus } from '../../../utils/eventBus';
import type { ProductInput } from '../../../types/products';

const title = ref('');
const price = ref(0);
const artist = ref('');
const size = ref('');
const material = ref('');
const parts = ref('');
const boxArt = ref('');
const amount = ref(0);
const description = ref('');
const mainImageUrl = ref('');
const secondaryImageUrls = ref('');
const router = useRouter();
const route = useRoute();
const { emit } = useEventBus();
const categoryId = route.params.categoryId as string;

const submitForm = async () => {
    try {
        const product: ProductInput = {
            title: title.value,
            category: categoryId,
            price: price.value,
            artist: artist.value,
            size: size.value,
            material: material.value,
            parts: parts.value,
            boxArt: boxArt.value,
            amount: amount.value,
            description: description.value,
            imageUrls: {
                main: mainImageUrl.value,
                secondary: secondaryImageUrls.value.split(',').map(url => url.trim())
            }
        };
        await createProduct(product);
        emit('productAdded');
        router.push({ name: 'AdminProducts' });
    } catch (error) {
        console.error('Failed to add product:', error);
    }
};
</script>

<style scoped>
.add-product-container {
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

input,
textarea {
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