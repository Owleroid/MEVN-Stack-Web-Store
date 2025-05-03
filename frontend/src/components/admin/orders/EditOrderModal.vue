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
                {{ new Date(order.dateOfCreation).toLocaleString() }}
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
                <option value="delivered">{{ $t("delivered") }}</option>
                <option value="canceled">{{ $t("canceled") }}</option>
              </select>
              <p v-else class="font-medium">
                {{ $t(statusKey(order.status)) }}
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

// ==============================
// Component Imports
// ==============================
import ProductList from "@/components/admin/orders/ProductList.vue";
import AddProductFields from "@/components/admin/orders/AddProductFields.vue";

// ==============================
// Type Imports
// ==============================
import type { Product, Order } from "@/types/orders";

// ==============================
// Props Definition
// ==============================

/**
 * Component props
 */
interface Props {
  /** Whether to show the modal */
  show: boolean;
  /** Whether the modal is in editing mode */
  isEditing: boolean;
  /** Order data to display/edit */
  order: Order | null;
}

const props = defineProps<Props>();

// ==============================
// Events Definition
// ==============================

/**
 * Component events
 */
const emits = defineEmits<{
  (e: "close"): void;
  (e: "submitForm", order: Order | null): void;
}>();

// ==============================
// State Management
// ==============================

/**
 * Controls visibility of the add product form
 */
const showAddProductFields = ref(false);

// ==============================
// Computed Properties
// ==============================

/**
 * Returns the shipping address of the current order or an empty object
 */
const shippingAddress = computed(() => {
  if (props.order) {
    if (!props.order.shippingAddress) {
      props.order.shippingAddress = {
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

// ==============================
// Utility Functions
// ==============================

/**
 * Converts status string from backend format to translation key format
 * @param status - The order status from backend (e.g. "waiting confirmation")
 * @returns The corresponding translation key (e.g. "waitingConfirmation")
 */
const statusKey = (status: string): string => {
  switch (status) {
    case "waiting confirmation":
      return "waitingConfirmation";
    // All other statuses match their keys
    default:
      return status;
  }
};

// ==============================
// Modal Management
// ==============================

/**
 * Closes the modal
 */
const close = (): void => {
  emits("close");
};

/**
 * Cancels current editing and closes the modal
 */
const cancelEdit = (): void => {
  emits("close");
};

// ==============================
// Form Submission
// ==============================

/**
 * Submits the form with updated order data
 */
const submitForm = (): void => {
  emits("submitForm", props.order);
};

// ==============================
// Product Management
// ==============================

/**
 * Updates the amount of a product
 * @param index - Index of the product in the array
 * @param amount - New product amount
 */
const updateProductAmount = (index: number, amount: number): void => {
  if (props.order) {
    props.order.products[index].amount = amount;
  }
};

/**
 * Removes a product from the order
 * @param index - Index of the product to remove
 */
const removeProduct = (index: number): void => {
  props.order?.products.splice(index, 1);
};

/**
 * Adds a new product to the order
 * @param product - Product to add
 */
const addProduct = (product: Product): void => {
  if (props.order) {
    props.order.products.push(product);
  }
  showAddProductFields.value = false;
};
</script>
