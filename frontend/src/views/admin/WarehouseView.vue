<template>
  <div class="admin-warehouse">
    <div class="top-center">
      <!-- Block 1: Top Center -->
      <button @click="toggleAddWarehouseForm">
        {{ $t("addWarehouse") }}
      </button>
      <div v-if="warehouses.length === 0">
        <p>{{ $t("noWarehousesFound") }}</p>
      </div>
      <div v-else class="warehouse-actions">
        <select v-model="selectedWarehouseId">
          <option
            v-for="warehouse in warehouses"
            :key="warehouse._id"
            :value="warehouse._id"
          >
            {{ warehouse.name }}
          </option>
        </select>
        <button @click="toggleDeleteWarehouseModal">
          {{ $t("deleteWarehouse") }}
        </button>
      </div>
    </div>

    <div v-if="warehouses.length > 0 && categories.length > 0" class="content">
      <!-- Block 2: Left -->
      <div class="left">
        <div v-for="category in categories" :key="category._id">
          <button
            @click="selectCategory(category)"
            :class="{ active: category._id === selectedCategoryId }"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Block 3: Right -->
      <div class="right">
        <div v-if="filteredProducts.length === 0">
          <p>{{ $t("noProductsFound") }}</p>
          <button @click="redirectToAdminProductPage">
            {{ $t("addNewProduct") }}
          </button>
        </div>
        <div v-else>
          <table>
            <thead>
              <tr>
                <th>{{ $t("productName") }}</th>
                <th>{{ $t("amount") }}</th>
                <th>{{ $t("action") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in filteredProducts"
                :key="product.product"
                class="product-row"
              >
                <td>{{ product.name }}</td>
                <td>
                  <input type="number" v-model.number="product.amount" />
                </td>
                <td>
                  <button
                    @click="updateProductAmount(product)"
                    :disabled="!hasAmountChanged(product)"
                  >
                    {{ $t("updateAmount") }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <AddWarehouseModal
      :show="showAddWarehouseForm"
      @submitAddForm="addNewWarehouse"
      @cancelAdd="toggleAddWarehouseForm"
    />

    <DeleteWarehouseModal
      :show="showDeleteWarehouseModal"
      :warehouses="warehouses"
      @confirmDelete="removeWarehouse"
      @cancelDelete="toggleDeleteWarehouseModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import AddWarehouseModal from "@/components/admin/warehouses/AddWarehouseModal.vue";
import DeleteWarehouseModal from "@/components/admin/warehouses/DeleteWarehouseModal.vue";

import type { Category } from "@/types/categories";
import type { Warehouse } from "@/types/warehouse";

import { getAllCategories } from "@/services/categoryService";
import { getProductIdsByCategory } from "@/services/productService";
import {
  getWarehouses,
  addWarehouse,
  deleteWarehouse,
  updateWarehouseProductAmount,
} from "@/services/warehouseService";

const { t } = useI18n();

const warehouses = ref<Warehouse[]>([]);
const categories = ref<Category[]>([]);
const productIds = ref<string[]>([]);
const selectedWarehouseId = ref<string>("");
const selectedCategoryId = ref<string>("");
const showAddWarehouseForm = ref<boolean>(false);
const showDeleteWarehouseModal = ref<boolean>(false);

const toast = useToast();
const router = useRouter();

const selectedWarehouse = computed(() => {
  return warehouses.value.find(
    (warehouse) => warehouse._id === selectedWarehouseId.value
  );
});
const filteredProducts = computed(() => {
  if (!selectedWarehouse.value) return [];
  return selectedWarehouse.value.products.filter((product) =>
    productIds.value.includes(product.product)
  );
});

const originalAmounts = ref<{ [key: string]: number }>({});

const toggleAddWarehouseForm = () => {
  showAddWarehouseForm.value = !showAddWarehouseForm.value;
};

const toggleDeleteWarehouseModal = () => {
  showDeleteWarehouseModal.value = !showDeleteWarehouseModal.value;
};

const addNewWarehouse = async (newWarehouseName: string) => {
  if (!newWarehouseName) {
    toast.error(t("failedToAddWarehouse"));
    return;
  }
  try {
    await addWarehouse(newWarehouseName);
    toast.success(t("warehouseAddedSuccessfully"));
    showAddWarehouseForm.value = false;
    await fetchWarehouses();
  } catch (error) {
    console.error("Failed to add warehouse:", error);
    toast.error(t("failedToAddWarehouse"));
  }
};

const removeWarehouse = async (warehouseId: string) => {
  try {
    await deleteWarehouse(warehouseId);
    toast.success(t("warehouseDeletedSuccessfully"));
    await fetchWarehouses();
    showDeleteWarehouseModal.value = false;
  } catch (error) {
    console.error("Failed to delete warehouse:", error);
    toast.error(t("failedToDeleteWarehouse"));
  }
};

// const selectWarehouse = (warehouse: Warehouse) => {
//   selectedWarehouseId.value = warehouse._id || "";
//   // Update originalAmounts with the amounts of the products in the selected warehouse
//   if (warehouse.products) {
//     warehouse.products.forEach((product) => {
//       originalAmounts.value[product.product] = product.amount;
//     });
//   }
// };

const selectCategory = (category: Category) => {
  selectedCategoryId.value = category._id || "";
  fetchProducts();
};

const updateProductAmount = async (product: {
  product: string;
  name: string;
  amount: number;
}) => {
  try {
    await updateWarehouseProductAmount(selectedWarehouseId.value, {
      productId: product.product,
      amount: product.amount,
    });
    toast.success(t("productAmountUpdatedSuccessfully"));
    originalAmounts.value[product.product] = product.amount;
    await fetchWarehouses();
  } catch (error) {
    console.error("Failed to update product amount:", error);
    toast.error(t("failedToUpdateProductAmount"));
  }
};

const fetchProducts = async () => {
  try {
    const response = await getProductIdsByCategory(selectedCategoryId.value);
    productIds.value = response.data.productIds;
    if (selectedWarehouse.value) {
      selectedWarehouse.value.products.forEach((product) => {
        originalAmounts.value[product.product] = product.amount;
      });
    }
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    toast.error(t("failedToFetchProducts"));
  }
};

const fetchWarehouses = async () => {
  try {
    const response = await getWarehouses();
    warehouses.value = response;
    if (warehouses.value.length > 0) {
      selectedWarehouseId.value = warehouses.value[0]._id || "";
    }
  } catch (error) {
    console.error("Failed to fetch warehouses:", error);
    toast.error(t("failedToFetchWarehouses"));
  }
};

const fetchCategories = async () => {
  try {
    const response = await getAllCategories();
    categories.value = response.data.categories;
    if (categories.value.length > 0) {
      selectedCategoryId.value = categories.value[0]._id || "";
      fetchProducts();
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    toast.error(t("failedToFetchCategories"));
  }
};

const hasAmountChanged = (product: { product: string; amount: number }) => {
  return product.amount !== originalAmounts.value[product.product];
};

const redirectToAdminProductPage = () => {
  router.push("/admin/products");
};

onMounted(async () => {
  await fetchWarehouses();
  await fetchCategories();
});
</script>

<style scoped>
.admin-warehouse {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.top-center {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-center button {
  margin-top: 0;
}

.warehouse-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.content {
  display: flex;
  width: 100%;
  gap: 20px;
}

.left,
.right {
  flex: 1;
  min-width: 0;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  width: 200px;
  box-sizing: border-box;
}

button:hover {
  background-color: #0056b3;
}

button.active {
  background-color: #0056b3;
  color: white;
}

button[type="button"] {
  background-color: #6c757d;
}

button[type="button"]:hover {
  background-color: #5a6268;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f8f9fa;
}

.product-row:hover {
  background-color: #f1f1f1;
  text-decoration: underline;
}

input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
