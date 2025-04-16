<template>
  <div>
    <div class="admin-products-container">
      <div class="categories-menu">
        <h2>{{ $t("categories") }}</h2>
        <div v-if="loading">
          <p>{{ $t("loadingCategories") }}</p>
        </div>
        <div v-else-if="categories.length === 0">
          <p>{{ $t("noCategoriesFound") }}</p>
          <button @click="goToCategories">
            {{ $t("goToCategories") }}
          </button>
        </div>
        <div v-else>
          <button
            v-for="category in categories"
            :key="category._id"
            :class="{ active: category._id === selectedCategory }"
            @click="selectCategory(category._id ?? '')"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
      <div v-if="categories.length > 0" class="products-list">
        <h2>{{ $t("products") }}</h2>
        <div v-if="products.length === 0">
          <p>{{ $t("noProductsFound") }}</p>
          <button @click="openAddProductModal">
            {{ $t("addNewProduct") }}
          </button>
        </div>
        <div v-else>
          <button @click="openAddProductModal">
            {{ $t("addNewProduct") }}
          </button>
          <table>
            <thead>
              <tr>
                <th>{{ $t("productImage") }}</th>
                <th>{{ $t("productName") }}</th>
                <th>{{ $t("actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product._id">
                <td>
                  <img
                    :src="product.imageUrls?.main"
                    :alt="product.name"
                    class="product-image"
                  />
                </td>
                <td>{{ product.name }}</td>
                <td class="actions">
                  <button @click="openChangeCategoryModal(product)">
                    {{ $t("changeCategory") }}
                  </button>
                  <button @click="openEditProductModal(product)">
                    {{ $t("edit") }}
                  </button>
                  <button @click="deleteProduct(product._id)">
                    {{ $t("delete") }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <ChangeCategoryModal
      :show="showChangeCategoryModal"
      :productToChangeCategory="productToChangeCategory || {}"
      :categories="categories"
      @close="closeChangeCategoryModal"
      @changeCategory="changeCategory"
    />
    <AddEditProductModal
      :show="showAddProductModal"
      :isEdit="false"
      :product="newProduct"
      @close="closeAddProductModal"
      @submitForm="submitAddProductForm"
    />
    <AddEditProductModal
      :show="showEditProductModal"
      :isEdit="true"
      :product="editProduct"
      @close="closeEditProductModal"
      @submitForm="submitEditProductForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import ChangeCategoryModal from "@/components/admin/products/ChangeCategoryModal.vue";
import AddEditProductModal from "@/components/admin/products/AddEditProductModal.vue";

import type { Product } from "@/types/products";
import type { Category } from "@/types/categories";

import { getAllCategories } from "@/services/categoryService";
import {
  getProductsByCategory,
  deleteProduct as deleteProductService,
  updateProductCategory,
  addProduct,
  getProductById,
  updateProduct,
} from "@/services/productService";

import { useEventBus } from "@/utils/eventBus";

const { t } = useI18n();

const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const selectedCategory = ref<string>("");
const loading = ref(true);
const router = useRouter();
const toast = useToast();
const { on, emit } = useEventBus();

const showChangeCategoryModal = ref(false);
const productToChangeCategory = ref<Product | null>(null);

const showAddProductModal = ref(false);
const newProduct = ref({
  name: "",
  priceRubles: 0,
  priceEuros: 0,
  artist: "",
  size: "",
  material: "",
  parts: "",
  boxArt: "",
  description: "",
  mainImageUrl: "",
  secondaryImageUrls: "",
});

const showEditProductModal = ref(false);
const editProduct = ref({
  id: "",
  name: "",
  priceRubles: 0,
  priceEuros: 0,
  artist: "",
  size: "",
  material: "",
  parts: "",
  boxArt: "",
  description: "",
  mainImageUrl: "",
  secondaryImageUrls: "",
});

const fetchCategories = async () => {
  try {
    const response = await getAllCategories();
    categories.value = response.data.categories;

    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0]._id ?? "";
      fetchProducts();
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    toast.error(t("failedToFetchCategories"));
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
    console.error("Failed to fetch products:", error);
    toast.error(t("failedToFetchProducts"));
  }
};

const goToCategories = () => {
  router.push({ name: "AdminCategories" });
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
        euros: { amount: newProduct.value.priceEuros },
      },
      artist: newProduct.value.artist,
      size: newProduct.value.size,
      material: newProduct.value.material,
      parts: newProduct.value.parts,
      boxArt: newProduct.value.boxArt,
      description: newProduct.value.description,
      imageUrls: {
        main: newProduct.value.mainImageUrl,
        secondary: newProduct.value.secondaryImageUrls
          .split(",")
          .map((url) => url.trim()),
      },
    };

    await addProduct(product);
    emit("productAdded");
    toast.success(t("productAddedSuccessfully"));
    closeAddProductModal();
    fetchProducts();
  } catch (error) {
    toast.error(t("failedToAddProduct"));
    console.error("Failed to add product:", error);
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
      secondaryImageUrls: fetchedProduct.imageUrls.secondary.join(", "),
    };

    showEditProductModal.value = true;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    toast.error(t("failedToFetchProduct"));
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
        euros: { amount: editProduct.value.priceEuros },
      },
      artist: editProduct.value.artist,
      size: editProduct.value.size,
      material: editProduct.value.material,
      parts: editProduct.value.parts,
      boxArt: editProduct.value.boxArt,
      description: editProduct.value.description,
      imageUrls: {
        main: editProduct.value.mainImageUrl,
        secondary: editProduct.value.secondaryImageUrls
          .split(",")
          .map((url) => url.trim()),
      },
    };

    await updateProduct(editProduct.value.id, product);
    emit("productUpdated");
    toast.success(t("productUpdatedSuccessfully"));
    closeEditProductModal();
    fetchProducts();
  } catch (error) {
    toast.error(t("failedToUpdateProduct"));
    console.error("Failed to update product:", error);
  }
};

const deleteProduct = async (id: string) => {
  try {
    await deleteProductService(id);
    fetchProducts(); // Refresh the list after deletion
    toast.success(t("productDeletedSuccessfully"));
  } catch (error) {
    console.error("Failed to delete product:", error);
    toast.error(t("failedToDeleteProduct"));
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
    toast.error(t("selectNewCategory"));
    return;
  }

  try {
    await updateProductCategory(
      productToChangeCategory.value._id,
      newCategoryId
    );
    fetchProducts();
    toast.success(t("productCategoryUpdatedSuccessfully"));
    closeChangeCategoryModal();
  } catch (error) {
    console.error("Failed to update product category:", error);
    toast.error(t("failedToUpdateProductCategory"));
  }
};

watch(selectedCategory, (newCategoryId) => {
  if (newCategoryId) {
    router.push({
      name: "AdminProducts",
      params: { categoryId: newCategoryId },
    });
    fetchProducts();
  }
});

onMounted(() => {
  fetchCategories();
  on("productAdded", fetchProducts);
  on("productUpdated", fetchProducts);
});
</script>

<style scoped>
.admin-products-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.categories-menu {
  flex: 1;
  max-width: 300px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.categories-menu h2 {
  font-size: 1.4em;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.categories-menu button {
  display: block;
  margin-bottom: 12px;
  padding: 12px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  width: 100%;
  text-align: center;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.categories-menu button.active {
  background-color: #0056b3;
}

.categories-menu button:hover {
  background-color: #0056b3;
  transform: scale(1.02);
}

.products-list {
  flex: 3;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.products-list h2 {
  font-size: 1.6em;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
}

.products-list table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
}

.products-list th,
.products-list td {
  border: 1px solid #ddd;
  padding: 12px;
  vertical-align: middle;
  text-align: center;
}

.products-list th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.products-list tr:nth-child(even) {
  background-color: #f9f9f9;
}

.products-list tr:hover {
  background-color: #f1f1f1;
}

.products-list .actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.products-list button {
  margin: 0;
  padding: 10px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9em;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.products-list button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
