<template>
  <div
    v-if="show"
    class="fixed inset-0 z-10 flex items-center justify-center overflow-auto bg-black/40"
  >
    <div
      class="relative w-11/12 max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-lg"
    >
      <!-- Modal Header -->
      <button
        @click="close"
        class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors"
      >
        &times;
      </button>

      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        {{ isEditing ? $t("editOrder") : $t("orderDetails") }}
      </h2>

      <div v-if="order" class="space-y-6">
        <!-- Order Details Section -->
        <section class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            {{ $t("orderDetails") }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600 mb-1">{{ $t("orderId") }}:</p>
              <p class="font-medium">{{ order.orderNumber }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600 mb-1">{{ $t("date") }}:</p>
              <p class="font-medium">
                {{ formatDate(order.dateOfCreation) }}
              </p>
            </div>

            <div class="col-span-1 md:col-span-2">
              <p class="text-sm text-gray-600 mb-1">{{ $t("status") }}:</p>
              <select
                v-if="isEditing"
                v-model="order.status"
                id="status"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option
                  value="waiting confirmation"
                  :disabled="order.status !== 'waiting confirmation'"
                >
                  {{ $t("waitingConfirmation") }}
                </option>
                <option value="packing">{{ $t("packing") }}</option>
                <option value="sended">{{ $t("sended") }}</option>
                <option value="delivered">
                  {{ $t("delivered") }}
                </option>
                <option value="canceled">{{ $t("canceled") }}</option>
              </select>
              <p v-else class="font-medium">
                <span
                  class="px-2 py-1 text-sm rounded-full"
                  :class="getStatusClass(order.status)"
                >
                  {{ $t(statusKey(order.status)) }}
                </span>
              </p>
            </div>
          </div>
        </section>

        <!-- Recipient Details Section -->
        <section class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            {{ $t("recipientDetails") }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ order.recipient.name }}</p>
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ order.recipient.surname }}</p>
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ order.recipient.email }}</p>
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ order.recipient.phone }}</p>
            </div>
          </div>
        </section>

        <!-- Shipping Address Section -->
        <section class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            {{ $t("shippingAddress") }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="country" class="block text-sm text-gray-600 mb-1"
                >{{ $t("country") }}:</label
              >
              <input
                v-if="isEditing"
                type="text"
                v-model="shippingAddress.country"
                id="country"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ shippingAddress.country }}</p>
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ shippingAddress.city }}</p>
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ shippingAddress.street }}</p>
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ shippingAddress.apartment }}</p>
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
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="font-medium">{{ shippingAddress.postalCode }}</p>
            </div>
          </div>
        </section>

        <!-- Products Section -->
        <section class="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            {{ $t("products") }}
          </h3>

          <ProductList
            :products="order.products"
            :isEditing="isEditing"
            @updateProductAmount="updateProductAmount"
            @removeProduct="removeProduct"
          />

          <div v-if="isEditing" class="mt-4">
            <button
              type="button"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              @click="showAddProductFields = !showAddProductFields"
            >
              {{ $t("addNewProduct") }}
            </button>

            <div class="mt-6">
              <AddProductFields
                v-if="showAddProductFields"
                :existingProductIds="order.products.map((p) => p.productId)"
                @addProduct="addProduct"
              />
            </div>
          </div>
        </section>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 py-4">
          <button
            v-if="isEditing"
            type="submit"
            @click.prevent="submitForm"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {{ $t("updateOrder") }}
          </button>

          <button
            type="button"
            @click="cancelEdit"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {{ isEditing ? $t("cancel") : $t("close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import ProductList from "@/components/admin/orders/ProductList.vue";
import AddProductFields from "@/components/admin/orders/AddProductFields.vue";

import type {
  OrderProduct,
  OrderData,
  OrderStatus,
  Address,
} from "@/types/orders";

// Composables
const { t } = useI18n();

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

// Computed Properties
const shippingAddress = computed<Address>(() => {
  if (props.order) {
    if (!props.order.shippingAddress) {
      // Ensure we always have a valid shipping address object
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

// Utility Functions
const formatDate = (date?: Date | string): string => {
  if (!date) return t("dateNotAvailable");

  return new Date(date).toLocaleString();
};

const statusKey = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "waitingConfirmation";
    case "packing":
      return "packing";
    case "sended":
      return "sended";
    case "delivered":
      return "delivered";
    case "canceled":
      return "canceled";
    default:
      return "unknown";
  }
};

const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "bg-yellow-100 text-yellow-800";
    case "packing":
      return "bg-blue-100 text-blue-800";
    case "sended":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
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
  emit("submitForm", props.order);
};

// Product Management
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
</script>
