<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    @click="$emit('cancel')"
  >
    <div class="bg-white rounded-lg w-11/12 max-w-md p-6 shadow-lg" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          {{ $t("deleteNews") }}
        </h2>
        <button
          class="bg-transparent border-0 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer transition-colors"
          @click="$emit('cancel')"
        >
          &times;
        </button>
      </div>

      <p class="text-center text-gray-700 mb-6">
        {{ $t("deleteNewsConfirmation") }}
      </p>

      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
        >
          {{ $t("cancel") }}
        </button>
        <button
          @click="$emit('confirm')"
          :disabled="isLoading"
          class="px-4 py-2.5 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <div
            v-if="isLoading"
            class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
          ></div>
          {{ $t("delete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>
