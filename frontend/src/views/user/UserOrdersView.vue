<template>
  <div class="px-4 py-8 md:py-10 max-w-5xl mx-auto">
    <!-- Settings/Orders Toggle -->
    <div class="flex justify-between items-center mb-8">
      <div
        class="flex-1 py-2 flex justify-center border-r border-main-gray-hover"
      >
        <router-link to="/settings" class="text-3xl text-main-gray-hover">
          {{ $t("settings") }}
        </router-link>
      </div>
      <div
        class="flex-1 py-2 flex justify-center border-l border-main-gray-hover"
      >
        <router-link to="/orders" class="text-main-red text-3xl">
          {{ $t("orders") }}
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center py-16">
      <div
        class="w-14 h-14 border-4 border-white border-opacity-20 border-t-main-red rounded-full animate-spin mb-6"
      ></div>
      <p class="text-white text-lg">{{ $t("loading") }}</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center p-8 bg-black bg-opacity-30 text-red-400 border border-red-800 my-4"
    >
      <p class="text-lg">{{ error }}</p>
      <button
        @click="fetchOrders(authStore.userId, currentPage)"
        class="mt-6 px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] border border-[#240000] focus:outline-none transition-colors duration-300 ease-in-out"
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
          class="flex items-center gap-2 px-4 py-2 bg-black bg-opacity-60 border border-white border-opacity-50 hover:border-opacity-70 text-white text-sm transition-all duration-300 ease-in-out"
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
          class="relative bg-white text-black max-w-lg mx-auto shadow-md overflow-visible"
        >
          <!-- Scalloped top edge -->
          <div class="w-full h-3 relative -mt-3 mb-0">
            <svg
              class="w-full h-3 absolute bottom-0 left-0"
              viewBox="0 0 400 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 L0,12 
                       L0,12 L5,6 L10,12 L15,6 L20,12 L25,6 L30,12 L35,6 L40,12 L45,6 L50,12 L55,6 L60,12 L65,6 L70,12 L75,6 
                       L80,12 L85,6 L90,12 L95,6 L100,12 L105,6 L110,12 L115,6 L120,12 L125,6 L130,12 L135,6 L140,12 L145,6
                       L150,12 L155,6 L160,12 L165,6 L170,12 L175,6 L180,12 L185,6 L190,12 L195,6 L200,12 L205,6 L210,12 L215,6
                       L220,12 L225,6 L230,12 L235,6 L240,12 L245,6 L250,12 L255,6 L260,12 L265,6 L270,12 L275,6 L280,12 L285,6
                       L290,12 L295,6 L300,12 L305,6 L310,12 L315,6 L320,12 L325,6 L330,12 L335,6 L340,12 L345,6 L350,12 L355,6
                       L360,12 L365,6 L370,12 L375,6 L380,12 L385,6 L390,12 L395,6 L400,12 L400,0 Z"
                fill="url(#grad1)"
              />
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style="stop-color: #191919; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #0e0e0e; stop-opacity: 1"
                />
              </linearGradient>
            </svg>
          </div>

          <!-- Receipt Content -->
          <div class="px-5 pt-5 pb-2 bg-white">
            <div class="text-center mb-3">
              <h2 class="text-2xl font-medium text-gray-800">
                {{ $t("receipt") }}
              </h2>
            </div>

            <div
              class="border-t border-b border-dashed border-gray-300 py-3 mb-4"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-600">
                    {{ order.orderNumber }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{
                      new Date(
                        order.dateOfCreation ?? Date.now()
                      ).toLocaleDateString()
                    }}
                  </p>
                </div>
                <span
                  class="px-3 py-1 text-sm font-medium"
                  :class="getReceiptStatusClass(order.status)"
                >
                  {{ $t(`statuses.${order.status}`) }}
                </span>
              </div>
            </div>

            <!-- Products -->
            <div class="mb-4">
              <ul class="divide-y divide-dashed divide-gray-300">
                <li
                  v-for="item in order.products"
                  :key="item.productId"
                  class="py-3 first:pt-1 last:pb-1 flex justify-between"
                >
                  <div class="max-w-[75%]">
                    <span class="text-gray-800 font-medium">{{
                      item.name
                    }}</span>
                    <p class="text-xs text-gray-500">
                      {{ item.amount }}x{{ item.productPrice }}
                    </p>

                    <!-- Discount Info -->
                    <Transition
                      enter-active-class="transition-opacity duration-300 ease-out"
                      enter-from-class="opacity-0"
                      enter-to-class="opacity-100"
                      leave-active-class="transition-opacity duration-300 ease-in"
                      leave-from-class="opacity-100"
                      leave-to-class="opacity-0"
                    >
                      <p
                        v-if="item.discount"
                        class="text-xs text-green-700 mt-1"
                      >
                        <span class="line-through text-gray-500"
                          >{{ item.discount.originalPrice
                          }}{{ order.currency === "euros" ? "€" : "₽" }}</span
                        >
                        <span class="ml-1 bg-green-50 px-1 py-0.5 rounded"
                          >-{{ item.discount.discountPercentage }}%</span
                        >
                        <span class="block mt-0.5"
                          >{{ $t("savedAmount") }}:
                          {{ item.discount.discountAmount
                          }}{{ order.currency === "euros" ? "€" : "₽" }}</span
                        >
                      </p>
                    </Transition>
                  </div>
                  <span class="text-gray-800 font-mono">
                    {{
                      ((item.amount || 0) * (item.productPrice || 0)).toFixed(2)
                    }}
                    {{ order.currency === "euros" ? "€" : "₽" }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- Totals -->
            <div
              class="border-t border-b border-dashed border-gray-300 py-3 mb-3"
            >
              <div class="flex justify-between font-semibold">
                <span>{{ $t("totalAmount") }}:</span>
                <span
                  >{{ order.totalPrice }}
                  {{ order.currency === "euros" ? "€" : "₽" }}</span
                >
              </div>
            </div>

            <!-- Order Info Toggle -->
            <div class="text-center mb-3">
              <button
                @click="toggleOrderDetails(order._id || '')"
                class="text-sm text-gray-600 hover:text-main-red flex items-center justify-center w-full transition duration-600 ease-in-out"
              >
                {{
                  expandedOrders.includes(order._id || "")
                    ? $t("hideOrderDetails")
                    : $t("showOrderDetails")
                }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-2 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  :class="{
                    'rotate-180': expandedOrders.includes(order._id || ''),
                  }"
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

            <!-- Collapsible Order Details -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0 overflow-hidden"
              enter-to-class="opacity-100 max-h-[1000px] overflow-hidden"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-[1000px] overflow-hidden"
              leave-to-class="opacity-0 max-h-0 overflow-hidden"
            >
              <div
                v-if="expandedOrders.includes(order._id || '')"
                class="border-t border-dashed border-gray-300 pt-3"
              >
                <!-- Recipient Info -->
                <div class="mb-4">
                  <h3 class="font-medium text-gray-800 mb-2">
                    {{ $t("recipient.title") }}
                  </h3>
                  <div class="space-y-2 text-sm">
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("recipient.email") }}:</span
                      >
                      <span>{{ order.recipient?.email || "" }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("recipient.name") }}:</span
                      >
                      <span>{{ order.recipient?.name || "" }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("recipient.surname") }}:</span
                      >
                      <span>{{ order.recipient?.surname || "" }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("recipient.phone") }}:</span
                      >
                      <span>{{ order.recipient?.phone || "" }}</span>
                    </p>
                  </div>
                </div>

                <!-- Delivery Info -->
                <div class="border-t border-dashed border-gray-300 pt-3 mb-4">
                  <h3 class="font-medium text-gray-800 mb-2">
                    {{ $t("delivery.title") }}
                  </h3>
                  <div class="space-y-2 text-sm">
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("delivery.country") }}:</span
                      >
                      <span>{{ order.shippingAddress?.country || "" }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("delivery.city") }}:</span
                      >
                      <span>{{ order.shippingAddress?.city || "" }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("delivery.street") }}:</span
                      >
                      <span>{{ order.shippingAddress?.street || "" }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("delivery.buildingNumber") }}:</span
                      >
                      <span>{{
                        order.shippingAddress?.buildingNumber || ""
                      }}</span>
                    </p>
                    <p
                      v-if="order.shippingAddress?.apartment"
                      class="flex justify-between"
                    >
                      <span class="text-gray-600"
                        >{{ $t("delivery.apartment") }}:</span
                      >
                      <span>{{ order.shippingAddress?.apartment || "" }}</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-gray-600"
                        >{{ $t("delivery.postalCode") }}:</span
                      >
                      <span>{{ order.shippingAddress?.postalCode || "" }}</span>
                    </p>
                  </div>
                </div>

                <!-- Additional Info -->
                <div class="space-y-3">
                  <p
                    v-if="order.orderNotes"
                    class="text-sm border-t border-dashed border-gray-300 pt-3"
                  >
                    <span class="font-medium text-gray-800"
                      >{{ $t("notes") }}:</span
                    >
                    <span class="text-gray-600 block mt-1">{{
                      order.orderNotes
                    }}</span>
                  </p>

                  <p
                    v-if="order.trackingNumber"
                    class="text-sm border-t border-dashed border-gray-300 pt-3"
                  >
                    <span class="font-medium text-gray-800"
                      >{{ $t("trackingNumber") }}:</span
                    >
                    <span
                      class="font-mono bg-gray-100 px-2 py-1 text-gray-600 block mt-1"
                      >{{ order.trackingNumber }}</span
                    >
                  </p>
                </div>
              </div>
            </Transition>

            <!-- Thank You Message -->
            <div class="text-center mt-4 mb-2">
              <p class="text-lg font-medium text-gray-800">
                {{ $t("thankYou") }}
              </p>
            </div>

            <!-- Barcode -->
            <div class="flex justify-center mt-3 mb-2">
              <div
                class="w-48 h-8 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAYAAAA8AQ3AAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AMaAygXMWRYTwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABOUlEQVR42u3UMQEAIAzAMMC/5+GiHCQKenXPzCwA/3lRAARLQLAEBEtAsCRYAgKWgGAJCJaAYEn+S8ASECwBwRIQLAHBkmAJCFgCgiUgWAKCJcESELAEBEtAsAQES0CwJFgCApZgCQiWgGAJCJaAYEmwBAQsAcESECwBwZJgCQhYAoIlIFgCgiUgWBIsAQFLQLAEBEtAsAQES4IlIGAJCJaAYAkIloB12xIsAQFLQLAEBEtAsAQES4IlIGAJCJaAYAkIloBgSbAEBCwBwRIQLAHBEhAsCZaAgCUgWAKCJSBYEiwBAUtAsAQES0CwBARLgiUgYAkIloBgCQiWgGBJsAQELAHBEhAsAcESECwJloCAJSBYAoIlIFgCgiXBEhCwBARLQLAEBEtAsCRYAgKWgGAJCJaAYAkIlgRLQMAC1gL/5qTWnCmkygAAAABJRU5ErkJggg==')]"
              ></div>
            </div>
          </div>

          <!-- Scalloped bottom edge -->
          <div class="w-full h-3 relative -mb-3 mt-0">
            <svg
              class="w-full h-3 absolute top-0 left-0"
              viewBox="0 0 400 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,12 L0,0 
                       L0,0 L5,6 L10,0 L15,6 L20,0 L25,6 L30,0 L35,6 L40,0 L45,6 L50,0 L55,6 L60,0 L65,6 L70,0 L75,6 
                       L80,0 L85,6 L90,0 L95,6 L100,0 L105,6 L110,0 L115,6 L120,0 L125,6 L130,0 L135,6 L140,0 L145,6
                       L150,0 L155,6 L160,0 L165,6 L170,0 L175,6 L180,0 L185,6 L190,0 L195,6 L200,0 L205,6 L210,0 L215,6
                       L220,0 L225,6 L230,0 L235,6 L240,0 L245,6 L250,0 L255,6 L260,0 L265,6 L270,0 L275,6 L280,0 L285,6
                       L290,0 L295,6 L300,0 L305,6 L310,0 L315,6 L320,0 L325,6 L330,0 L335,6 L340,0 L345,6 L350,0 L355,6
                       L360,0 L365,6 L370,0 L375,6 L380,0 L385,6 L390,0 L395,6 L400,0 L400,12 Z"
                fill="url(#grad2)"
              />
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style="stop-color: #191919; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #0e0e0e; stop-opacity: 1"
                />
              </linearGradient>
            </svg>
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
          class="flex justify-center items-center mt-10 bg-black bg-opacity-30 p-4 border border-white border-opacity-10"
        >
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-4 py-2 border flex items-center transition-all duration-300 ease-in-out',
              currentPage === 1
                ? 'bg-black bg-opacity-30 text-main-gray-hover cursor-not-allowed border-white border-opacity-10'
                : 'bg-transparent text-white hover:border-main-red border-white border-opacity-30',
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
                  'w-10 h-10 border flex items-center justify-center transition-all duration-300 ease-in-out',
                  pageNum === currentPage
                    ? 'bg-main-red text-white border-main-red transform scale-110'
                    : 'bg-transparent text-white border-white border-opacity-30 hover:border-main-red',
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
              'px-4 py-2 border flex items-center transition-all duration-300 ease-in-out',
              currentPage === pagination.totalPages
                ? 'bg-black bg-opacity-30 text-main-gray-hover cursor-not-allowed border-white border-opacity-10'
                : 'bg-transparent text-white hover:border-main-red border-white border-opacity-30',
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
        class="text-center py-16 bg-black bg-opacity-30 border border-white border-opacity-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-20 w-20 mx-auto text-main-gray-hover mb-6"
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
        <p class="text-xl text-white mb-4">{{ $t("noOrders") }}</p>
        <router-link
          to="/"
          class="mt-6 inline-block px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] border border-[#240000] focus:outline-none transition-colors duration-300 ease-in-out"
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
const expandedOrders = ref<string[]>([]);

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
const toggleOrderDetails = (orderId: string) => {
  if (expandedOrders.value.includes(orderId)) {
    expandedOrders.value = expandedOrders.value.filter((id) => id !== orderId);
  } else {
    expandedOrders.value.push(orderId);
  }
};

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
      return "bg-black bg-opacity-30 text-yellow-300 border border-yellow-600";
    case "packing":
      return "bg-black bg-opacity-30 text-blue-300 border border-blue-600";
    case "sended":
      return "bg-black bg-opacity-30 text-indigo-300 border border-indigo-600";
    case "delivered":
      return "bg-black bg-opacity-30 text-green-300 border border-green-600";
    case "canceled":
      return "bg-black bg-opacity-30 text-red-300 border border-red-600";
    default:
      return "bg-black bg-opacity-30 text-gray-300 border border-gray-600";
  }
};

const getReceiptStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case "waiting confirmation":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "packing":
      return "bg-blue-100 text-blue-800 border border-blue-300";
    case "sended":
      return "bg-indigo-100 text-indigo-800 border border-indigo-300";
    case "delivered":
      return "bg-green-100 text-green-800 border border-green-300";
    case "canceled":
      return "bg-red-100 text-red-800 border border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
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
