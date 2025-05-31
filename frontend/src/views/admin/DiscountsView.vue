<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="mb-6">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <button
            @click="openAddModal"
            class="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center shadow-sm"
          >
            <span class="mr-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            {{ $t("addNewDiscount") }}
          </button>
        </div>
      </div>

      <!-- Main Content Card -->
      <div
        class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
      >
        <!-- Loading State -->
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-16"
        >
          <div
            class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
          ></div>
          <p class="text-gray-600">{{ $t("loading") }}</p>
        </div>

        <!-- Table Content -->
        <div v-else>
          <!-- Empty State -->
          <div
            v-if="discounts.length === 0"
            class="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-gray-500 text-lg mb-4">{{ $t("noDiscounts") }}</p>
            <button
              @click="openAddModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {{ $t("addNewDiscount") }}
            </button>
          </div>

          <!-- Actual Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("discountName") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("scope") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("discountPercentages") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("validity") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
                  >
                    {{ $t("status") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-right font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-40"
                  >
                    {{ $t("actions") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(discount, index) in discounts"
                  :key="discount._id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{ 'border-b-0': index === discounts.length - 1 }"
                  >
                    <span class="font-medium text-gray-700">{{
                      discount.name
                    }}</span>
                  </td>
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{ 'border-b-0': index === discounts.length - 1 }"
                  >
                    <span class="capitalize">{{ discount.scope }}</span>
                    <span
                      v-if="discount.scope !== 'all'"
                      class="text-xs text-gray-500 block mt-1"
                    >
                      {{ discount.targetIds?.length || 0 }}
                      {{
                        discount.targetModel === "Category"
                          ? discount.targetIds?.length === 1
                            ? $t("category")
                            : $t("categories")
                          : discount.targetIds?.length === 1
                          ? $t("product")
                          : $t("products")
                      }}
                    </span>
                  </td>
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{ 'border-b-0': index === discounts.length - 1 }"
                  >
                    <div class="text-sm">
                      <div class="flex items-center">
                        <span class="font-medium">₽:</span>
                        <span class="ml-1"
                          >{{ discount.discounts?.rubles || 0 }}%</span
                        >
                      </div>
                      <div class="flex items-center mt-1">
                        <span class="font-medium">€:</span>
                        <span class="ml-1"
                          >{{ discount.discounts?.euros || 0 }}%</span
                        >
                      </div>
                    </div>
                  </td>
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{ 'border-b-0': index === discounts.length - 1 }"
                  >
                    <div class="text-sm">
                      <div>{{ formatDate(discount.startDate) }}</div>
                      <div class="text-gray-500">
                        {{ $t("to") }} {{ formatDate(discount.endDate) }}
                      </div>
                    </div>
                  </td>
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{ 'border-b-0': index === discounts.length - 1 }"
                  >
                    <span
                      :class="[
                        'px-2 py-1 text-xs font-semibold rounded-full',
                        discount.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800',
                      ]"
                    >
                      {{ discount.isActive ? $t("active") : $t("inactive") }}
                    </span>
                  </td>
                  <td
                    class="p-4 border-b border-gray-200"
                    :class="{ 'border-b-0': index === discounts.length - 1 }"
                  >
                    <div class="flex flex-wrap justify-end gap-2">
                      <button
                        @click="openEditModal(discount)"
                        class="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        :title="$t('edit')"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="toggleStatus(discount._id)"
                        class="p-2 bg-amber-100 text-amber-600 rounded hover:bg-amber-200 transition-colors"
                        :title="
                          discount.isActive ? $t('deactivate') : $t('activate')
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            v-if="discount.isActive"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                          <path
                            v-else
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="confirmDelete(discount._id)"
                        class="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        :title="$t('delete')"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <transition name="fade" mode="out-in">
        <AddEditDiscountModal
          v-if="showAddEditModal"
          :show="showAddEditModal"
          :mode="isEdit ? 'edit' : 'add'"
          :discount="selectedDiscount"
          @submit="submitDiscount"
          @cancel="cancelAddEdit"
        />
      </transition>

      <transition name="fade" mode="out-in">
        <DeleteDiscountModal
          v-if="showDeleteModal"
          :show="showDeleteModal"
          @confirm="deleteSelectedDiscount"
          @cancel="showDeleteModal = false"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { format } from "date-fns";

import { useEventBus } from "@/utils/eventBus";

import AddEditDiscountModal from "@/components/admin/discounts/AddEditDiscountModal.vue";
import DeleteDiscountModal from "@/components/admin/discounts/DeleteDiscountModal.vue";

import type { Discount, DiscountInput } from "@/types/discount";

import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  toggleDiscountStatus,
  deleteDiscount,
} from "@/services/discountService";

// Composables Setup
const { t } = useI18n();
const toast = useToast();
const { on } = useEventBus();

// State Management
const discounts = ref<Discount[]>([]);
const loading = ref(true);

// UI state
const showAddEditModal = ref(false);
const showDeleteModal = ref(false);
const isEdit = ref(false);
const selectedDiscount = ref<Discount | null>(null);
const selectedDiscountId = ref<string>("");

// Helper Functions
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "dd MMM yyyy");
  } catch (error) {
    console.error("Invalid date format:", dateString);
    return "";
  }
};

// Data Fetching
const fetchDiscounts = async () => {
  loading.value = true;

  try {
    const response = await getAllDiscounts();
    discounts.value = response.discounts || [];
  } catch (err) {
    console.error("Failed to fetch discounts:", err);
    discounts.value = [];
  } finally {
    loading.value = false;
  }
};

// Modal Management
const openAddModal = () => {
  selectedDiscount.value = null;
  isEdit.value = false;
  setTimeout(() => {
    showAddEditModal.value = true;
  }, 0);
};

const openEditModal = (discount: Discount) => {
  selectedDiscount.value = JSON.parse(JSON.stringify(discount));
  isEdit.value = true;
  showAddEditModal.value = true;
};

const cancelAddEdit = () => {
  showAddEditModal.value = false;
  setTimeout(() => {
    selectedDiscount.value = null;
  }, 300);
};

const confirmDelete = (id: string) => {
  selectedDiscountId.value = id;
  showDeleteModal.value = true;
};

// CRUD Operations
const submitDiscount = async (discount: DiscountInput) => {
  try {
    if (isEdit.value && selectedDiscount.value) {
      await updateDiscount(selectedDiscount.value._id, discount);
      toast.success(t("updateDiscountSuccess"));
    } else {
      await createDiscount(discount);
      toast.success(t("addDiscountSuccess"));
    }

    showAddEditModal.value = false;
    selectedDiscount.value = null;
    await fetchDiscounts();
  } catch (error) {
    const errorMessage = isEdit.value
      ? t("updateDiscountError")
      : t("addDiscountError");
    toast.error(errorMessage);
    console.error("Failed to submit discount:", error);
  }
};

const toggleStatus = async (id: string) => {
  try {
    await toggleDiscountStatus(id);
    fetchDiscounts();
    toast.success(t("statusToggleSuccess"));
  } catch (error) {
    toast.error(t("statusToggleError"));
    console.error("Failed to toggle discount status:", error);
  }
};

const deleteSelectedDiscount = async () => {
  try {
    if (selectedDiscountId.value) {
      await deleteDiscount(selectedDiscountId.value);
      fetchDiscounts();
      toast.success(t("deleteDiscountSuccess"));
    }
  } catch (error) {
    toast.error(t("deleteDiscountError"));
    console.error("Failed to delete discount:", error);
  } finally {
    showDeleteModal.value = false;
    selectedDiscountId.value = "";
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchDiscounts();
  on("discountAdded", fetchDiscounts);
  on("discountUpdated", fetchDiscounts);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
