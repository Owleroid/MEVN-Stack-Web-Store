<template>
    <div class="edit-product-container">
        <h1>Edit Product</h1>
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
            <div class="form-actions">
                <button type="submit">Update Product</button>
                <button type="button" @click="cancelEdit">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from 'vue-router';

import type { ProductInput } from '../../../types/products';

import { getProductById, updateProduct } from '../../../services/productService';

import { useEventBus } from '../../../utils/eventBus';

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
const toast = useToast();
const { emit } = useEventBus();
const productId = route.params.id as string;

const fetchProduct = async () => {
    try {
        const response = await getProductById(productId);
        const product = response.data.product;

        title.value = product.title;
        price.value = product.price;
        artist.value = product.artist;
        size.value = product.size;
        material.value = product.material;
        parts.value = product.parts;
        boxArt.value = product.boxArt;
        amount.value = product.amount;
        description.value = product.description;
        mainImageUrl.value = product.imageUrls.main;
        secondaryImageUrls.value = product.imageUrls.secondary.join(', ');
    } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to fetch product');
    }
};

const submitForm = async () => {
    try {
        const product: ProductInput = {
            title: title.value,
            category: route.params.category as string,
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

        await updateProduct(productId, product);
        emit('productUpdated');
        toast.success('Product was successfully updated');
        router.push({ name: 'AdminProducts' });
    } catch (error) {
        toast.error('Failed to update product');
        console.error('Failed to update product:', error);
    }
};

const cancelEdit = () => {
    router.push({ name: 'AdminProducts' });
};

onMounted(fetchProduct);
</script>

<style scoped>
.edit-product-container {
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