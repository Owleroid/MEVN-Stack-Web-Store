<template>
  <div
    v-if="show"
    class="fixed inset-0 z-10 flex items-center justify-center overflow-auto bg-black/40"
  >
    <div
      class="relative w-11/12 max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 my-4 max-h-[90vh] overflow-y-auto"
    >
      <!-- Modal Header -->
      <div
        class="sticky top-0 z-20 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 rounded-t-2xl px-6 pt-6 pb-4"
      >
        <button
          @click="close"
          class="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors"
        >
          &times;
        </button>
        <h2 class="text-2xl font-extrabold text-gray-800 text-center">
          {{ isEditing ? $t("editOrder") : $t("orderDetails") }}
        </h2>
      </div>

      <div v-if="order" class="p-6 space-y-6">
        <!-- Order Details Section -->
        <section
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
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
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
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
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
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
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
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
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
          >
            {{ $t("updateOrder") }}
          </button>

          <button
            type="button"
            @click="cancelEdit"
            class="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm"
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
import { getStatusClass } from "@/utils/orderUtils";

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
