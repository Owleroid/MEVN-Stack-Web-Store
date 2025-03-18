<template>
    <div>
        <div class="admin-products-container">
            <div class="categories-menu">
                <h2>{{ $t('adminProductsView.categories') }}</h2>
                <div v-if="loading">
                    <p>{{ $t('adminProductsView.loadingCategories') }}</p>
                </div>
                <div v-else-if="categories.length === 0">
                    <p>{{ $t('adminProductsView.noCategoriesFound') }}</p>
                    <button @click="goToCategories">{{ $t('adminProductsView.goToCategories') }}</button>
                </div>
                <div v-else>
                    <button v-for="category in categories" :key="category._id"
                        :class="{ active: category._id === selectedCategory }"
                        @click="selectCategory(category._id ?? '')">
                        {{ category.name }}
                    </button>
                </div>
            </div>
            <div v-if="categories.length > 0" class="products-list">
                <h2>{{ $t('adminProductsView.products') }}</h2>
                <div v-if="products.length === 0">
                    <p>{{ $t('adminProductsView.noProductsFound') }}</p>
                    <button @click="openAddProductModal">{{ $t('adminProductsView.addNewProduct') }}</button>
                </div>
                <div v-else>
                    <button @click="openAddProductModal">{{ $t('adminProductsView.addNewProduct') }}</button>
                    <ul>
                        <li v-for="product in products" :key="product._id">
                            {{ product.name }}
                            <button @click="openChangeCategoryModal(product)">{{ $t('adminProductsView.changeCategory') }}</button>
                            <button @click="openEditProductModal(product)">{{ $t('adminProductsView.edit') }}</button>
                            <button @click="deleteProduct(product._id)">{{ $t('adminProductsView.delete') }}</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="showChangeCategoryModal" class="modal">
            <div class="modal-content">
                <h3>{{ $t('adminProductsView.changeCategoryFor', { name: productToChangeCategory?.name }) }}</h3>
                <select v-model="selectedNewCategory">
                    <option v-for="category in filteredCategories" :key="category._id" :value="category._id">
                        {{ category.name }}
                    </option>
                </select>
                <button @click="changeCategory(selectedNewCategory)">{{ $t('adminProductsView.change') }}</button>
                <button @click="closeChangeCategoryModal">{{ $t('adminProductsView.cancel') }}</button>
            </div>
        </div>
        <div v-if="showAddProductModal" class="modal">
            <div class="modal-content">
                <h3>{{ $t('adminProductsView.addNewProduct') }}</h3>
                <form @submit.prevent="submitAddProductForm">
                    <!-- Add Product Form Fields -->
                    <div class="form-group">
                        <label for="name">{{ $t('adminProductsView.productName') }}:</label>
                        <input type="text" id="name" v-model="newProduct.name" required />
                    </div>
                    <div class="form-group">
                        <label for="priceRubles">{{ $t('adminProductsView.priceRubles') }}:</label>
                        <input type="number" id="priceRubles" v-model="newProduct.priceRubles" required />
                    </div>
                    <div class="form-group">
                        <label for="priceEuros">{{ $t('adminProductsView.priceEuros') }}:</label>
                        <input type="number" id="priceEuros" v-model="newProduct.priceEuros" required />
                    </div>
                    <div class="form-group">
                        <label for="artist">{{ $t('adminProductsView.artist') }}:</label>
                        <input type="text" id="artist" v-model="newProduct.artist" required />
                    </div>
                    <div class="form-group">
                        <label for="size">{{ $t('adminProductsView.size') }}:</label>
                        <input type="text" id="size" v-model="newProduct.size" required />
                    </div>
                    <div class="form-group">
                        <label for="material">{{ $t('adminProductsView.material') }}:</label>
                        <input type="text" id="material" v-model="newProduct.material" required />
                    </div>
                    <div class="form-group">
                        <label for="parts">{{ $t('adminProductsView.parts') }}:</label>
                        <input type="text" id="parts" v-model="newProduct.parts" />
                    </div>
                    <div class="form-group">
                        <label for="boxArt">{{ $t('adminProductsView.boxArt') }}:</label>
                        <input type="text" id="boxArt" v-model="newProduct.boxArt" required />
                    </div>
                    <div class="form-group">
                        <label for="description">{{ $t('adminProductsView.description') }}:</label>
                        <textarea id="description" v-model="newProduct.description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="mainImageUrl">{{ $t('adminProductsView.mainImageUrl') }}:</label>
                        <input type="text" id="mainImageUrl" v-model="newProduct.mainImageUrl" />
                    </div>
                    <div class="form-group">
                        <label for="secondaryImageUrls">{{ $t('adminProductsView.secondaryImageUrls') }}:</label>
                        <textarea id="secondaryImageUrls" v-model="newProduct.secondaryImageUrls"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit">{{ $t('adminProductsView.addProduct') }}</button>
                        <button type="button" @click="closeAddProductModal">{{ $t('adminProductsView.cancel') }}</button>
                    </div>
                </form>
            </div>
        </div>
        <div v-if="showEditProductModal" class="modal">
            <div class="modal-content">
                <h3>{{ $t('adminProductsView.editProduct') }}</h3>
                <form @submit.prevent="submitEditProductForm">
                    <!-- Edit Product Form Fields -->
                    <div class="form-group">
                        <label for="name">{{ $t('adminProductsView.productName') }}:</label>
                        <input type="text" id="name" v-model="editProduct.name" required />
                    </div>
                    <div class="form-group">
                        <label for="priceRubles">{{ $t('adminProductsView.priceRubles') }}:</label>
                        <input type="number" id="priceRubles" v-model="editProduct.priceRubles" required />
                    </div>
                    <div class="form-group">
                        <label for="priceEuros">{{ $t('adminProductsView.priceEuros') }}:</label>
                        <input type="number" id="priceEuros" v-model="editProduct.priceEuros" required />
                    </div>
                    <div class="form-group">
                        <label for="artist">{{ $t('adminProductsView.artist') }}:</label>
                        <input type="text" id="artist" v-model="editProduct.artist" required />
                    </div>
                    <div class="form-group">
                        <label for="size">{{ $t('adminProductsView.size') }}:</label>
                        <input type="text" id="size" v-model="editProduct.size" required />
                    </div>
                    <div class="form-group">
                        <label for="material">{{ $t('adminProductsView.material') }}:</label>
                        <input type="text" id="material" v-model="editProduct.material" required />
                    </div>
                    <div class="form-group">
                        <label for="parts">{{ $t('adminProductsView.parts') }}:</label>
                        <input type="text" id="parts" v-model="editProduct.parts" />
                    </div>
                    <div class="form-group">
                        <label for="boxArt">{{ $t('adminProductsView.boxArt') }}:</label>
                        <input type="text" id="boxArt" v-model="editProduct.boxArt" required />
                    </div>
                    <div class="form-group">
                        <label for="description">{{ $t('adminProductsView.description') }}:</label>
                        <textarea id="description" v-model="editProduct.description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="mainImageUrl">{{ $t('adminProductsView.mainImageUrl') }}:</label>
                        <input type="text" id="mainImageUrl" v-model="editProduct.mainImageUrl" />
                    </div>
                    <div class="form-group">
                        <label for="secondaryImageUrls">{{ $t('adminProductsView.secondaryImageUrls') }}:</label>
                        <textarea id="secondaryImageUrls" v-model="editProduct.secondaryImageUrls"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit">{{ $t('adminProductsView.updateProduct') }}</button>
                        <button type="button" @click="closeEditProductModal">{{ $t('adminProductsView.cancel') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import type { Product } from '../../../types/products';
import type { Category } from '../../../types/categories';

import { getAllCategories } from '../../../services/categoryService';
import { getProductsByCategory, deleteProduct as deleteProductService, updateProductCategory, addProduct, getProductById, updateProduct } from '../../../services/productService';

import { useEventBus } from '../../../utils/eventBus';

const { t } = useI18n();

const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const selectedCategory = ref<string>('');
const loading = ref(true);
const router = useRouter();
const toast = useToast();
const { on, emit } = useEventBus();

const showChangeCategoryModal = ref(false);
const productToChangeCategory = ref<Product | null>(null);
const selectedNewCategory = ref<string>('');

const showAddProductModal = ref(false);
const newProduct = ref({
    name: '',
    priceRubles: 0,
    priceEuros: 0,
    artist: '',
    size: '',
    material: '',
    parts: '',
    boxArt: '',
    description: '',
    mainImageUrl: '',
    secondaryImageUrls: ''
});

const showEditProductModal = ref(false);
const editProduct = ref({
    id: '',
    name: '',
    priceRubles: 0,
    priceEuros: 0,
    artist: '',
    size: '',
    material: '',
    parts: '',
    boxArt: '',
    description: '',
    mainImageUrl: '',
    secondaryImageUrls: ''
});

const filteredCategories = computed(() => {
    return categories.value.filter(category => category._id !== productToChangeCategory.value?.category);
});

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
        toast.error(t('adminProductsView.failedToFetchCategories'));
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
        toast.error(t('adminProductsView.failedToFetchProducts'));
    }
};

const goToCategories = () => {
    router.push({ name: 'AdminCategories' });
};

const openAddProductModal = () => {
    showAddProductModal.value = true;
};

const closeAddProductModal = () => {
    showAddProductModal.value = false;
};

const submitAddProductForm = async () => {
    try {
        const product = {
            name: newProduct.value.name,
            category: selectedCategory.value,
            price: {
                rubles: { amount: newProduct.value.priceRubles },
                euros: { amount: newProduct.value.priceEuros }
            },
            artist: newProduct.value.artist,
            size: newProduct.value.size,
            material: newProduct.value.material,
            parts: newProduct.value.parts,
            boxArt: newProduct.value.boxArt,
            description: newProduct.value.description,
            imageUrls: {
                main: newProduct.value.mainImageUrl,
                secondary: newProduct.value.secondaryImageUrls.split(',').map(url => url.trim())
            }
        };

        await addProduct(product);
        emit('productAdded');
        toast.success(t('adminProductsView.productAddedSuccessfully'));
        closeAddProductModal();
        fetchProducts();
    } catch (error) {
        toast.error(t('adminProductsView.failedToAddProduct'));
        console.error('Failed to add product:', error);
    }
};

const openEditProductModal = async (product: Product) => {
    try {
        const response = await getProductById(product._id);
        const fetchedProduct = response.data.product;

        editProduct.value = {
            id: fetchedProduct._id,
            name: fetchedProduct.name,
            priceRubles: fetchedProduct.price.rubles.amount,
            priceEuros: fetchedProduct.price.euros.amount,
            artist: fetchedProduct.artist,
            size: fetchedProduct.size,
            material: fetchedProduct.material,
            parts: fetchedProduct.parts,
            boxArt: fetchedProduct.boxArt,
            description: fetchedProduct.description,
            mainImageUrl: fetchedProduct.imageUrls.main,
            secondaryImageUrls: fetchedProduct.imageUrls.secondary.join(', ')
        };

        showEditProductModal.value = true;
    } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error(t('adminProductsView.failedToFetchProduct'));
    }
};

const closeEditProductModal = () => {
    showEditProductModal.value = false;
};

const submitEditProductForm = async () => {
    try {
        const product = {
            name: editProduct.value.name,
            category: selectedCategory.value,
            price: {
                rubles: { amount: editProduct.value.priceRubles },
                euros: { amount: editProduct.value.priceEuros }
            },
            artist: editProduct.value.artist,
            size: editProduct.value.size,
            material: editProduct.value.material,
            parts: editProduct.value.parts,
            boxArt: editProduct.value.boxArt,
            description: editProduct.value.description,
            imageUrls: {
                main: editProduct.value.mainImageUrl,
                secondary: editProduct.value.secondaryImageUrls.split(',').map(url => url.trim())
            }
        };

        await updateProduct(editProduct.value.id, product);
        emit('productUpdated');
        toast.success(t('adminProductsView.productUpdatedSuccessfully'));
        closeEditProductModal();
        fetchProducts();
    } catch (error) {
        toast.error(t('adminProductsView.failedToUpdateProduct'));
        console.error('Failed to update product:', error);
    }
};

const deleteProduct = async (id: string) => {
    try {
        await deleteProductService(id);
        fetchProducts(); // Refresh the list after deletion
        toast.success(t('adminProductsView.productDeletedSuccessfully'));
    } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error(t('adminProductsView.failedToDeleteProduct'));
    }
};

const selectCategory = (categoryId: string) => {
    selectedCategory.value = categoryId;
    fetchProducts();
};

const openChangeCategoryModal = (product: Product) => {
    productToChangeCategory.value = product;
    showChangeCategoryModal.value = true;
};

const closeChangeCategoryModal = () => {
    productToChangeCategory.value = null;
    showChangeCategoryModal.value = false;
};

const changeCategory = async (newCategoryId: string) => {
    if (!productToChangeCategory.value) return;

    if (!newCategoryId) {
        toast.error(t('adminProductsView.selectNewCategory'));
        return;
    }

    try {
        await updateProductCategory(productToChangeCategory.value._id, newCategoryId);
        fetchProducts();
        toast.success(t('adminProductsView.productCategoryUpdatedSuccessfully'));
        closeChangeCategoryModal();
    } catch (error) {
        console.error('Failed to update product category:', error);
        toast.error(t('adminProductsView.failedToUpdateProductCategory'));
    }
};

watch(selectedCategory, (newCategoryId) => {
    if (newCategoryId) {
        router.push({ name: 'AdminProducts', params: { categoryId: newCategoryId } });
        fetchProducts();
    }
});

onMounted(() => {
    fetchCategories();
    on('productAdded', fetchProducts);
    on('productUpdated', fetchProducts);
});
</script>

<style scoped>
.admin-products-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 100%;
    height: 100%;
}

.categories-menu, .products-list {
    flex: 1;
    min-width: 0;
}

.categories-menu button, .products-list button {
    display: block;
    margin: 5px 0;
    padding: 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    width: 200px; /* Fixed width for all buttons */
    box-sizing: border-box;
}

.categories-menu button.active {
    background-color: #0056b3;
}

.products-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.products-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    width: 100%;
    box-sizing: border-box;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 90%;
    max-width: 500px;
    max-height: 90%;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input, .form-group textarea, .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}

.form-actions {
    display: flex;
    justify-content: space-between;
}

.form-actions button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    width: 200px; /* Fixed width for form action buttons */
}

.form-actions button[type="button"] {
    background-color: #6c757d;
}
</style>