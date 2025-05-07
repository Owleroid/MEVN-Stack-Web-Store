<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click="close"
  >
    <div class="bg-white rounded-lg w-11/12 max-w-md p-6 shadow-lg" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">
          {{
            $t("changeCategoryFor", {
              name: productToChangeCategory?.name,
            })
          }}
        </h3>
        <button
          class="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer transition-colors"
          @click="close"
        >
          &times;
        </button>
      </div>

      <div class="mb-6">
        <label
          for="newCategory"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          {{ $t("chooseNewCategory") }}
        </label>
        <select
          id="newCategory"
          v-model="selectedNewCategory"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled selected>{{ $t("selectCategory") }}</option>
          <option
            v-for="category in filteredCategories"
            :key="category._id"
            :value="category._id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
        >
          {{ $t("cancel") }}
        </button>
        <button
          @click="changeCategory(selectedNewCategory)"
          class="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
          :disabled="!selectedNewCategory"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedNewCategory }"
        >
          {{ $t("change") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

import type { Category } from "@/types/category";

// Composables setup
const { t } = useI18n();
const toast = useToast();

// Props & Emits
const props = defineProps({
  show: Boolean,
  productToChangeCategory: Object,
  categories: Array,
});

const emits = defineEmits(["close", "changeCategory"]);

// State Management
const selectedNewCategory = ref<string>("");

// Computed Properties
const filteredCategories = computed(() => {
  return ((props.categories ?? []) as Category[]).filter(
    (category: Category) =>
      category._id !== props.productToChangeCategory?.category
  );
});

// Watchers
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      // Reset the selected category when the modal opens
      selectedNewCategory.value = "";
    }
  }
);

// Action Handlers
const close = () => {
  emits("close");
};

const changeCategory = (newCategoryId: string) => {
  if (!newCategoryId) {
    toast.error(t("selectNewCategoryAlert"));
    return;
  }
  emits("changeCategory", newCategoryId);
};
</script>
