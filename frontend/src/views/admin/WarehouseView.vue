<template>
  <div class="admin-warehouse">
    <div class="top-center">
      <!-- Block 1: Top Center -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import type { Category } from "@/types/categories";
import type { Warehouse } from "@/types/warehouse";

import { getAllCategories } from "@/services/categoryService";
import { getProductIdsByCategory } from "@/services/productService";
import {
  getWarehouses,
  updateWarehouseProductAmount,
} from "@/services/warehouseService";

const { t } = useI18n();

const warehouses = ref<Warehouse[]>([]);
const categories = ref<Category[]>([]);
const productIds = ref<string[]>([]);
const selectedWarehouseId = ref<string>("");
const selectedCategoryId = ref<string>("");

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

    originalAmounts.value = {};
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

watch(selectedWarehouseId, async (newWarehouseId) => {
  if (newWarehouseId) {
    const warehouse = warehouses.value.find(
      (warehouse) => warehouse._id === newWarehouseId
    );

    if (warehouse) {
      originalAmounts.value = {};
      warehouse.products.forEach((product) => {
        originalAmounts.value[product.product] = product.amount;
      });
    }
  }
});

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
  gap: 24px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
}

.top-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.warehouse-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.warehouse-actions select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #ffffff;
  font-size: 1em;
  color: #333;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: 250px;
}

.warehouse-actions select:hover {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.warehouse-actions select:focus {
  outline: none;
  border-color: #0056b3;
  box-shadow: 0 0 6px rgba(0, 86, 179, 0.7);
}

.content {
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: 100%;
}

.left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #ddd;
}

.left button {
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.left button:hover {
  background-color: #0056b3;
  transform: scale(1.02);
}

.left button.active {
  background-color: #0056b3;
  color: white;
}

.right {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #ddd;
}

.right table {
  width: 100%;
  border-collapse: collapse;
}

.right th,
.right td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.right th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.product-row:hover {
  background-color: #f1f1f1;
}

input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1em;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.right button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.right button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.right button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
