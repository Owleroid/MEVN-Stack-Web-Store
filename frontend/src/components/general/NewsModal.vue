<template>
  <div
    v-if="news"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto py-4"
    @click="close"
  >
    <div
      class="bg-white rounded-2xl w-11/12 max-w-3xl shadow-2xl border border-gray-200 my-4 max-h-[90vh] overflow-y-auto relative"
      @click.stop
    >
      <!-- Modal Header with Close Button -->
      <div
        class="p-6 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10"
      >
        <h2 class="text-2xl font-bold text-gray-800">{{ news.title }}</h2>
        <button
          @click="close"
          class="absolute right-6 top-6 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none transition-colors duration-200"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <!-- News Image -->
      <div v-if="news.imageUrl" class="w-full h-64 md:h-80 overflow-hidden">
        <img
          :src="news.imageUrl"
          :alt="news.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- News Content -->
      <div class="p-6">
        <p class="text-gray-600 text-sm mb-4">
          {{ formatDate(news.createdAt) }}
        </p>
        <div class="prose max-w-none text-gray-700" v-html="news.text"></div>
      </div>

      <!-- Modal Footer -->
      <div
        class="flex justify-end p-6 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white rounded-b-2xl"
      >
        <button
          type="button"
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import type { News } from "@/types/news";

const props = defineProps<{
  news: News | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const close = () => {
  emit("close");
};

watch(
  () => props.news,
  (newValue) => {
    if (newValue) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }
);

onUnmounted(() => {
  document.body.classList.remove("overflow-hidden");
});
</script>
