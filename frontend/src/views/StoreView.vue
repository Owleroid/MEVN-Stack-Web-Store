<template>
    <div class="store-view">
        <div class="categories">
            <div v-if="categories.length === 0" class="no-categories">
                Store is under construction, we are working on it.
            </div>
            <div v-else>
                <button v-for="category in categories" :key="category._id" @click="fetchProducts(category._id || '')">
                    {{ category.name }}
                </button>
            </div>
        </div>
        <div v-if="categories.length > 0" class="products">
            <div v-if="products.length === 0" class="no-products">
                No products found in this category.
            </div>
            <div v-else>
                <div v-for="product in products" :key="product._id" class="product">
                    <img :src="product.imageUrls?.main" alt="Product Image" />
                    <h2>{{ product.title }}</h2>
                    <p>{{ product.price.euros.amount }} €</p>
                    <AddToCartButton :product="product" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { Product } from '../types/products';
import type { Category } from '../types/categories';

import { getAllCategories, getProductsByCategoryId } from '../services/storeService';
import AddToCartButton from '../components/AddToCartButton.vue';

const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const selectedCategoryId = ref('');

const fetchCategories = async () => {
    try {
        const response = await getAllCategories();
        categories.value = response.data;
        if (categories.value.length > 0) {
            selectedCategoryId.value = categories.value[0]._id as string;
            fetchProducts(selectedCategoryId.value);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const fetchProducts = async (categoryId: string) => {
    try {
        const response = await getProductsByCategoryId(categoryId);
        products.value = response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

onMounted(() => {
    fetchCategories();
});
</script>

<style scoped>
.store-view {
    display: flex;
}

.categories {
    width: 20%;
    padding: 10px;
}

.products {
    width: 80%;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
}

.no-categories {
    width: 100%;
    text-align: center;
    padding: 20px;
    font-size: 1.2em;
    color: #888;
}

.no-products {
    width: 100%;
    text-align: center;
    padding: 20px;
    font-size: 1.2em;
    color: #888;
}

.product {
    width: 30%;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
}

.product img {
    max-width: 100%;
    height: auto;
}
</style>