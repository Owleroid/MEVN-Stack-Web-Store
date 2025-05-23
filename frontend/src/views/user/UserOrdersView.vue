<template>
  <div class="max-w-5xl mx-auto p-6">
    <div
      class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8"
    >
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-3">
        {{ $t("pageTitle") }}
      </h1>
      <p class="text-center text-gray-600 text-sm">{{ $t("orderHistory") }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center py-16">
      <div
        class="w-14 h-14 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-6"
      ></div>
      <p class="text-gray-600 text-lg">{{ $t("loading") }}</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center p-8 bg-red-50 text-red-600 rounded-xl my-4 shadow-md"
    >
      <p class="text-lg">{{ error }}</p>
      <button
        @click="fetchOrders(authStore.userId, currentPage)"
        class="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
      >
        {{ $t("retry") }}
      </button>
    </div>

    <!-- Orders List -->
    <div v-else-if="orders.length > 0" class="space-y-8">
      <!-- Sort Controls -->
      <div class="flex justify-end mb-4">
        <button
          @click="toggleSortOrder"
          class="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 shadow rounded-lg text-sm transition-all duration-300"
        >
          <span>{{
            sortOrder === "newest"
              ? $t("sortNewestFirst")
              : $t("sortOldestFirst")
          }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            :class="{ 'rotate-180': sortOrder === 'oldest' }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <TransitionGroup name="list" tag="div" class="space-y-8">
        <div
          v-for="order in sortedOrders"
          :key="order._id"
          class="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 ease-in-out"
        >
          <!-- Order Header -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 flex flex-wrap justify-between items-center"
          >
            <div>
              <h2 class="text-xl font-semibold text-gray-800 flex items-center">
                {{ $t("order") }}:
                <span
                  class="ml-2 bg-white py-1 px-3 rounded-full text-blue-600 text-lg"
                >
                  {{ order.orderNumber }}
                </span>
              </h2>
              <p class="text-sm text-gray-600 mt-2">
                {{
                  new Date(
                    order.dateOfCreation ?? Date.now()
                  ).toLocaleDateString()
                }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <span
                class="px-4 py-1.5 rounded-full text-sm font-medium shadow-sm"
                :class="getStatusClass(order.status)"
              >
                {{ $t(`statuses.${order.status}`) }}
              </span>
              <span
                class="font-medium text-lg bg-white py-1.5 px-4 rounded-lg shadow-sm"
              >
                {{ order.totalPrice }}
                {{ order.currency === "euros" ? "€" : "₽" }}
              </span>
            </div>
          </div>

          <!-- Order Details -->
          <div class="p-5">
            <!-- Products -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-700 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {{ $t("products") }}
              </h3>
              <ul class="bg-gray-50 rounded-lg p-4 divide-y divide-gray-100">
                <li
                  v-for="item in order.products"
                  :key="item.productId"
                  class="py-3 first:pt-1 last:pb-1 flex justify-between items-center"
                >
                  <span class="font-medium">{{ item.name }}</span>
                  <div class="flex flex-col items-end">
                    <span class="text-gray-700">
                      {{ item.amount }} x {{ item.productPrice }}
                      {{ order.currency === "euros" ? "€" : "₽" }}
                    </span>

                    <!-- Discount Info -->
                    <Transition
                      enter-active-class="transition-opacity duration-300 ease-out"
                      enter-from-class="opacity-0"
                      enter-to-class="opacity-100"
                      leave-active-class="transition-opacity duration-300 ease-in"
                      leave-from-class="opacity-100"
                      leave-to-class="opacity-0"
                    >
                      <div v-if="item.discount" class="mt-1 text-xs">
                        <span class="text-gray-500"
                          >{{ $t("originalPrice") }}:
                          {{ item.discount.originalPrice }}
                          {{ order.currency === "euros" ? "€" : "₽" }}</span
                        >
                        <span
                          class="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800"
                        >
                          {{ $t("savedAmount") }}:
                          {{ item.discount.discountAmount }}
                          {{ order.currency === "euros" ? "€" : "₽" }} ({{
                            item.discount.discountPercentage
                          }}%)
                        </span>
                      </div>
                    </Transition>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Order Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Recipient Info -->
              <div
                class="bg-gray-50 p-5 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <h3
                  class="font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {{ $t("recipient.title") }}
                </h3>
                <div class="space-y-3">
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("recipient.email") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.recipient?.email
                    }}</span>
                  </p>
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("recipient.name") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.recipient?.name
                    }}</span>
                  </p>
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("recipient.surname") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.recipient?.surname
                    }}</span>
                  </p>
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("recipient.phone") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.recipient?.phone
                    }}</span>
                  </p>
                </div>
              </div>

              <!-- Delivery Info -->
              <div
                class="bg-gray-50 p-5 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <h3
                  class="font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {{ $t("delivery.title") }}
                </h3>
                <div class="space-y-3">
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("delivery.country") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.shippingAddress?.country
                    }}</span>
                  </p>
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("delivery.city") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.shippingAddress?.city
                    }}</span>
                  </p>
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("delivery.street") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.shippingAddress?.street
                    }}</span>
                  </p>
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("delivery.buildingNumber") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.shippingAddress?.buildingNumber
                    }}</span>
                  </p>
                  <p v-if="order.shippingAddress?.apartment" class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("delivery.apartment") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.shippingAddress?.apartment
                    }}</span>
                  </p>
                  <p class="flex">
                    <span class="text-sm font-medium text-gray-600 w-1/3"
                      >{{ $t("delivery.postalCode") }}:</span
                    >
                    <span class="text-gray-800">{{
                      order.shippingAddress?.postalCode
                    }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="mt-6 space-y-4">
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 transform -translate-y-4"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform -translate-y-4"
              >
                <p
                  v-if="order.orderNotes"
                  class="text-gray-700 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400"
                >
                  <span class="font-medium">{{ $t("notes") }}:</span>
                  {{ order.orderNotes }}
                </p>
              </Transition>

              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 transform -translate-y-4"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform -translate-y-4"
              >
                <p
                  v-if="order.trackingNumber"
                  class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"
                >
                  <span class="font-medium">{{ $t("trackingNumber") }}:</span>
                  <span class="font-mono bg-white px-2 py-1 rounded ml-2">{{
                    order.trackingNumber
                  }}</span>
                </p>
              </Transition>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Pagination Controls -->
      <Transition
        enter-active-class="transition-opacity duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-500 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="pagination.totalPages > 1"
          class="flex justify-center items-center mt-10 bg-white p-4 rounded-xl shadow-md"
        >
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-4 py-2 rounded-lg border flex items-center transition-all duration-300',
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-sm',
            ]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {{ $t("previous") }}
          </button>

          <div class="flex space-x-2 mx-4">
            <TransitionGroup
              tag="div"
              class="flex space-x-2"
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 transform scale-50"
              enter-to-class="opacity-100 transform scale-100"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-50"
              move-class="transition-transform duration-300"
            >
              <button
                v-for="pageNum in displayedPageNumbers"
                :key="pageNum"
                @click="goToPage(pageNum)"
                :class="[
                  'w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300',
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white shadow-md transform scale-110'
                    : 'bg-white text-blue-600 hover:bg-blue-50',
                ]"
              >
                {{ pageNum }}
              </button>
            </TransitionGroup>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === pagination.totalPages"
            :class="[
              'px-4 py-2 rounded-lg border flex items-center transition-all duration-300',
              currentPage === pagination.totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-sm',
            ]"
          >
            {{ $t("next") }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </Transition>
    </div>

    <!-- No Orders State -->
    <Transition
      enter-active-class="transition-opacity duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!loading && !error && orders.length === 0"
        class="text-center py-16 bg-white rounded-xl shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-20 w-20 mx-auto text-gray-400 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <p class="text-xl text-gray-600 mb-4">{{ $t("noOrders") }}</p>
        <router-link
          to="/"
          class="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          {{ $t("startShopping") }}
        </router-link>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";

import type {
  OrderData,
  OrderStatus,
  OrdersListResponse,
} from "@/types/orders";

import { useAuthStore } from "@/stores/authStore";

import { getOrdersByUserId } from "@/services/orderService";

// Composables Setup
const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// State Management
const orders = ref<OrderData[]>([]);
const loading = ref(true);
const error = ref("");
const sortOrder = ref<"newest" | "oldest">("newest");
const currentPage = ref(parseInt(route.query.page as string) || 1);
const pagination = ref({
  totalOrders: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 5,
});

// Computed Properties
const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => {
    const dateA = new Date(a.dateOfCreation || 0).getTime();
    const dateB = new Date(b.dateOfCreation || 0).getTime();

    return sortOrder.value === "newest" ? dateB - dateA : dateA - dateB;
  });
});

const displayedPageNumbers = computed(() => {
  const total = pagination.value.totalPages;
  const current = currentPage.value;

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5];
  } else if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total];
  } else {
    return [current - 2, current - 1, current, current + 1, current + 2];
  }
});

// Methods
const goToPage = (page: number) => {
  if (page < 1 || page > pagination.value.totalPages) {
    return;
  }

  currentPage.value = page;
  router.push({ query: { ...route.query, page: page.toString() } });
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "newest" ? "oldest" : "newest";
  goToPage(1);
};

const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "packing":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "sended":
      return "bg-indigo-100 text-indigo-800 border border-indigo-200";
    case "delivered":
      return "bg-green-100 text-green-800 border border-green-200";
    case "canceled":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

// Data Fetching
async function fetchOrders(userId: string, page: number) {
  loading.value = true;
  error.value = "";

  try {
    const response: OrdersListResponse = await getOrdersByUserId(
      userId,
      page,
      pagination.value.limit
    );

    orders.value = response.orders || [];

    if (response.pagination) {
      pagination.value = response.pagination;
    }
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    error.value = t("fetchOrdersError");
    toast.error(t("fetchOrdersError"));
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.query.page,
  (newPage) => {
    const page = parseInt(newPage as string) || 1;
    if (page !== currentPage.value) {
      currentPage.value = page;
      if (authStore.isAuthenticated) {
        fetchOrders(authStore.userId, currentPage.value);
      }
    }
  }
);

// Lifecycle Hooks
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await fetchOrders(authStore.userId, currentPage.value);
  } else {
    error.value = t("notAuthenticated");
  }
});
</script>
