<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click="cancelRemove"
  >
    <div class="bg-white rounded-lg w-11/12 max-w-md p-6 shadow-lg" @click.stop>
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">
          {{ $t("chooseNewCategory") }}
        </h2>
        <button
          class="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer transition-colors"
          @click="cancelRemove"
        >
          &times;
        </button>
      </div>

      <div class="mb-6">
        <label
          for="newCategory"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          {{ $t("selectCategoryForProducts") }}
        </label>
        <select
          id="newCategory"
          v-model="newCategoryId"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled selected>{{ $t("selectCategory") }}</option>
          <option
            v-for="category in categories"
            :key="category._id"
            :value="category._id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          @click="cancelRemove"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
        >
          {{ $t("cancel") }}
        </button>
        <button
          @click="reassignAndRemoveCategory"
          class="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
          :disabled="!newCategoryId"
          :class="{ 'opacity-50 cursor-not-allowed': !newCategoryId }"
        >
          {{ $t("reassignAndDelete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// ==============================
// Props & Emits
// ==============================

import type { Category } from "@/types/category";

const props = defineProps({
  show: Boolean,
  categories: Array as () => Category[],
  selectedCategoryId: String,
});

const emits = defineEmits(["reassignAndRemoveCategory", "cancelRemove"]);

// ==============================
// State Management
// ==============================

const newCategoryId = ref<string | null>(null);

// ==============================
// Watchers
// ==============================

watch(
  () => props.show,
  (isVisible) => {
    if (isVisible) {
      // Reset selection when modal opens
      newCategoryId.value = null;
    }
  }
);

// ==============================
// Action Handlers
// ==============================

/**
 * Reassigns products to the new category and removes the old one
 */
const reassignAndRemoveCategory = () => {
  if (newCategoryId.value) {
    emits("reassignAndRemoveCategory", newCategoryId.value);
  }
};

/**
 * Cancels the reassignment process
 */
const cancelRemove = () => {
  emits("cancelRemove");
};
</script>
