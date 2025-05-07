<template>
  <div id="app">
    <Navbar v-if="!isAdminRoute" />
    <AdminNavbar v-if="isAdminRoute" />
    <router-view />

    <!-- Region selector modal -->
    <RegionSelector
      v-if="showRegionSelector"
      @region-selected="onRegionSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

import Navbar from "@/components/general/Navbar.vue";
import AdminNavbar from "@/components/admin/AdminNavbar.vue";
import RegionSelector from "@/components/general/RegionSelector.vue";

const route = useRoute();
const authStore = useAuthStore();
const showRegionSelector = ref(false);

const isAdminRoute = computed(() => {
  return route.path.startsWith("/admin");
});

onMounted(async () => {
  // Try to determine user region automatically
  const region = await authStore.determineUserRegion();

  // If no region was determined, show the selector
  if (!region) {
    showRegionSelector.value = true;
  }
});

const onRegionSelected = () => {
  showRegionSelector.value = false;
};
</script>
