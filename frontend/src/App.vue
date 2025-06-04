<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-r from-[#191919] to-[#0E0E0E] text-main-gray font-normal font-['Oswald']"
  >
    <Navbar v-if="!isAdminRoute" />
    <AdminNavbar v-if="isAdminRoute">
      <router-view />
    </AdminNavbar>
    <router-view v-if="!isAdminRoute" />

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
  const region = await authStore.determineUserRegion();

  if (!region) {
    showRegionSelector.value = true;
  }
});

const onRegionSelected = () => {
  showRegionSelector.value = false;
};
</script>

<style>
:root {
  --Background: linear-gradient(90deg, #191919 0%, #0e0e0e 100%);
}

#app {
  background: var(--Background);
  min-height: 100vh;
}
</style>
