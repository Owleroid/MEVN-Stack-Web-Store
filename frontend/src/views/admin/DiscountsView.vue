<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Header Section -->
    <div class="bg-white rounded-t-lg shadow-sm border-b border-gray-200">
      <div class="flex justify-between items-center px-6 py-4">
        <div class="text-lg font-semibold text-gray-800">
          {{ $t("discountsList") }}
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium flex items-center"
        >
          <span class="mr-1">+</span> {{ $t("addNewDiscount") }}
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-b-lg shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-12"
      >
        <div
          class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600">{{ $t("loading") }}</p>
      </div>

      <!-- Table Content -->
      <div v-else>
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
                class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
              >
                {{ $t("actions") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="discount in discounts"
              :key="discount._id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="p-4 border-b border-gray-200">{{ discount.name }}</td>
              <td class="p-4 border-b border-gray-200">
                <span class="capitalize">{{ discount.scope }}</span>
                <span
                  v-if="discount.scope !== 'all'"
                  class="text-xs text-gray-500 block"
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
              <td class="p-4 border-b border-gray-200">
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
              <td class="p-4 border-b border-gray-200">
                <div class="text-sm">
                  <div>{{ formatDate(discount.startDate) }}</div>
                  <div class="text-gray-500">
                    {{ $t("to") }} {{ formatDate(discount.endDate) }}
                  </div>
                </div>
              </td>
              <td class="p-4 border-b border-gray-200">
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
              <td class="p-4 border-b border-gray-200">
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(discount)"
                    class="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                  >
                    {{ $t("edit") }}
                  </button>
                  <button
                    @click="toggleStatus(discount._id)"
                    class="px-3 py-1 bg-amber-500 text-white rounded text-xs font-medium hover:bg-amber-600 transition-colors"
                  >
                    {{ discount.isActive ? $t("deactivate") : $t("activate") }}
                  </button>
                  <button
                    @click="confirmDelete(discount._id)"
                    class="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    {{ $t("delete") }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <p
          v-if="discounts.length === 0"
          class="text-center py-8 text-gray-500 italic"
        >
          {{ $t("noDiscounts") }}
        </p>
      </div>
    </div>

    <!-- Modals -->
    <AddEditDiscountModal
      :show="showAddEditModal"
      :mode="isEdit ? 'edit' : 'add'"
      :discount="selectedDiscount"
      @submit="submitDiscount"
      @cancel="cancelAddEdit"
    />
    <DeleteDiscountModal
      :show="showDeleteModal"
      @confirm="deleteSelectedDiscount"
      @cancel="showDeleteModal = false"
    />
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
