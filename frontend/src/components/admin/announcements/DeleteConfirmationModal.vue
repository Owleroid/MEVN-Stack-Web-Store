<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
  >
    <div class="absolute inset-0 bg-transparent" @click="$emit('cancel')"></div>
    <div class="bg-white rounded-lg p-6 max-w-md w-full relative z-10">
      <h3 class="text-lg font-medium mb-2">
        {{ title }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ message }}
      </p>

      <div class="flex justify-end gap-2">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          :disabled="isLoading"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <div
            v-if="isLoading"
            class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
          ></div>
          {{ confirmText }}
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
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: "Confirm",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["confirm", "cancel"]);
</script>
