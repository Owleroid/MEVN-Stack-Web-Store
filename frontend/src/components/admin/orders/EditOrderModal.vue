<template>
  <div
    v-if="show"
    class="fixed inset-0 z-10 flex items-center justify-center overflow-auto bg-black/50"
  >
    <div
      class="relative w-11/12 max-w-3xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 my-4 max-h-[90vh] overflow-y-auto transition-all duration-300 transform"
    >
      <!-- Modal Header -->
      <div
        class="sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 rounded-t-xl px-6 pt-6 pb-4"
      >
        <button
          @click="close"
          class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors focus:outline-none focus:text-blue-600"
        >
          &times;
        </button>
        <h2 class="text-xl font-bold text-gray-800">
          {{ isEditing ? $t("editOrder") : $t("orderDetails") }}
        </h2>
      </div>

      <div v-if="order" class="p-6 space-y-6">
        <!-- Order Details Section -->
        <section
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center"
          >
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t("orderDetails") }}
            </h3>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600 mb-1">{{ $t("orderId") }}:</p>
              <p class="font-medium text-gray-800">{{ order.orderNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">{{ $t("date") }}:</p>
              <p class="font-medium text-gray-800">
                {{ formatDate(order.dateOfCreation) }}
              </p>
            </div>
            <div class="col-span-1 md:col-span-2">
              <p class="text-sm text-gray-600 mb-1">{{ $t("status") }}:</p>
              <p class="font-medium">
                <span
                  class="px-3 py-1.5 text-sm rounded-full inline-block"
                  :class="getStatusClass(order.status)"
                >
                  {{ $t(order.status) }}
                </span>
              </p>
            </div>

            <!-- Warehouse Selection -->
            <div class="col-span-1 md:col-span-2">
              <p class="text-sm text-gray-600 mb-1">{{ $t("warehouse") }}:</p>
              <div
                v-if="isEditing"
                class="relative warehouse-dropdown-container"
              >
                <div class="w-full">
                  <button
                    type="button"
                    @click="isWarehouseDropdownOpen = !isWarehouseDropdownOpen"
                    class="w-full flex items-center justify-between p-2.5 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :disabled="!isWarehousesLoaded"
                  >
                    <span>{{ currentWarehouseDisplayName }}</span>
                    <svg
                      class="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <!-- Dropdown options -->
                  <div
                    v-if="isWarehouseDropdownOpen"
                    class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                  >
                    <!-- "No warehouse" option -->
                    <div
                      @click="
                        selectWarehouse('');
                        isWarehouseDropdownOpen = false;
                      "
                      class="p-2.5 hover:bg-gray-100 cursor-pointer"
                      :class="
                        selectedWarehouseId === ''
                          ? 'bg-blue-50 text-blue-700'
                          : ''
                      "
                    >
                      {{ $t("noWarehouse") }}
                    </div>

                    <div
                      v-for="wh in otherWarehouses"
                      :key="wh._id"
                      @click="
                        selectWarehouse(String(wh._id));
                        isWarehouseDropdownOpen = false;
                      "
                      class="p-2.5 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ wh.name }}
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="font-medium text-gray-800">
                {{ warehouseName }}
              </p>
            </div>

            <div class="col-span-1 md:col-span-2 pt-4 border-t border-gray-100">
              <p class="text-sm text-gray-600 mb-1">{{ $t("totalPrice") }}:</p>
              <p class="text-xl font-bold text-gray-800">
                {{ formatPrice(order.totalPrice) }}
              </p>
            </div>
          </div>
        </section>

        <!-- Recipient Details Section -->
        <section
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center"
          >
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t("recipientDetails") }}
            </h3>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="recipientName"
                class="block text-sm text-gray-600 mb-1"
                >{{ $t("recipientName") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="order.recipient.name"
                id="recipientName"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ order.recipient.name }}
              </p>
            </div>

            <div>
              <label
                for="recipientSurname"
                class="block text-sm text-gray-600 mb-1"
                >{{ $t("recipientSurname") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="order.recipient.surname"
                id="recipientSurname"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ order.recipient.surname }}
              </p>
            </div>

            <div>
              <label
                for="recipientEmail"
                class="block text-sm text-gray-600 mb-1"
                >{{ $t("recipientEmail") }}:</label
              >
              <input
                v-if="isEditing"
                type="email"
                v-model="order.recipient.email"
                id="recipientEmail"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ order.recipient.email }}
              </p>
            </div>

            <div>
              <label
                for="recipientPhone"
                class="block text-sm text-gray-600 mb-1"
                >{{ $t("recipientPhone") }}:</label
              >
              <input
                v-if="isEditing"
                type="tel"
                v-model="order.recipient.phone"
                id="recipientPhone"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ order.recipient.phone }}
              </p>
            </div>
          </div>
        </section>

        <!-- Shipping Address Section -->
        <section
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center"
          >
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t("shippingAddress") }}
            </h3>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="country" class="block text-sm text-gray-600 mb-1"
                >{{ $t("country") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="shippingAddress.country"
                id="country"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ shippingAddress.country }}
              </p>
            </div>

            <div>
              <label for="city" class="block text-sm text-gray-600 mb-1"
                >{{ $t("city") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="shippingAddress.city"
                id="city"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ shippingAddress.city }}
              </p>
            </div>

            <div>
              <label for="street" class="block text-sm text-gray-600 mb-1"
                >{{ $t("street") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="shippingAddress.street"
                id="street"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ shippingAddress.street }}
              </p>
            </div>

            <div>
              <label
                for="buildingNumber"
                class="block text-sm text-gray-600 mb-1"
                >{{ $t("buildingNumber") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="shippingAddress.buildingNumber"
                id="buildingNumber"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ shippingAddress.buildingNumber }}
              </p>
            </div>

            <div>
              <label for="apartment" class="block text-sm text-gray-600 mb-1"
                >{{ $t("apartment") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="shippingAddress.apartment"
                id="apartment"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ shippingAddress.apartment }}
              </p>
            </div>

            <div>
              <label for="postalCode" class="block text-sm text-gray-600 mb-1"
                >{{ $t("postalCode") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="shippingAddress.postalCode"
                id="postalCode"
                class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <p v-else class="font-medium text-gray-800">
                {{ shippingAddress.postalCode }}
              </p>
            </div>
          </div>
        </section>

        <!-- Products Section -->
        <section
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center"
          >
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t("products") }}
            </h3>
          </div>
          <div class="p-6">
            <ProductList
              :products="order.products"
              :isEditing="isEditing"
              @updateProductAmount="updateProductAmount"
              @removeProduct="removeProduct"
            />

            <div v-if="isEditing" class="mt-6">
              <button
                type="button"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
                @click="showAddProductFields = !showAddProductFields"
              >
                {{ $t("addNewProduct") }}
              </button>

              <div class="mt-6">
                <AddProductFields
                  v-if="showAddProductFields"
                  :existingProductIds="order.products.map((p) => p.productId)"
                  @addProduct="addProduct"
                  @close="showAddProductFields = false"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Form Actions -->
        <div class="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            v-if="isEditing"
            type="submit"
            @click.prevent="submitForm"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transform hover:scale-105 shadow-sm"
          >
            {{ $t("updateOrder") }}
          </button>

          <button
            type="button"
            @click="cancelEdit"
            class="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transform hover:scale-105 shadow-sm"
          >
            {{ isEditing ? $t("cancel") : $t("close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import ProductList from "@/components/admin/orders/ProductList.vue";
import AddProductFields from "@/components/admin/orders/AddProductFields.vue";

import type {
  OrderProduct,
  OrderData,
  OrderStatus,
  Address,
} from "@/types/orders";
import type { Warehouse } from "@/types/warehouse";
import { getStatusClass } from "@/utils/orderUtils";
import { getWarehouses } from "@/services/warehouseService";

// Composables
const { t } = useI18n();
const toast = useToast();

// Props Definition
const props = defineProps<{
  show: boolean;
  isEditing: boolean;
  order: OrderData | null;
}>();

// Events Definition
const emit = defineEmits<{
  (e: "close"): void;
  (e: "submitForm", order: OrderData | null): void;
}>();

// State Management
const showAddProductFields = ref<boolean>(false);
const warehouses = ref<Warehouse[]>([]);
const selectedWarehouseId = ref<string>("");
const isWarehousesLoaded = ref<boolean>(false);
const isWarehouseDropdownOpen = ref<boolean>(false);

const extractWarehouseId = (warehouse: any): string => {
  if (!warehouse) return "";

  if (typeof warehouse === "object" && warehouse._id) {
    return typeof warehouse._id === "object" && warehouse._id.$oid
      ? warehouse._id.$oid
      : String(warehouse._id);
  }

  if (typeof warehouse === "string") {
    return warehouse;
  }

  if (typeof warehouse === "object" && warehouse.$oid) {
    return warehouse.$oid;
  }

  return String(warehouse);
};

onMounted(async () => {
  try {
    warehouses.value = await getWarehouses();
    isWarehousesLoaded.value = true;

    if (props.order?.warehouse) {
      const warehouseId = extractWarehouseId(props.order.warehouse);
      selectedWarehouseId.value = warehouseId;
    }
  } catch (error) {
    console.error("Failed to fetch warehouses:", error);
    toast.error(t("failedToFetchWarehouses"));
  }
});

watch(
  () => props.order,
  (newOrder) => {
    if (newOrder?.warehouse) {
      const warehouseId = extractWarehouseId(newOrder.warehouse);
      selectedWarehouseId.value = warehouseId;
    } else {
      selectedWarehouseId.value = "";
    }
  },
  { immediate: true }
);

watch(
  () => props.show,
  async (isShown) => {
    if (isShown && !isWarehousesLoaded.value) {
      try {
        warehouses.value = await getWarehouses();
        isWarehousesLoaded.value = true;

        if (props.order?.warehouse) {
          const warehouseId = extractWarehouseId(props.order.warehouse);
          selectedWarehouseId.value = warehouseId;
        }
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
        toast.error(t("failedToFetchWarehouses"));
      }
    }
  },
  { immediate: true }
);

// Computed Properties
const shippingAddress = computed<Address>(() => {
  if (props.order) {
    if (!props.order.shippingAddress) {
      return {
        country: "",
        city: "",
        street: "",
        buildingNumber: "",
        apartment: "",
        postalCode: "",
      };
    }
    return props.order.shippingAddress;
  }
  return {
    country: "",
    city: "",
    street: "",
    buildingNumber: "",
    apartment: "",
    postalCode: "",
  };
});

// Computed Properties to filter out current warehouse from options
const otherWarehouses = computed(() => {
  const currentId = extractWarehouseId(props.order?.warehouse);
  return warehouses.value.filter((wh) => String(wh._id) !== currentId);
});

const warehouseName = computed<string>(() => {
  if (props.order?.warehouse) {
    if (
      typeof props.order.warehouse === "object" &&
      props.order.warehouse.name
    ) {
      return props.order.warehouse.name;
    }

    const warehouseId = extractWarehouseId(props.order.warehouse);
    const warehouse = warehouses.value.find(
      (wh) => String(wh._id) === warehouseId
    );

    return warehouse ? warehouse.name : t("warehouseNotFound");
  }
  return t("noWarehouse");
});

const currentWarehouseDisplayName = computed<string>(() => {
  if (!selectedWarehouseId.value) {
    return t("noWarehouse");
  }

  const selectedWarehouse = warehouses.value.find(
    (wh) => String(wh._id) === selectedWarehouseId.value
  );

  if (selectedWarehouse) {
    return selectedWarehouse.name;
  }

  if (
    props.order?.warehouse &&
    typeof props.order.warehouse === "object" &&
    props.order.warehouse.name &&
    extractWarehouseId(props.order.warehouse) === selectedWarehouseId.value
  ) {
    return props.order.warehouse.name;
  }

  return t("warehouseNotFound");
});

// Utility Functions
const formatDate = (date?: Date | string): string => {
  if (!date) return t("dateNotAvailable");
  return new Date(date).toLocaleString();
};

const formatPrice = (price: number): string => {
  const currencyCode = props.order?.currency === "rubles" ? "RUB" : "EUR";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(price);
};

// Modal Management
const close = (): void => {
  emit("close");
};

const cancelEdit = (): void => {
  emit("close");
};

// Form Submission
const submitForm = (): void => {
  if (props.order) {
    const updatedOrder = { ...props.order };
    updatedOrder.warehouse = selectedWarehouseId.value || undefined;
    emit("submitForm", updatedOrder);
  } else {
    emit("submitForm", null);
  }
};

const updateProductAmount = (index: number, amount: number): void => {
  if (props.order) {
    props.order.products[index].amount = amount;
  }
};

const removeProduct = (index: number): void => {
  props.order?.products.splice(index, 1);
};

const addProduct = (product: OrderProduct): void => {
  if (props.order) {
    props.order.products.push(product);
  }
  showAddProductFields.value = false;
};

const selectWarehouse = (warehouseId: string): void => {
  selectedWarehouseId.value = warehouseId;
};

onMounted(() => {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const isClickInside = target.closest(".warehouse-dropdown-container");

    if (!isClickInside && isWarehouseDropdownOpen.value) {
      isWarehouseDropdownOpen.value = false;
    }
  });
});
</script>
