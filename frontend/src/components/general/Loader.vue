<template>
  <div class="flex flex-col items-center justify-center w-full h-full py-12">
    <div
      class="w-14 h-14 border-4 border-white border-opacity-20 border-t-main-red rounded-full animate-spin"
    ></div>
    <span class="mt-3 text-sm text-main-gray-hover">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: "Loading...",
  },
});
</script>
