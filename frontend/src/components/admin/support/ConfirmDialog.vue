<template>
  <div
    v-if="show"
    class="fixed inset-0 z-20 flex items-center justify-center overflow-auto bg-black/50"
    @click="onBackdropClick"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      @click.stop
    >
      <h3 class="text-lg font-bold text-gray-900 mb-3">
        {{ title }}
      </h3>

      <div class="text-gray-700 mb-6">
        {{ message }}
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="onCancel"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          {{ cancelText }}
        </button>
        <button
          @click="onConfirm"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

// Define props
const props = defineProps<{
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}>();

// Define emits
const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

// Handler functions
const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  emit("cancel");
};

const onBackdropClick = () => {
  emit("cancel");
};
</script>
