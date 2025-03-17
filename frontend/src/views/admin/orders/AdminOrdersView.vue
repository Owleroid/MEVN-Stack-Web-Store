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
              <td @click="viewOrder(order)" class="clickable">{{ order._id }}</td>
              <td>
                <ul>
                  <li v-for="product in order.products" :key="product.productId">
                    {{ product.name }} ({{ product.amount }})
                  </li>
                </ul>
              </td>
              <td>{{ order.recipient.email }}</td>
              <td>{{ order.recipient.phone }}</td>
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
              <td @click="viewOrder(order)" class="clickable">{{ order._id }}</td>
              <td>
                <ul>
                  <li v-for="product in order.products" :key="product.productId">
                    {{ product.name }} ({{ product.amount }})
                  </li>
                </ul>
              </td>
              <td>{{ order.recipient.email }}</td>
              <td>{{ order.recipient.phone }}</td>
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
          <p><strong>Order ID:</strong> {{ selectedOrder._id }}</p>
          <p><strong>Date:</strong> {{ new Date(selectedOrder.dateOfCreation).toLocaleString() }}</p>
          <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
          <p><strong>Checked:</strong> {{ selectedOrder.checked ? 'Yes' : 'No' }}</p>
          <p><strong>Products:</strong></p>
          <ul>
            <li v-for="product in selectedOrder.products" :key="product.productId">
              {{ product.name }} ({{ product.amount }})
            </li>
          </ul>
          <p><strong>Recipient Email:</strong> {{ selectedOrder.recipient.email }}</p>
          <p><strong>Recipient Phone:</strong> {{ selectedOrder.recipient.phone }}</p>
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
              <!-- Add more fields as needed -->
              <button type="submit">Update Order</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAllOrders, editOrderById } from '../../../services/orderService';
import type { OrderData } from '../../../types/orders';

const orders = ref<OrderData[]>([]);
const sortOrder = ref('newest');
const statusFilter = ref('');
const showModal = ref(false);
const selectedOrder = ref<OrderData | null>(null);
const isEditing = ref(false);
const router = useRouter();

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

const viewOrder = (order: OrderData) => {
  selectedOrder.value = order;
  isEditing.value = false;
  showModal.value = true;
};

const editOrder = (order: OrderData) => {
  selectedOrder.value = order;
  isEditing.value = true;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
  isEditing.value = false;
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
    await editOrderById(orderId, { status });
    fetchOrders();
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

onMounted(() => {
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
</style>