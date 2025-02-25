<template>
    <div>
        <div class="admin-products-container">
            <div class="categories-menu">
                <h2>Categories</h2>
                <div v-if="loading">
                    <p>Loading categories...</p>
                </div>
                <div v-else-if="categories.length === 0">
                    <p>No categories found.</p>
                    <button @click="goToCategories">Go to Categories</button>
                </div>
                <div v-else>
                    <button v-for="category in categories" :key="category._id"
                        :class="{ active: category._id === selectedCategory }"
                        @click="selectCategory(category._id ?? '')">
                        {{ category.name }}
                    </button>
                </div>
            </div>
            <div class="products-list">
                <h2>Products</h2>
                <div v-if="products.length === 0">
                    <p>No products found for this category.</p>
                    <button @click="addProduct">Add New Product</button>
                </div>
                <div v-else>
                    <button @click="addProduct">Add New Product</button>
                    <ul>
                        <li v-for="product in products" :key="product._id">
                            {{ product.title }}
                            <button @click="editProduct(product._id)">Edit</button>
                            <button @click="deleteProduct(product._id)">Delete</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from 'vue-router';

import type { Product } from '../../../types/products';
import type { Category } from '../../../types/categories';

import { getAllCategories } from '../../../services/categoryService';
import { getProductsByCategory, deleteProduct as deleteProductService } from '../../../services/productService';

import { useEventBus } from '../../../utils/eventBus';

const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const selectedCategory = ref<string>('');
const loading = ref(true);
const router = useRouter();
const toast = useToast();
const { on } = useEventBus();

const fetchCategories = async () => {
    try {
        const response = await getAllCategories();
        categories.value = response.data.categories;

        if (categories.value.length > 0) {
            selectedCategory.value = categories.value[0]._id ?? '';
            fetchProducts();
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to fetch categories');
    } finally {
        loading.value = false;
    }
};

const fetchProducts = async () => {
    if (!selectedCategory.value) return;

    try {
        const response = await getProductsByCategory(selectedCategory.value);
        products.value = response.data.products;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to fetch products');
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
        toast.success('Product deleted successfully');
    } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Failed to delete product');
    }
};

const selectCategory = (categoryId: string) => {
    selectedCategory.value = categoryId;
    fetchProducts();
};

watch(selectedCategory, (newCategoryId) => {
    if (newCategoryId) {
        router.push({ name: 'AdminProducts', params: { categoryId: newCategoryId } });
        fetchProducts();
    }
});

onMounted(() => {
    fetchCategories();
    on('productAdded', fetchProducts); // Listen for the productAdded event
    on('productUpdated', fetchProducts); // Listen for the productUpdated event
});
</script>

<style scoped>
.admin-products-container {
    display: flex;
}

.categories-menu {
    width: 200px;
    margin-right: 20px;
}

.categories-menu button {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 5px;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
}

.categories-menu button.active {
    background-color: #007bff;
    color: white;
}

.products-list {
    flex: 1;
}

.products-list ul {
    list-style-type: none;
    padding: 0;
}

.products-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.products-list button {
    margin-left: 10px;
}
</style>