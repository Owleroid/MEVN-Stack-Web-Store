<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Main Content -->
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Categories Menu - Fixed width, self-contained height -->
        <div class="w-full md:w-64 self-start sticky top-6">
          <div
            class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col"
          >
            <h2
              class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100"
            >
              {{ $t("categories") }}
            </h2>

            <div class="min-h-fit">
              <!-- Loading State for Categories -->
              <div
                v-if="loadingCategories"
                class="py-8 flex flex-col items-center justify-center"
              >
                <div
                  class="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"
                ></div>
                <p class="text-gray-600 text-sm">
                  {{ $t("loadingCategories") }}
                </p>
              </div>

              <!-- No Categories State -->
              <div
                v-else-if="categories.length === 0"
                class="py-8 flex flex-col justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-gray-300 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p class="text-gray-500 mb-4 text-center">
                  {{ $t("noCategoriesFound") }}
                </p>
                <button
                  @click="goToCategories"
                  class="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  {{ $t("goToCategories") }}
                </button>
              </div>

              <!-- Categories List -->
              <div
                v-else
                class="max-h-[calc(100vh-15rem)] overflow-y-auto pr-1"
              >
                <div class="flex flex-col gap-2">
                  <button
                    v-for="category in categories"
                    :key="category._id"
                    :class="[
                      'py-2.5 px-4 text-sm font-medium rounded-md transition-colors w-full text-left',
                      category._id === selectedCategory
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                    ]"
                    @click="selectCategory(category._id ?? '')"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products List - Adaptive height based on content -->
        <div class="flex-1" v-if="categories.length > 0 || loadingCategories">
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full"
          >
            <!-- Header -->
            <div class="p-4 border-b border-gray-200">
              <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <h2 class="text-lg font-semibold text-gray-800 m-0">
                  {{ selectedCategoryName || $t("allProducts") }}
                </h2>
                <button
                  @click="openAddProductModal"
                  class="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center shadow-sm"
                  :disabled="loadingProducts || categories.length === 0"
                >
                  <span class="mr-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                  {{ $t("addNewProduct") }}
                </button>
              </div>
            </div>

            <!-- Content Area - Will adapt to content height -->
            <div class="flex-1 flex flex-col">
              <transition
                enter-active-class="transition-opacity duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
              >
                <!-- Dynamic content with a different key for each state -->
                <div
                  v-if="loadingProducts"
                  class="flex-1 flex items-center justify-center py-16"
                  key="loading-state"
                >
                  <div class="flex flex-col items-center">
                    <div
                      class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"
                    ></div>
                    <p class="text-gray-600 text-sm">
                      {{ $t("loadingProducts") }}
                    </p>
                  </div>
                </div>

                <div
                  v-else-if="!loadingProducts && products.length === 0"
                  class="flex-1 flex flex-col items-center justify-center py-16"
                  key="empty-state"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-16 w-16 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <p class="text-gray-500 text-lg mb-1">
                    {{ $t("noProductsFound") }}
                  </p>
                  <p class="text-gray-400 text-sm mb-4">
                    {{ $t("addProductsToThisCategory") }}
                  </p>
                  <button
                    @click="openAddProductModal"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    :disabled="categories.length === 0"
                  >
                    {{ $t("addNewProduct") }}
                  </button>
                </div>

                <div
                  v-else
                  class="overflow-x-auto"
                  :key="'products-for-' + selectedCategory"
                >
                  <table class="w-full border-collapse">
                    <thead>
                      <tr>
                        <th
                          class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-20"
                        >
                          {{ $t("productImage") }}
                        </th>
                        <th
                          class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                        >
                          {{ $t("productName") }}
                        </th>
                        <th
                          class="bg-gray-50 p-4 text-right font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-52"
                        >
                          {{ $t("actions") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(product, index) in products"
                        :key="product._id"
                        class="hover:bg-gray-50 transition-colors"
                        :class="{ 'last-row': index === products.length - 1 }"
                      >
                        <td
                          class="p-4 border-b border-gray-200"
                          :class="{
                            'border-b-0': index === products.length - 1,
                          }"
                        >
                          <div
                            class="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center"
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
                        <td
                          class="p-4 border-b border-gray-200 font-medium text-gray-700"
                          :class="{
                            'border-b-0': index === products.length - 1,
                          }"
                        >
                          {{ product.name }}
                        </td>
                        <td
                          class="p-4 border-b border-gray-200"
                          :class="{
                            'border-b-0': index === products.length - 1,
                          }"
                        >
                          <div class="flex flex-wrap justify-end gap-2">
                            <button
                              @click="openChangeCategoryModal(product)"
                              class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                              :title="$t('changeCategory')"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                              </svg>
                            </button>
                            <button
                              @click="openEditProductModal(product)"
                              class="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                              :title="$t('edit')"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              @click="openDeleteProductModal(product)"
                              class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                              :title="$t('delete')"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <transition name="fade" mode="out-in">
        <ChangeCategoryModal
          v-if="showChangeCategoryModal"
          :show="showChangeCategoryModal"
          :productToChangeCategory="productToChangeCategory || {}"
          :categories="categories"
          @close="closeChangeCategoryModal"
          @changeCategory="changeCategory"
        />
      </transition>

      <transition name="fade" mode="out-in">
        <AddEditProductModal
          v-if="showAddProductModal"
          :show="showAddProductModal"
          :isEdit="false"
          :product="newProduct"
          @close="closeAddProductModal"
          @submitForm="submitAddProductForm"
        />
      </transition>

      <transition name="fade" mode="out-in">
        <AddEditProductModal
          v-if="showEditProductModal"
          :show="showEditProductModal"
          :isEdit="true"
          :product="editProduct"
          @close="closeEditProductModal"
          @submitForm="submitEditProductForm"
        />
      </transition>

      <transition name="fade" mode="out-in">
        <DeleteProductModal
          v-if="showDeleteProductModal"
          :show="showDeleteProductModal"
          :product="productToDelete"
          @confirm="confirmDeleteProduct"
          @cancel="closeDeleteProductModal"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { useEventBus } from "@/utils/eventBus";

import ChangeCategoryModal from "@/components/admin/products/ChangeCategoryModal.vue";
import AddEditProductModal from "@/components/admin/products/AddEditProductModal.vue";
import DeleteProductModal from "@/components/admin/products/DeleteProductModal.vue";

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
const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);
const selectedCategory = ref<string>("");

const loadingCategories = ref(true);
const loadingProducts = ref(false);

// Computed properties
const selectedCategoryName = computed(() => {
  const category = categories.value.find(
    (c) => c._id === selectedCategory.value
  );
  return category ? category.name : "";
});

// UI state - modals
const showChangeCategoryModal = ref(false);
const showAddProductModal = ref(false);
const showEditProductModal = ref(false);
const showDeleteProductModal = ref(false);

// Form state
const productToChangeCategory = ref<Product | null>(null);
const productToDelete = ref<Product | undefined>(undefined);

interface ProductFormData {
  name: string;
  slug: string;
  productNumber: string;
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
  productNumber: "",
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
  productNumber: "",
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

  // Set loading state first and clear products to trigger proper transitions
  products.value = [];

  // Start a timer to track loading time
  const loadingTimer = setTimeout(() => {
    loadingProducts.value = true;
  }, 200); // Only show loading state if fetching takes more than 200ms

  try {
    const response = await getProductsByCategoryId(selectedCategory.value);
    products.value = response.products;
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
    toast.error(t("failedToFetchProducts"));
  } finally {
    // Clear the timer and loading state
    clearTimeout(loadingTimer);
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
    productNumber: "",
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
      productNumber: fetchedProduct.productNumber,
      priceRubles: fetchedProduct.price.rubles,
      priceEuros: fetchedProduct.price.euros,
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
      productNumber: newProduct.value.productNumber,
      category: selectedCategory.value,
      price: {
        rubles: newProduct.value.priceRubles,
        euros: newProduct.value.priceEuros,
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
      productNumber: editProduct.value.productNumber,
      category: selectedCategory.value,
      price: {
        rubles: editProduct.value.priceRubles,
        euros: editProduct.value.priceEuros,
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

const openDeleteProductModal = (product: Product) => {
  productToDelete.value = product;
  showDeleteProductModal.value = true;
};

const closeDeleteProductModal = () => {
  showDeleteProductModal.value = false;
  productToDelete.value = undefined;
};

const confirmDeleteProduct = async () => {
  if (!productToDelete.value) return;

  await deleteProduct(productToDelete.value._id);
  closeDeleteProductModal();
};

const deleteProduct = async (id: string) => {
  loadingProducts.value = true;

  try {
    await deleteProductService(id);
    fetchProducts();
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
