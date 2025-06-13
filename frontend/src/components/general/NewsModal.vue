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
      class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 overflow-y-auto py-4 px-2 backdrop-blur-sm"
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
          class="w-full max-w-3xl mx-8 my-12 sm:mx-4 sm:my-8 p-[0.5px] md:p-[1px] relative flex flex-col justify-center"
          @click.stop
        >
          <!-- Gradient border -->
          <div
            class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white via-white/50 to-transparent opacity-60"
          ></div>
          <!-- Modal content -->
          <div
            class="relative bg-[#0E0E0E] flex flex-col max-h-[90vh] shadow-2xl z-20 overflow-hidden"
          >
            <!-- Header -->
            <div
              class="sticky top-0 z-30 bg-[#0E0E0E]/95 border-b border-white/10 px-6 py-4 flex items-center justify-between"
            >
              <h2
                class="text-xl md:text-2xl font-bold font-oswald uppercase bg-gradient-to-b from-gray-100 to-gray-500 text-transparent bg-clip-text pr-8"
              >
                {{ news.title }}
              </h2>
              <button
                @click="close"
                class="absolute right-6 top-4 p-1 text-main-red focus:outline-none transition-colors duration-200 cursor-pointer group"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 transition-transform duration-300 group-hover:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <!-- Scrollable content -->
            <div class="flex-1 min-h-0 overflow-y-auto px-6 py-6">
              <div v-if="news.imageUrl" class="relative mb-6">
                <div class="w-full h-56 md:h-80 overflow-hidden">
                  <img
                    :src="news.imageUrl"
                    :alt="news.title"
                    class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/60 to-transparent"
                ></div>
                <!-- Date badge -->
                <div
                  class="absolute right-4 top-4 bg-main-red/90 backdrop-blur-sm text-white text-sm font-medium py-1 px-3 rounded shadow-lg"
                >
                  {{ formatDate(news.createdAt) }}
                </div>
              </div>
              <!-- Show date if no image -->
              <div
                v-if="!news.imageUrl"
                class="inline-block bg-[#1A1A1A] border border-white/10 text-main-gray-hover text-sm mb-6 py-1 px-3 rounded"
              >
                {{ formatDate(news.createdAt) }}
              </div>
              <div
                class="prose prose-invert prose-lg text-white prose-headings:font-oswald prose-headings:uppercase prose-headings:text-white prose-p:text-white prose-a:text-main-red prose-a:no-underline hover:prose-a:underline prose-img:rounded-md prose-li:text-white prose-strong:text-white prose-blockquote:border-l-main-red prose-blockquote:border-opacity-70 prose-blockquote:bg-black/20 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:italic max-w-none"
                v-html="news.text"
              ></div>
            </div>
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
