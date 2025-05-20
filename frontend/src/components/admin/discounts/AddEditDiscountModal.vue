<template>
  <transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      @click="$emit('cancel')"
    >
      <div
        class="bg-white rounded-lg w-11/12 max-w-4xl p-6 shadow-lg transition-transform duration-300 ease-in-out transform"
        :class="{ 'scale-100': show, 'scale-95': !show }"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            {{ mode === "add" ? $t("addNewDiscount") : $t("editDiscount") }}
          </h2>
          <button
            class="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer transition-colors"
            @click="$emit('cancel')"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Row 1: Name and Description -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Discount Name -->
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("discountName") }} <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Description -->
            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("description") }}
              </label>
              <input
                id="description"
                v-model="formData.description"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Row 2: Start Date and End Date -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start Date -->
            <div>
              <label
                for="startDate"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("startDate") }} <span class="text-red-500">*</span>
              </label>
              <input
                id="startDate"
                v-model="formData.startDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- End Date -->
            <div>
              <label
                for="endDate"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("endDate") }} <span class="text-red-500">*</span>
              </label>
              <input
                id="endDate"
                v-model="formData.endDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Row 3: Discount Percentages -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Discount Percentage (Rubles) -->
            <div>
              <label
                for="rubles"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("discountPercentageRubles") }}
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="rubles"
                  v-model.number="formData.discounts.rubles"
                  type="number"
                  min="0"
                  max="100"
                  required
                  class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >%</span
                >
              </div>
            </div>

            <!-- Discount Percentage (Euros) -->
            <div>
              <label
                for="euros"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("discountPercentageEuros") }}
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="euros"
                  v-model.number="formData.discounts.euros"
                  type="number"
                  min="0"
                  max="100"
                  required
                  class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >%</span
                >
              </div>
            </div>
          </div>

          <!-- Row 4: Target Type and Active Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Discount Scope -->
            <div>
              <label
                for="scope"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ $t("scope") }} <span class="text-red-500">*</span>
              </label>
              <select
                id="scope"
                v-model="formData.scope"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                @change="handleScopeChange"
              >
                <option value="all">{{ $t("allProducts") }}</option>
                <option value="categories">
                  {{ $t("specificCategories") }}
                </option>
                <option value="products">{{ $t("specificProducts") }}</option>
              </select>
            </div>

            <!-- Active Status -->
            <div class="flex items-center h-full pt-6">
              <input
                id="isActive"
                v-model="formData.isActive"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="isActive" class="ml-2 block text-sm text-gray-900">
                {{ $t("active") }}
              </label>
            </div>
          </div>

          <!-- Target Selection Section -->
          <transition
            enter-active-class="transition-all duration-300 ease-out overflow-hidden"
            enter-from-class="transform opacity-0 max-h-0 scale-95"
            enter-to-class="opacity-100 max-h-[1000px] scale-100"
            leave-active-class="transition-all duration-200 ease-in overflow-hidden"
            leave-from-class="opacity-100 max-h-[1000px] scale-100"
            leave-to-class="transform opacity-0 max-h-0 scale-95"
          >
            <div
              v-if="formData.scope !== 'all' as DiscountScope"
              class="border rounded-md p-4 bg-gray-50"
            >
              <!-- Search Input for Categories/Products -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{
                    formData.scope === "categories"
                      ? $t("searchCategories")
                      : $t("searchProducts")
                  }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="searchQuery"
                  @input="handleSearch"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="
                    formData.scope === 'categories'
                      ? $t('searchCategoriesPlaceholder')
                      : $t('searchProductsPlaceholder')
                  "
                />
              </div>

              <!-- Search Results -->
              <transition
                enter-active-class="transition-all duration-300 ease-out overflow-hidden"
                enter-from-class="transform opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-40"
                leave-active-class="transition-all duration-200 ease-in overflow-hidden"
                leave-from-class="opacity-100 max-h-40"
                leave-to-class="transform opacity-0 max-h-0"
              >
                <div
                  v-if="searchResults.length > 0"
                  class="mb-4 border rounded-md overflow-y-auto max-h-40"
                >
                  <div
                    v-for="item in searchResults"
                    :key="item._id"
                    @click="selectItem(item)"
                    class="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors duration-200"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </transition>

              <!-- Selected Items -->
              <transition
                enter-active-class="transition-all duration-300 ease-out overflow-hidden"
                enter-from-class="transform opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-active-class="transition-all duration-200 ease-in overflow-hidden"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="transform opacity-0 max-h-0"
              >
                <div v-if="(formData.targetIds || []).length > 0" class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{
                      formData.scope === "categories"
                        ? $t("selectedCategories")
                        : $t("selectedProducts")
                    }}:
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="(item, index) in selectedItems"
                      :key="index"
                      class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
                    >
                      <span>{{ item.name }}</span>
                      <button
                        type="button"
                        @click="removeItem(item._id)"
                        class="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              </transition>

              <!-- No Selections Warning -->
              <p
                v-if="
                  formData.scope !== 'all' &&
                  (!formData.targetIds || formData.targetIds.length === 0)
                "
                class="text-sm text-amber-600 mt-2"
              >
                {{
                  formData.scope === "categories"
                    ? $t("pleaseSelectCategories")
                    : $t("pleaseSelectProducts")
                }}
              </p>
            </div>
          </transition>

          <!-- Validation Errors -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="transform opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-2"
          >
            <div
              v-if="validationError"
              class="border border-red-400 rounded-md bg-red-50 p-3 mt-4"
            >
              <p class="text-sm text-red-600">{{ validationError }}</p>
            </div>
          </transition>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('cancel')"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              {{ $t("cancel") }}
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {{ mode === "add" ? $t("add") : $t("save") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import debounce from "lodash/debounce";

import type { Discount, DiscountInput, DiscountScope } from "@/types/discount";
import type { CategorySearchResult } from "@/types/category";

import { getAllCategories, searchCategories } from "@/services/categoryService";
import { searchProducts, getProductsByIds } from "@/services/productService";

const { t } = useI18n();

interface SearchResult extends CategorySearchResult {}

const props = defineProps<{
  show: boolean;
  mode: "add" | "edit";
  discount: Discount | null;
}>();

const emit = defineEmits<{
  (e: "submit", data: DiscountInput): void;
  (e: "cancel"): void;
}>();

// State
const selectedItems = ref<SearchResult[]>([]);
const searchResults = ref<SearchResult[]>([]);
const searchQuery = ref("");
const validationError = ref("");

// Form data
const initialFormData = (): DiscountInput => ({
  name: "",
  description: "",
  scope: "all",
  discounts: {
    rubles: 0,
    euros: 0,
  },
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  isActive: true,
});

const formData = ref<DiscountInput>(initialFormData());

watch(
  [() => props.discount, () => props.mode, () => props.show],
  async ([discount, mode, show]) => {
    console.log(
      "Watch triggered - Discount:",
      discount,
      "Mode:",
      mode,
      "Show:",
      show
    );

    if (show && mode === "add") {
      console.log("Resetting form for add mode (from combined watcher)");
      formData.value = initialFormData();
      selectedItems.value = [];
      searchResults.value = [];
      searchQuery.value = "";
      validationError.value = "";
      return;
    }

    if (show && mode === "edit" && discount) {
      console.log("Updating form for edit mode (from combined watcher)");
      try {
        const {
          name,
          description,
          scope,
          targetModel,
          targetIds,
          discounts,
          startDate,
          endDate,
          isActive,
        } = discount;

        formData.value = {
          name: name || "",
          description: description || "",
          scope: scope || "all",
          targetModel,
          targetIds: [...(targetIds || [])],
          discounts: discounts ? { ...discounts } : { rubles: 0, euros: 0 },
          startDate: startDate
            ? new Date(startDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          endDate: endDate
            ? new Date(endDate).toISOString().split("T")[0]
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
          isActive: isActive ?? true,
        };

        selectedItems.value = [];
        if (scope === "categories" && targetIds && targetIds.length > 0) {
          await loadSelectedCategories(targetIds);
        } else if (scope === "products" && targetIds && targetIds.length > 0) {
          await loadSelectedProducts(targetIds);
        }
      } catch (error) {
        console.error("Error setting up edit form:", error);
      }
    }
  },
  { immediate: true }
);

const handleSearch = debounce(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    if (formData.value.scope === "categories") {
      const response = await searchCategories(searchQuery.value);
      if (response.success) {
        searchResults.value = response.categories
          .filter((cat) => !formData.value.targetIds?.includes(cat._id))
          .map((cat) => ({ _id: cat._id, name: cat.name }));
      }
    } else if (formData.value.scope === "products") {
      const response = await searchProducts(searchQuery.value);
      if (response.success) {
        searchResults.value = response.products
          .filter((prod) => !formData.value.targetIds?.includes(prod._id))
          .map((prod) => ({ _id: prod._id, name: prod.name }));
      }
    }
  } catch (error) {
    console.error("Search error:", error);
    searchResults.value = [];
  }
}, 300);

const selectItem = (item: SearchResult) => {
  if (!formData.value.targetIds) {
    formData.value.targetIds = [];
  }

  if (!formData.value.targetIds.includes(item._id)) {
    formData.value.targetIds.push(item._id);
    selectedItems.value.push(item);
  }

  searchQuery.value = "";
  searchResults.value = [];
};

const removeItem = (id: string) => {
  if (formData.value.targetIds) {
    formData.value.targetIds = formData.value.targetIds.filter(
      (itemId) => itemId !== id
    );
    selectedItems.value = selectedItems.value.filter((item) => item._id !== id);
  }
};

const loadSelectedCategories = async (ids: string[]) => {
  try {
    const response = await getAllCategories();
    if (response.success) {
      const selected = response.categories
        .filter((cat) => ids.includes(cat._id))
        .map((cat) => ({ _id: cat._id, name: cat.name }));
      selectedItems.value = selected;
    }
  } catch (error) {
    console.error("Failed to load selected categories:", error);
  }
};

const loadSelectedProducts = async (ids: string[]) => {
  try {
    const response = await getProductsByIds(ids);
    if (response.success) {
      const selected = response.products.map((prod) => ({
        _id: prod._id,
        name: prod.name,
      }));
      selectedItems.value = selected;
    }
  } catch (error) {
    console.error("Failed to load selected products:", error);
  }
};

const handleScopeChange = () => {
  searchQuery.value = "";
  searchResults.value = [];
  selectedItems.value = [];
  formData.value.targetIds = [];

  if (formData.value.scope === "categories") {
    formData.value.targetModel = "Category";
  } else if (formData.value.scope === "products") {
    formData.value.targetModel = "Product";
  } else {
    formData.value.targetModel = undefined;
  }
};

const submitForm = () => {
  console.log(
    "Form submitted - Mode:",
    props.mode,
    "Form data:",
    formData.value
  );
  validationError.value = "";

  if (
    formData.value.scope !== "all" &&
    (!formData.value.targetIds || formData.value.targetIds.length === 0)
  ) {
    validationError.value =
      formData.value.scope === "categories"
        ? t("selectAtLeastOneCategory")
        : t("selectAtLeastOneProduct");
    return;
  }

  const startDate = new Date(formData.value.startDate);
  const endDate = new Date(formData.value.endDate);

  if (endDate <= startDate) {
    validationError.value = t("endDateMustBeAfterStartDate");
    return;
  }

  const formDataToSubmit: DiscountInput = {
    name: formData.value.name,
    description: formData.value.description,
    scope: formData.value.scope,
    targetModel: formData.value.targetModel,
    targetIds: formData.value.targetIds ? [...formData.value.targetIds] : [],
    discounts: {
      rubles: formData.value.discounts.rubles,
      euros: formData.value.discounts.euros,
    },
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    isActive: formData.value.isActive,
  };

  console.log("Emitting form data:", formDataToSubmit);

  emit("submit", formDataToSubmit);
};
</script>
