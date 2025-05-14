<!-- frontend/src/views/HomeView.vue -->
<template>
  <div class="max-w-5xl mx-auto px-6 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">{{ $t("home") }}</h1>

    <!-- Announcements Carousel -->
    <AnnouncementCarousel />

    <!-- Existing home content -->
    <div class="bg-white rounded-lg shadow p-6"></div>
  </div>
</template>

<script setup lang="ts">
import AnnouncementCarousel from "@/components/general/AnnouncementCarousel.vue";
</script>

<style scoped>
h1 {
  color: #333;
}
</style>
