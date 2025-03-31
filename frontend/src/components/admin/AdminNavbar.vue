<template>
  <nav v-if="!translationsLoading">
    <ul class="left">
      <li>
        <router-link to="/admin/categories">
          {{ $t("categories") }}
        </router-link>
      </li>
      <li>
        <router-link to="/admin/products">
          {{ $t("products") }}
        </router-link>
      </li>
      <li>
        <router-link to="/admin/warehouse">
          {{ $t("warehouse") }}
        </router-link>
      </li>
      <li>
        <router-link to="/admin/orders">
          {{ $t("orders") }}
        </router-link>
      </li>
      <li>
        <router-link to="/admin/image-manager">
          {{ $t("imageManager") }}
        </router-link>
      </li>
      <li>
        <router-link to="/admin/clients">
          {{ $t("clients") }}
        </router-link>
      </li>
      <li>
        <router-link to="/admin/news">
          {{ $t("news") }}
        </router-link>
      </li>
    </ul>
    <ul class="right">
      <li>
        <router-link to="/">
          {{ $t("home") }}
        </router-link>
      </li>
    </ul>
  </nav>
  <div v-else>Loading translations...</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { translationsLoaded } from "@/i18n";

const translationsLoading = computed(() => !translationsLoaded.value);
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #333;
  color: white;
}

ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

a {
  color: white;
  text-decoration: none;
}
</style>
