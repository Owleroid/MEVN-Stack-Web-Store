<template>
  <div id="app">
    <Navbar v-if="!isAdminRoute" />
    <AdminNavbar v-if="isAdminRoute" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import Navbar from "@/components/Navbar.vue";
import AdminNavbar from "@/components/AdminNavbar.vue";

const route = useRoute();

const isAdminRoute = computed(() => {
  return route.path.startsWith("/admin");
});
</script>
