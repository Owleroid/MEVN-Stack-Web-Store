<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="news"
      class="fixed inset-0 bg-black/80 flex justify-center items-center z-50 overflow-y-auto py-4 px-2"
      @click="close"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform scale-95"
        enter-to-class="opacity-100 transform scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 transform scale-100"
        leave-to-class="opacity-0 transform scale-95"
      >
        <div
          class="w-full max-w-3xl bg-black bg-opacity-30 border border-white border-opacity-10 my-4 max-h-[90vh] overflow-y-auto relative"
          @click.stop
        >
          <!-- Modal Header with Close Button -->
          <div
            class="p-4 md:p-6 border-b border-white border-opacity-10 sticky top-0 z-10 backdrop-blur-sm bg-black bg-opacity-40 flex items-center justify-between"
          >
            <h2 class="text-xl md:text-2xl font-bold text-white pr-8">
              {{ news.title }}
            </h2>
            <button
              @click="close"
              class="absolute right-4 md:right-6 top-4 md:top-6 text-main-gray-hover hover:text-main-red text-2xl font-bold focus:outline-none transition-colors duration-200"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <!-- News Image -->
          <div
            v-if="news.imageUrl"
            class="w-full h-48 md:h-80 overflow-hidden relative"
          >
            <img
              :src="news.imageUrl"
              :alt="news.title"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- News Content -->
          <div class="p-4 md:p-6">
            <p class="text-main-gray-hover text-sm mb-4">
              {{ formatDate(news.createdAt) }}
            </p>
            <div
              class="prose prose-invert max-w-none text-white/90"
              v-html="news.text"
            ></div>
          </div>

          <!-- Modal Footer -->
          <div
            class="flex justify-end p-4 md:p-6 border-t border-white border-opacity-10 backdrop-blur-sm bg-black bg-opacity-40"
          >
            <button
              type="button"
              @click="close"
              class="px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] border border-[#240000] focus:outline-none transition-colors duration-300 hover:opacity-90"
            >
              {{ $t("close") }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { News } from "@/types/news";

const { t } = useI18n();

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
