<template>
  <div>
    <h1>Orders</h1>

    <!-- Block for New Orders -->
    <div>
      <h2>New Orders</h2>
      <div v-if="newOrders.length === 0">
        <p>No new orders</p>
      </div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Products</th>
              <th>Recipient Email</th>
              <th>Recipient Phone</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in newOrders" :key="order._id">
              <td @click="viewOrder(order)" class="clickable">{{ order.orderNumber }}</td>
              <td>
                <ul>
                  <li v-for="product in order.products" :key="product.productId">
                    {{ product.name }} ({{ product.amount }})
                  </li>
                </ul>
              </td>
              <td>{{ order.recipient?.email }}</td>
              <td>{{ order.recipient?.phone }}</td>
              <td>{{ new Date(order.dateOfCreation).toLocaleString() }}</td>
              <td>
                <select v-model="order.status" @change="updateOrderStatus(order._id, order.status)">
                  <option value="waiting confirmation">Waiting Confirmation</option>
                  <option value="packing">Packing</option>
                  <option value="sended">Sended</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </td>
              <td>
                <button @click.stop="editOrder(order)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Block for All Orders with Filters -->
    <div>
      <h2>All Orders</h2>
      <div class="filters">
        <label for="sortOrder">Sort by Date:</label>
        <select v-model="sortOrder">
          <option value="newest">Newest to Oldest</option>
          <option value="oldest">Oldest to Newest</option>
        </select>

        <label for="statusFilter">Filter by Status:</label>
        <select v-model="statusFilter">
          <option value="">All</option>
          <option value="waiting confirmation">Waiting Confirmation</option>
          <option value="packing">Packing</option>
          <option value="sended">Sended</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div v-if="filteredOrders.length === 0">
        <p>No orders found</p>
      </div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Products</th>
              <th>Recipient Email</th>
              <th>Recipient Phone</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order._id">
              <td @click="viewOrder(order)" class="clickable">{{ order.orderNumber }}</td>
              <td>
                <ul>
                  <li v-for="product in order.products" :key="product.productId">
                    {{ product.name }} ({{ product.amount }})
                  </li>
                </ul>
              </td>
              <td>{{ order.recipient?.email }}</td>
              <td>{{ order.recipient?.phone }}</td>
              <td>{{ new Date(order.dateOfCreation).toLocaleString() }}</td>
              <td>
                <select v-model="order.status" @change="updateOrderStatus(order._id, order.status)">
                  <option value="waiting confirmation">Waiting Confirmation</option>
                  <option value="packing">Packing</option>
                  <option value="sended">Sended</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </td>
              <td>
                <button @click.stop="editOrder(order)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Viewing and Editing Order Details -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2 v-if="isEditing">Edit Order</h2>
        <h2 v-else>Order Details</h2>
        <div v-if="selectedOrder">
          <p><strong>Order ID:</strong> {{ selectedOrder.orderNumber }}</p>
          <p><strong>Date:</strong> {{ new Date(selectedOrder.dateOfCreation).toLocaleString() }}</p>
          <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
          <p><strong>Checked:</strong> {{ selectedOrder.checked ? 'Yes' : 'No' }}</p>
          <p><strong>Products:</strong></p>
          <ul>
            <li v-for="product in selectedOrder.products" :key="product.productId">
              {{ product.name }} ({{ product.amount }})
            </li>
          </ul>
          <p><strong>Recipient Email:</strong> {{ selectedOrder.recipient?.email }}</p>
          <p><strong>Recipient Phone:</strong> {{ selectedOrder.recipient?.phone }}</p>
          <!-- Add more order details as needed -->

          <!-- Edit Form -->
          <div v-if="isEditing">
            <form @submit.prevent="updateOrder">
              <div>
                <label for="status">Status:</label>
                <select v-model="selectedOrder.status" id="status">
                  <option value="waiting confirmation">Waiting Confirmation</option>
                  <option value="packing">Packing</option>
                  <option value="sended">Sended</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
              <div>
                <label for="checked">Checked:</label>
                <input type="checkbox" v-model="selectedOrder.checked" id="checked" />
              </div>
              <div>
                <label for="recipientEmail">Recipient Email:</label>
                <input type="email" v-model="recipientEmail" id="recipientEmail" />
              </div>
              <div>
                <label for="recipientPhone">Recipient Phone:</label>
                <input type="tel" v-model="recipientPhone" id="recipientPhone" />
              </div>
              <div>
                <label for="products">Products:</label>
                <ul>
                  <li v-for="(product, index) in selectedOrder.products" :key="product.productId">
                    {{ product.name }} 
                    <input type="number" v-model.number="product.amount" min="1" @input="updateProductAmount(index, product.amount)" />
                    <button type="button" @click="removeProduct(index)">Remove</button>
                  </li>
                </ul>
                <button type="button" @click="showAddProductFields = !showAddProductFields">+</button>
                <div v-if="showAddProductFields">
                  <label for="newProductName">New Product Name:</label>
                  <input type="text" v-model="newProductName" id="newProductName" @input="searchProducts" />
                  <ul v-if="searchResults.length > 0">
                    <li v-for="product in searchResults" :key="product._id" @click="selectProduct(product)">
                      {{ product.name }}
                    </li>
                  </ul>
                  <label for="newProductAmount">Amount:</label>
                  <input type="number" v-model.number="newProductAmount" id="newProductAmount" min="1" />
                  <button type="button" @click="addProduct">Add Product</button>
                </div>
              </div>
              <!-- Add more fields as needed -->
              <div class="form-actions">
                <button type="submit">Update Order</button>
                <button type="button" @click="cancelEdit">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

import type { Order } from '../../../types/orders';
import type { Product } from '../../../types/products';

import { searchProductsByName } from '../../../services/productService';
import { getAllOrders, editOrderById } from '../../../services/orderService';

const orders = ref<Order[]>([]);
const sortOrder = ref('newest');
const statusFilter = ref('');
const showModal = ref(false);
const selectedOrder = ref<Order | null>(null);
const isEditing = ref(false);
const currency = ref<'rubles' | 'euros'>('euros');

const fetchOrders = async () => {
  try {
    const response = await getAllOrders();
    orders.value = response.data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const newOrders = computed(() => {
  return orders.value.filter(order => !order.checked);
});

const filteredOrders = computed(() => {
  let filtered = orders.value;

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }

  if (sortOrder.value === 'newest') {
    filtered = filtered.sort((a, b) => new Date(b.dateOfCreation).getTime() - new Date(a.dateOfCreation).getTime());
  } else {
    filtered = filtered.sort((a, b) => new Date(a.dateOfCreation).getTime() - new Date(b.dateOfCreation).getTime());
  }

  return filtered;
});

const viewOrder = (order: Order) => {
  selectedOrder.value = order;
  isEditing.value = false;
  showModal.value = true;
};

const editOrder = (order: Order) => {
  selectedOrder.value = order;
  isEditing.value = true;
  showAddProductFields.value = false;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
  isEditing.value = false;
  showAddProductFields.value = false;
};

const updateOrder = async () => {
  if (selectedOrder.value) {
    try {
      await editOrderById(selectedOrder.value._id, selectedOrder.value);
      fetchOrders();
      closeModal();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }
};

const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    await editOrderById(orderId, { status: status as 'waiting confirmation' | 'packing' | 'sended' | 'delivered' | 'canceled' });
    fetchOrders();
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

const showAddProductFields = ref(false);
const newProductName = ref('');
const newProductAmount = ref(1);
const searchResults = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);

const searchProducts = async () => {
  if (newProductName.value) {
    try {
      const response = await searchProductsByName(newProductName.value);
      const allProducts = response.data.products;

      // Filter out products that are already in the order
      const existingProductIds = selectedOrder.value?.products.map(p => p.productId) || [];
      searchResults.value = allProducts.filter((product: { _id: string; }) => !existingProductIds.includes(product._id));
    } catch (error) {
      console.error('Error searching products:', error);
    }
  } else {
    searchResults.value = [];
  }
};

const selectProduct = (product: Product) => {
  selectedProduct.value = product;
  newProductName.value = product.name;
  searchResults.value = [];
};

const addProduct = () => {
  if (selectedProduct.value && newProductAmount.value > 0) {
    const productPrice = currency.value === 'rubles' ? selectedProduct.value.price.rubles.amount : selectedProduct.value.price.euros.amount;

    selectedOrder.value?.products.push({
      productId: selectedProduct.value._id,
      name: selectedProduct.value.name,
      amount: newProductAmount.value,
      productPrice: productPrice,
    });
    newProductName.value = '';
    newProductAmount.value = 1;
    selectedProduct.value = null;
    showAddProductFields.value = false;
  }
};

const removeProduct = (index: number) => {
  selectedOrder.value?.products.splice(index, 1);
};

const updateProductAmount = (index: number, amount: number) => {
  if (selectedOrder.value) {
    selectedOrder.value.products[index].amount = amount;
  }
};

const cancelEdit = () => {
  fetchOrders();
  closeModal();
};

const recipientEmail = computed({
  get: () => selectedOrder.value?.recipient?.email || '',
  set: (value) => {
    if (selectedOrder.value && selectedOrder.value.recipient) {
      selectedOrder.value.recipient.email = value;
    }
  }
});

const recipientPhone = computed({
  get: () => selectedOrder.value?.recipient?.phone || '',
  set: (value) => {
    if (selectedOrder.value && selectedOrder.value.recipient) {
      selectedOrder.value.recipient.phone = value;
    }
  }
});

onMounted(() => {
  currency.value = (sessionStorage.getItem('currency') as 'rubles' | 'euros') || 'euros';
  fetchOrders();
});
</script>

<style scoped>
.filters {
  margin-bottom: 20px;
}

.filters label {
  margin-right: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

.clickable {
  cursor: pointer;
  text-decoration: underline;
}

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
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
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

form div {
  margin-bottom: 15px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input[type="text"],
form input[type="email"],
form input[type="tel"],
form input[type="number"],
form select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

form ul {
  list-style-type: none;
  padding: 0;
}

form ul li {
  margin-bottom: 10px;
}

form button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  width: fit-content;
}

form button:hover {
  background-color: #0056b3;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  width: fit-content;
}

button:hover {
  background-color: #0056b3;
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