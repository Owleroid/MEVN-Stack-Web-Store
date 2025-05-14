<template>
  <div class="w-full bg-white rounded-lg shadow overflow-hidden my-8">
    <div class="p-6 relative">
      <!-- Loading State -->
      <div v-if="loading" class="py-12 flex justify-center items-center">
        <div class="flex flex-col items-center">
          <div
            class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3"
          ></div>
          <p class="text-gray-500">{{ $t("loadingAnnouncements") }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="announcements.length === 0" class="py-12 text-center">
        <p class="text-gray-500">{{ $t("noAnnouncements") }}</p>
      </div>

      <!-- Carousel Content -->
      <template v-else>
        <!-- Navigation Buttons -->
        <button
          v-if="announcements.length > 1"
          @click="prevSlide"
          class="absolute z-10 left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          aria-label="Previous slide"
        >
          <svg
            class="w-5 h-5 text-gray-700"
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
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-300 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div
              v-for="announcement in announcements"
              :key="announcement._id"
              class="w-full flex-shrink-0 px-4"
            >
              <div class="flex flex-col md:flex-row gap-6 items-center">
                <!-- Product Image -->
                <div class="w-full md:w-1/3 flex justify-center">
                  <img
                    :src="announcement.imageUrl"
                    :alt="announcement.product.name"
                    class="w-64 h-64 object-contain rounded-md"
                  />
                </div>

                <!-- Product Name and Buttons -->
                <div class="w-full md:w-2/3 flex flex-col">
                  <h3 class="text-xl font-semibold text-gray-800 mb-6">
                    {{ announcement.product.name }}
                  </h3>
                  <div class="flex gap-4">
                    <router-link
                      :to="`/${announcement.product.category.slug}/${announcement.product.slug}`"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {{ $t("viewProduct") }}
                    </router-link>
                    <router-link
                      to="/collections"
                      class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      {{ $t("viewAllCollections") }}
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
          class="absolute z-10 right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          aria-label="Next slide"
        >
          <svg
            class="w-5 h-5 text-gray-700"
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
          class="flex justify-center mt-6 gap-2"
        >
          <button
            v-for="(_, index) in announcements"
            :key="index"
            @click="goToSlide(index)"
            class="w-3 h-3 rounded-full"
            :class="currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
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

      // Start autoplay if there are multiple announcements
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
    currentIndex.value = 0; // Loop back to the first slide
  }
  restartAutoplay();
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = announcements.value.length - 1; // Loop to the last slide
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
  }, 5000); // Change slide every 5 seconds
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
