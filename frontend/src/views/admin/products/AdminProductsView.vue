<template>
    <div>
        <h1>Products</h1>
        <div v-if="categories.length === 0">
            <p>No categories found.</p>
            <button @click="goToCategories">Go to Categories</button>
        </div>
        <div v-else>
            <label for="category">Choose a category:</label>
            <select id="category" v-model="selectedCategory" @change="fetchProducts">
                <option v-for="category in categories" :key="category._id" :value="category._id">
                    {{ category.name }}
                </option>
            </select>
            <div v-if="products.length === 0">
                <p>No products found for this category.</p>
                <button @click="addProduct">Add New Product</button>
            </div>
            <ul v-else>
                <li v-for="product in products" :key="product._id">
                    {{ product.title }}
                    <button @click="editProduct(product._id)">Edit</button>
                    <button @click="deleteProduct(product._id)">Delete</button>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllCategories } from '../../../services/categoryService';
import { getProductsByCategory, deleteProduct as deleteProductService } from '../../../services/productService';
import type { Category } from '../../../types/categories';
import type { Product } from '../../../types/products';

const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const selectedCategory = ref<string | null>(null);
const router = useRouter();

const fetchCategories = async () => {
    try {
        const response = await getAllCategories();
        categories.value = response.data.categories;
        if (categories.value.length > 0) {
            selectedCategory.value = categories.value[0]._id ?? null;
            fetchProducts();
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
};

const fetchProducts = async () => {
    if (!selectedCategory.value) return;
    try {
        const response = await getProductsByCategory(selectedCategory.value);
        products.value = response.data.products;
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
};

const goToCategories = () => {
    router.push({ name: 'AdminCategories' });
};

const addProduct = () => {
    router.push({ name: 'AddProduct', params: { categoryId: selectedCategory.value } });
};

const editProduct = (id: string) => {
    router.push({ name: 'EditProduct', params: { id } });
};

const deleteProduct = async (id: string) => {
    try {
        await deleteProductService(id);
        fetchProducts(); // Refresh the list after deletion
    } catch (error) {
        console.error('Failed to delete product:', error);
    }
};

onMounted(fetchCategories);
</script>

<style scoped>
button {
    margin-left: 10px;
}
</style>