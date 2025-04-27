<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2 v-if="isEditing">{{ $t("editOrder") }}</h2>
      <h2 v-else>{{ $t("orderDetails") }}</h2>
      <div v-if="order">
        <!-- Order Details Section -->
        <section class="form-section">
          <h3>{{ $t("orderDetails") }}</h3>
          <p>
            <strong>{{ $t("orderId") }}:</strong>
            {{ order.orderNumber }}
          </p>
          <p>
            <strong>{{ $t("date") }}:</strong>
            {{ new Date(order.dateOfCreation).toLocaleString() }}
          </p>
          <div class="form-group">
            <label for="status">{{ $t("status") }}:</label>
            <template v-if="isEditing">
              <select v-model="order.status" id="status">
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
            </template>
            <template v-else>
              <p>{{ $t(`statuses.${order.status}`) }}</p>
            </template>
          </div>
        </section>

        <!-- Recipient Details Section -->
        <section class="form-section">
          <h3>{{ $t("recipientDetails") }}</h3>
          <div class="form-group">
            <label for="recipientName">{{ $t("recipientName") }}:</label>
            <template v-if="isEditing">
              <input
                type="text"
                v-model="order.recipient.name"
                id="recipientName"
              />
            </template>
            <template v-else>
              <p>{{ order.recipient.name }}</p>
            </template>
          </div>
          <div class="form-group">
            <label for="recipientSurname">{{ $t("recipientSurname") }}:</label>
            <template v-if="isEditing">
              <input
                type="text"
                v-model="order.recipient.surname"
                id="recipientSurname"
              />
            </template>
            <template v-else>
              <p>{{ order.recipient.surname }}</p>
            </template>
          </div>
          <div class="form-group">
            <label for="recipientEmail">{{ $t("recipientEmail") }}:</label>
            <template v-if="isEditing">
              <input
                type="email"
                v-model="order.recipient.email"
                id="recipientEmail"
              />
            </template>
            <template v-else>
              <p>{{ order.recipient.email }}</p>
            </template>
          </div>
          <div class="form-group">
            <label for="recipientPhone">{{ $t("recipientPhone") }}:</label>
            <template v-if="isEditing">
              <input
                type="tel"
                v-model="order.recipient.phone"
                id="recipientPhone"
              />
            </template>
            <template v-else>
              <p>{{ order.recipient.phone }}</p>
            </template>
          </div>
        </section>

        <!-- Shipping Address Section -->
        <section class="form-section">
          <h3>{{ $t("shippingAddress") }}</h3>
          <div class="form-group">
            <label for="country">{{ $t("country") }}:</label>
            <template v-if="isEditing">
              <input
                type="text"
                v-model="shippingAddress.country"
                id="country"
              />
            </template>
            <template v-else>
              <p>{{ shippingAddress.country }}</p>
            </template>
          </div>
          <div class="form-group">
            <label for="city">{{ $t("city") }}:</label>
            <template v-if="isEditing">
              <input type="text" v-model="shippingAddress.city" id="city" />
            </template>
            <template v-else>
              <p>{{ shippingAddress.city }}</p>
            </template>
          </div>
          <div class="form-group">
            <label for="street">{{ $t("street") }}:</label>
            <template v-if="isEditing">
              <input type="text" v-model="shippingAddress.street" id="street" />
            </template>
            <template v-else>
              <p>{{ shippingAddress.street }}</p>
            </template>
          </div>
          <div class="form-group">
            <label for="buildingNumber">{{ $t("buildingNumber") }}:</label>
            <template v-if="isEditing">
              <input
                type="text"
                v-model="shippingAddress.buildingNumber"
                id="buildingNumber"
              />
            </template>
            <template v-else>
              <p>{{ shippingAddress.buildingNumber }}</p>
            </template>
          </div>
          <div class="form-group">
            <label for="apartment">{{ $t("apartment") }}:</label>
            <template v-if="isEditing">
              <input
                type="text"
                v-model="shippingAddress.apartment"
                id="apartment"
              />
            </template>
            <template v-else>
              <p>{{ shippingAddress.apartment }}</p>
            </template>
          </div>
          <div class="form-group">
            <label for="postalCode">{{ $t("postalCode") }}:</label>
            <template v-if="isEditing">
              <input
                type="text"
                v-model="shippingAddress.postalCode"
                id="postalCode"
              />
            </template>
            <template v-else>
              <p>{{ shippingAddress.postalCode }}</p>
            </template>
          </div>
        </section>

        <!-- Products Section -->
        <section class="form-section">
          <h3>{{ $t("products") }}</h3>
          <ProductList
            :products="order.products"
            :isEditing="isEditing"
            @updateProductAmount="updateProductAmount"
            @removeProduct="removeProduct"
          />
          <template v-if="isEditing">
            <button
              type="button"
              class="add-product-button"
              @click="showAddProductFields = !showAddProductFields"
            >
              {{ $t("addNewProduct") }}
            </button>
            <AddProductFields
              v-if="showAddProductFields"
              :existingProductIds="order.products.map((p) => p.productId)"
              @addProduct="addProduct"
            />
          </template>
        </section>

        <!-- Form Actions -->
        <div class="form-actions">
          <button v-if="isEditing" type="submit" @click.prevent="submitForm">
            {{ $t("updateOrder") }}
          </button>
          <button type="button" @click="cancelEdit">
            {{ isEditing ? $t("cancel") : $t("close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import ProductList from "@/components/admin/orders/ProductList.vue";
import AddProductFields from "@/components/admin/orders/AddProductFields.vue";

import type { Product, Order } from "@/types/orders";

interface Props {
  show: boolean;
  isEditing: boolean;
  order: Order | null;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: "close"): void;
  (e: "submitForm", order: Order | null): void;
}>();

const showAddProductFields = ref(false);

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

const close = (): void => {
  emits("close");
};

const submitForm = (): void => {
  emits("submitForm", props.order);
};

const updateProductAmount = (index: number, amount: number): void => {
  if (props.order) {
    props.order.products[index].amount = amount;
  }
};

const removeProduct = (index: number): void => {
  props.order?.products.splice(index, 1);
};

const addProduct = (product: Product): void => {
  if (props.order) {
    props.order.products.push(product);
  }
  showAddProductFields.value = false;
};

const cancelEdit = (): void => {
  emits("close");
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fff;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
}

.form-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-section h3 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  width: fit-content;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
}

.form-actions button[type="button"]:hover {
  background-color: #5a6268;
}

.add-product-button {
  background-color: #28a745;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-product-button:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.add-product-button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.8);
}

.add-product-button:active {
  background-color: #1e7e34;
  transform: scale(0.95);
}
</style>
