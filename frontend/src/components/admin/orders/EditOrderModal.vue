<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2 v-if="isEditing">{{ $t("editOrderModal.editOrder") }}</h2>
      <h2 v-else>{{ $t("editOrderModal.orderDetails") }}</h2>
      <div v-if="order">
        <p>
          <strong>{{ $t("editOrderModal.orderId") }}:</strong>
          {{ order.orderNumber }}
        </p>
        <p>
          <strong>{{ $t("editOrderModal.date") }}:</strong>
          {{ new Date(order.dateOfCreation).toLocaleString() }}
        </p>
        <p>
          <strong>{{ $t("editOrderModal.status") }}:</strong>
          {{ order.status }}
        </p>
        <p>
          <strong>{{ $t("editOrderModal.checked") }}:</strong>
          {{
            order.checked ? $t("editOrderModal.yes") : $t("editOrderModal.no")
          }}
        </p>
        <p>
          <strong>{{ $t("editOrderModal.products") }}:</strong>
        </p>
        <ProductList
          :products="order.products"
          :isEditing="isEditing"
          @updateProductAmount="updateProductAmount"
          @removeProduct="removeProduct"
        />
        <p>
          <strong>{{ $t("editOrderModal.recipientEmail") }}:</strong>
          {{ order.recipient?.email }}
        </p>
        <p>
          <strong>{{ $t("editOrderModal.recipientPhone") }}:</strong>
          {{ order.recipient?.phone }}
        </p>

        <!-- Edit Form -->
        <div v-if="isEditing">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="status">{{ $t("editOrderModal.status") }}:</label>
              <select v-model="order.status" id="status">
                <option value="waiting confirmation">
                  {{ $t("editOrderModal.waitingConfirmation") }}
                </option>
                <option value="packing">
                  {{ $t("editOrderModal.packing") }}
                </option>
                <option value="sended">
                  {{ $t("editOrderModal.sended") }}
                </option>
                <option value="delivered">
                  {{ $t("editOrderModal.delivered") }}
                </option>
                <option value="canceled">
                  {{ $t("editOrderModal.canceled") }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="checked">{{ $t("editOrderModal.checked") }}:</label>
              <input type="checkbox" v-model="order.checked" id="checked" />
            </div>
            <div class="form-group">
              <label for="recipientEmail"
                >{{ $t("editOrderModal.recipientEmail") }}:</label
              >
              <input
                type="email"
                v-model="recipientEmail"
                id="recipientEmail"
              />
            </div>
            <div class="form-group">
              <label for="recipientPhone"
                >{{ $t("editOrderModal.recipientPhone") }}:</label
              >
              <input type="tel" v-model="recipientPhone" id="recipientPhone" />
            </div>
            <div class="form-group">
              <label for="products">{{ $t("editOrderModal.products") }}:</label>
              <ProductList
                :products="order.products"
                :isEditing="isEditing"
                @updateProductAmount="updateProductAmount"
                @removeProduct="removeProduct"
              />
              <button
                type="button"
                @click="showAddProductFields = !showAddProductFields"
              >
                +
              </button>
              <AddProductFields
                v-if="showAddProductFields"
                :existingProductIds="order.products.map((p) => p.productId)"
                @addProduct="addProduct"
              />
            </div>
            <div class="form-actions">
              <button type="submit">
                {{ $t("editOrderModal.updateOrder") }}
              </button>
              <button type="button" @click="cancelEdit">
                {{ $t("editOrderModal.cancel") }}
              </button>
            </div>
          </form>
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

const recipientEmail = computed<string>({
  get: () => props.order?.recipient?.email || "",
  set: (value) => {
    if (props.order && props.order.recipient) {
      props.order.recipient.email = value;
    }
  },
});

const recipientPhone = computed<string>({
  get: () => props.order?.recipient?.phone || "",
  set: (value) => {
    if (props.order && props.order.recipient) {
      props.order.recipient.phone = value;
    }
  },
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
  props.order?.products.push(product);
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
}

.form-actions button[type="button"] {
  background-color: #6c757d;
}

.form-actions button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
