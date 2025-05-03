<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click="cancelRemove"
  >
    <div class="bg-white rounded-lg w-11/12 max-w-md p-6 shadow-lg" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          {{ $t("confirmDeletion") }}
        </h2>
        <button
          class="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer transition-colors"
          @click="cancelRemove"
        >
          &times;
        </button>
      </div>

      <p class="text-center text-gray-700 mb-6">
        {{ $t("deleteConfirmation") }}
      </p>

      <div class="flex flex-col gap-3 mt-6">
        <button
          @click="confirmDelete"
          class="px-4 py-2.5 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
        >
          {{ $t("deleteWithProducts") }}
        </button>

        <button
          @click="openReassignModal"
          class="px-4 py-2.5 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
        >
          {{ $t("reassignAndDelete") }}
        </button>

        <button
          @click="cancelRemove"
          class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
        >
          {{ $t("cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ==============================
// Props & Emits
// ==============================

const props = defineProps({
  show: Boolean,
});

const emits = defineEmits([
  "confirmDelete",
  "openReassignModal",
  "cancelRemove",
]);

// ==============================
// Action Handlers
// ==============================

/**
 * Confirms the deletion of a category with its products
 */
const confirmDelete = () => {
  emits("confirmDelete");
};

/**
 * Opens modal to reassign products before deletion
 */
const openReassignModal = () => {
  emits("openReassignModal");
};

/**
 * Cancels the deletion process
 */
const cancelRemove = () => {
  emits("cancelRemove");
};
</script>
