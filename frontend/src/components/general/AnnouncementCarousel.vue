<template>
  <div class="w-full my-8">
    <div class="relative">
      <!-- Loading State -->
      <Loader v-if="loading" :text="$t('loadingAnnouncements')" />

      <!-- Empty State -->
      <div
        v-else-if="announcements.length === 0"
        class="py-12 text-center min-h-[400px] flex items-center justify-center"
      >
        <p class="text-gray-500">{{ $t("noAnnouncements") }}</p>
      </div>

      <!-- Carousel Content -->
      <template v-else>
        <!-- Navigation Buttons -->
        <button
          v-if="announcements.length > 1"
          @click="prevSlide"
          class="absolute z-10 left-1 md:left-0 top-1/2 -translate-y-1/2 p-2 transition-all"
          aria-label="Previous slide"
        >
          <svg
            class="w-6 h-6 text-[#BA0913]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Carousel Content -->
        <div class="overflow-hidden rounded-lg shadow min-h-[400px]">
          <div
            class="flex transition-transform duration-300 ease-in-out h-full"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div
              v-for="announcement in announcements"
              :key="announcement._id"
              class="w-full flex-shrink-0 min-h-[400px]"
            >
              <div class="relative h-full">
                <!-- NEW! Text with gradient -->
                <transition name="fade">
                  <div
                    class="absolute top-[10%] right-[10%] md:right-[8%] lg:right-[25%] z-10"
                  >
                    <div
                      class="font-bold text-3xl md:text-4xl lg:text-5xl drop-shadow-md"
                    >
                      <span
                        class="bg-clip-text text-transparent bg-gradient-to-b from-[#BA0913] to-[#530109]"
                        >NEW!</span
                      >
                    </div>
                  </div>
                </transition>

                <!-- Product Image with Buttons Overlay -->
                <div
                  class="relative w-full h-full min-h-[400px] flex flex-col justify-center"
                >
                  <img
                    :src="announcement.imageUrl"
                    :alt="announcement.product.name"
                    class="mx-auto object-contain rounded-md flex-grow py-4 px-2 max-w-[400px] md:max-w-[600px] lg:max-w-[700px] max-h-[320px] md:max-h-[400px] lg:max-h-[500px]"
                    style="min-height: 200px"
                  />

                  <!-- Buttons -->
                  <div class="flex justify-center items-center p-4 w-auto">
                    <router-link
                      :key="'view-product'"
                      :to="`/${announcement.product.category.slug}/${announcement.product.slug}`"
                      class="w-36 h-[48px] uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none flex items-center justify-center whitespace-nowrap"
                    >
                      {{ $t("buyNow") }}
                    </router-link>
                    <div class="w-6"></div>
                    <router-link
                      :key="'view-collections'"
                      to="/collections"
                      class="w-36 h-[48px] uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none flex items-center justify-center whitespace-nowrap"
                    >
                      {{ $t("collections") }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="announcements.length > 1"
          @click="nextSlide"
          class="absolute z-10 right-1 md:right-0 top-1/2 -translate-y-1/2 p-2 transition-all"
          aria-label="Next slide"
        >
          <svg
            class="w-6 h-6 text-[#BA0913]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Indicators -->
        <div
          v-if="announcements.length > 1"
          class="flex justify-center mt-4 gap-2"
        >
          <button
            v-for="(_, index) in announcements"
            :key="index"
            @click="goToSlide(index)"
            class="w-3 h-3 rounded-full transition-colors"
            :class="currentIndex === index ? 'bg-[#BA0913]' : 'bg-main-gray'"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

import Loader from "@/components/general/Loader.vue";

import { getActiveAnnouncements } from "@/services/announcementService";

import type { Announcement } from "@/types/announcement";

const announcements = ref<Announcement[]>([]);
const currentIndex = ref(0);
const autoplayInterval = ref<number | null>(null);
const loading = ref(true);

// Fetch announcements
const fetchAnnouncements = async () => {
  loading.value = true;

  try {
    const { success, announcements: fetchedAnnouncements } =
      await getActiveAnnouncements();
    if (success) {
      announcements.value = fetchedAnnouncements;

      if (fetchedAnnouncements.length > 1) {
        startAutoplay();
      }
    }
  } catch (error) {
    console.error("Error fetching announcements:", error);
  } finally {
    loading.value = false;
  }
};

// Navigation methods
const nextSlide = () => {
  if (currentIndex.value < announcements.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
  restartAutoplay();
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = announcements.value.length - 1;
  }
  restartAutoplay();
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
  restartAutoplay();
};

// Autoplay functionality
const startAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
  }

  autoplayInterval.value = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

const restartAutoplay = () => {
  stopAutoplay();
  startAutoplay();
};

// Lifecycle hooks
onMounted(() => {
  fetchAnnouncements();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>
