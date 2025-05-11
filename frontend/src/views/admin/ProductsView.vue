<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Categories Menu -->
      <div
        class="w-full md:w-64 bg-white p-4 rounded-lg shadow border border-gray-200"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          {{ $t("categories") }}
        </h2>

        <!-- Loading State for Categories -->
        <div v-if="loadingCategories" class="flex flex-col items-center py-6">
          <div
            class="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"
          ></div>
          <p class="text-gray-600 text-sm">{{ $t("loadingCategories") }}</p>
        </div>

        <!-- No Categories State -->
        <div v-else-if="categories.length === 0" class="py-4">
          <p class="text-gray-500 mb-4 text-center">
            {{ $t("noCategoriesFound") }}
          </p>
          <button
            @click="goToCategories"
            class="w-full py-2 px-4 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
          >
            {{ $t("goToCategories") }}
          </button>
        </div>

        <!-- Categories List -->
        <div v-else class="flex flex-col gap-2">
          <button
            v-for="category in categories"
            :key="category._id"
            :class="[
              'py-2.5 px-4 text-sm font-medium rounded-md transition-colors w-full text-left',
              category._id === selectedCategory
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
            @click="selectCategory(category._id ?? '')"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Products List -->
      <div class="flex-1" v-if="categories.length > 0">
        <div class="bg-white rounded-lg shadow border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <h2 class="text-xl font-semibold text-gray-800 m-0">
                {{ $t("products") }}
              </h2>
              <button
                @click="openAddProductModal"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                {{ $t("addNewProduct") }}
              </button>
            </div>
          </div>

          <!-- Loading State for Products (Full Overlay) -->
          <div v-if="loadingProducts" class="relative min-h-[300px]">
            <!-- Static Table for Visual Consistency -->
            <div class="opacity-40">
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                    >
                      {{ $t("productImage") }}
                    </th>
                    <th
                      class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                    >
                      {{ $t("productName") }}
                    </th>
                    <th
                      class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                    >
                      {{ $t("actions") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="p-4 border-b border-gray-200">&nbsp;</td>
                    <td class="p-4 border-b border-gray-200">&nbsp;</td>
                    <td class="p-4 border-b border-gray-200">&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Loading Overlay -->
            <div
              class="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"
                ></div>
                <p class="text-gray-600 text-sm">{{ $t("loadingProducts") }}</p>
              </div>
            </div>
          </div>

          <!-- No Products State -->
          <div v-else-if="products.length === 0" class="text-center py-12">
            <p class="text-gray-500">{{ $t("noProductsFound") }}</p>
          </div>

          <!-- Products Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("productImage") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("productName") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("slug") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("actions") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in products"
                  :key="product._id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="p-4 border-b border-gray-200">
                    <div
                      class="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200"
                    >
                      <img
                        v-if="product.imageUrls?.main"
                        :src="product.imageUrls.main"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-400 text-xs"
                      >
                        {{ $t("noImage") }}
                      </div>
                    </div>
                  </td>
                  <td class="p-4 border-b border-gray-200">
                    {{ product.name }}
                  </td>
                  <td class="p-4 border-b border-gray-200">
                    {{ product.slug }}
                  </td>
                  <td class="p-4 border-b border-gray-200">
                    <div class="flex flex-wrap gap-2">
                      <button
                        @click="openChangeCategoryModal(product)"
                        class="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        {{ $t("changeCategory") }}
                      </button>
                      <button
                        @click="openEditProductModal(product)"
                        class="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
                      >
                        {{ $t("edit") }}
                      </button>
                      <button
                        @click="deleteProduct(product._id)"
                        class="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                      >
                        {{ $t("delete") }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
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

import { useEventBus } from "@/utils/eventBus";

import ChangeCategoryModal from "@/components/admin/products/ChangeCategoryModal.vue";
import AddEditProductModal from "@/components/admin/products/AddEditProductModal.vue";

import type { Product, ProductInput } from "@/types/products";
import type { Category } from "@/types/category";

import { getAllCategories } from "@/services/categoryService";
import {
  getProductsByCategoryId,
  deleteProduct as deleteProductService,
  updateProductCategory,
  addProduct,
  getProductById,
  updateProduct,
} from "@/services/productService";

// Composables Setup
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const { on, emit } = useEventBus();

// State Management
// Data state
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const selectedCategory = ref<string>("");
// Split loading states for categories and products
const loadingCategories = ref(true);
const loadingProducts = ref(false);

// UI state - modals
const showChangeCategoryModal = ref(false);
const showAddProductModal = ref(false);
const showEditProductModal = ref(false);

// Form state
const productToChangeCategory = ref<Product | null>(null);

// Define our form interfaces matching the expected structure
interface ProductFormData {
  name: string;
  slug: string;
  priceRubles: number;
  priceEuros: number;
  artist: string;
  size: string;
  material: string;
  parts: string;
  boxArt: string;
  description: string;
  mainImageUrl: string;
  secondaryImageUrls: string;
}

interface EditProductFormData extends ProductFormData {
  id: string;
}

const newProduct = ref<ProductFormData>({
  name: "",
  slug: "",
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

const editProduct = ref<EditProductFormData>({
  id: "",
  name: "",
  slug: "",
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

// UI Helpers
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "/images/placeholder-product.png";
};

// Data Fetching
const fetchCategories = async () => {
  loadingCategories.value = true;

  try {
    const response = await getAllCategories();
    categories.value = response.categories;

    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0]._id ?? "";
      fetchProducts();
    }
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    toast.error(t("failedToFetchCategories"));
  } finally {
    loadingCategories.value = false;
  }
};

const fetchProducts = async () => {
  if (!selectedCategory.value) return;

  loadingProducts.value = true;

  try {
    const response = await getProductsByCategoryId(selectedCategory.value);
    products.value = response.products;
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
    toast.error(t("failedToFetchProducts"));
  } finally {
    loadingProducts.value = false;
  }
};

// Navigation
const goToCategories = () => {
  router.push({ name: "AdminCategories" });
};

// Category Operations
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId;
  fetchProducts();
};

// Modal Management
const openChangeCategoryModal = (product: Product) => {
  productToChangeCategory.value = product;
  showChangeCategoryModal.value = true;
};

const closeChangeCategoryModal = () => {
  productToChangeCategory.value = null;
  showChangeCategoryModal.value = false;
};

const resetNewProductForm = () => {
  newProduct.value = {
    name: "",
    slug: "",
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
  };
};

const openAddProductModal = () => {
  resetNewProductForm();
  showAddProductModal.value = true;
};

const closeAddProductModal = () => {
  showAddProductModal.value = false;
};

const openEditProductModal = async (product: Product) => {
  loadingProducts.value = true;

  try {
    const response = await getProductById(product._id);
    const fetchedProduct = response.product;

    editProduct.value = {
      id: fetchedProduct._id,
      name: fetchedProduct.name,
      slug: fetchedProduct.slug,
      priceRubles: fetchedProduct.price.rubles.amount,
      priceEuros: fetchedProduct.price.euros.amount,
      artist: fetchedProduct.artist || "",
      size: fetchedProduct.size,
      material: fetchedProduct.material,
      parts: fetchedProduct.parts || "",
      boxArt: fetchedProduct.boxArt,
      description: fetchedProduct.description || "",
      mainImageUrl: fetchedProduct.imageUrls.main,
      secondaryImageUrls: fetchedProduct.imageUrls.secondary?.join(", ") || "",
    };

    showEditProductModal.value = true;
  } catch (error: unknown) {
    console.error("Failed to fetch product:", error);
    toast.error(t("failedToFetchProduct"));
  } finally {
    loadingProducts.value = false;
  }
};

const closeEditProductModal = () => {
  showEditProductModal.value = false;
};

// CRUD Operations
const changeCategory = async (newCategoryId: string) => {
  if (!productToChangeCategory.value) return;

  if (!newCategoryId) {
    toast.error(t("selectNewCategory"));
    return;
  }

  loadingProducts.value = true;

  try {
    await updateProductCategory(
      productToChangeCategory.value._id,
      newCategoryId
    );
    fetchProducts();
    toast.success(t("productCategoryUpdatedSuccessfully"));
    closeChangeCategoryModal();
  } catch (error: unknown) {
    console.error("Failed to update product category:", error);
    toast.error(t("failedToUpdateProductCategory"));
    loadingProducts.value = false;
  }
};

const submitAddProductForm = async () => {
  loadingProducts.value = true;

  try {
    const product: ProductInput = {
      name: newProduct.value.name,
      slug: newProduct.value.slug,
      category: selectedCategory.value,
      price: {
        rubles: { amount: newProduct.value.priceRubles },
        euros: { amount: newProduct.value.priceEuros },
      },
      artist: newProduct.value.artist || undefined,
      size: newProduct.value.size,
      material: newProduct.value.material,
      parts: newProduct.value.parts || undefined,
      boxArt: newProduct.value.boxArt,
      description: newProduct.value.description || undefined,
      imageUrls: {
        main: newProduct.value.mainImageUrl,
        secondary: newProduct.value.secondaryImageUrls
          ? newProduct.value.secondaryImageUrls
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url !== "")
          : [],
      },
    };

    await addProduct(product);
    emit("productAdded");
    toast.success(t("productAddedSuccessfully"));
    closeAddProductModal();
    fetchProducts();
  } catch (error: unknown) {
    toast.error(t("failedToAddProduct"));
    console.error("Failed to add product:", error);
    loadingProducts.value = false;
  }
};

const submitEditProductForm = async () => {
  loadingProducts.value = true;

  try {
    const product: ProductInput = {
      name: editProduct.value.name,
      slug: editProduct.value.slug,
      category: selectedCategory.value,
      price: {
        rubles: { amount: editProduct.value.priceRubles },
        euros: { amount: editProduct.value.priceEuros },
      },
      artist: editProduct.value.artist || undefined,
      size: editProduct.value.size,
      material: editProduct.value.material,
      parts: editProduct.value.parts || undefined,
      boxArt: editProduct.value.boxArt,
      description: editProduct.value.description || undefined,
      imageUrls: {
        main: editProduct.value.mainImageUrl,
        secondary: editProduct.value.secondaryImageUrls
          ? editProduct.value.secondaryImageUrls
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url !== "")
          : [],
      },
    };

    await updateProduct(editProduct.value.id, product);
    emit("productUpdated");
    toast.success(t("productUpdatedSuccessfully"));
    closeEditProductModal();
    fetchProducts();
  } catch (error: unknown) {
    toast.error(t("failedToUpdateProduct"));
    console.error("Failed to update product:", error);
    loadingProducts.value = false;
  }
};

const deleteProduct = async (id: string) => {
  loadingProducts.value = true;

  try {
    await deleteProductService(id);
    fetchProducts(); // Refresh the list after deletion
    toast.success(t("productDeletedSuccessfully"));
  } catch (error: unknown) {
    console.error("Failed to delete product:", error);
    toast.error(t("failedToDeleteProduct"));
    loadingProducts.value = false;
  }
};

// Watchers & Lifecycle
watch(selectedCategory, (newCategoryId) => {
  if (newCategoryId) {
    fetchProducts();
  }
});

onMounted(() => {
  fetchCategories();
  on("productAdded", fetchProducts);
  on("productUpdated", fetchProducts);
});
</script>
