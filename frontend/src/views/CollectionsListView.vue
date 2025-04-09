<template>
  <div class="store-view">
    <div v-if="categories.length === 0" class="no-categories">
      {{ $t("underConstruction") }}
    </div>
    <div v-else class="categories-grid">
      <div
        v-for="category in categories"
        :key="category._id"
        class="category-card"
        @click="goToCategory(category._id ?? '')"
      >
        <img :src="category.imageUrl" :alt="category.name" />
        <h2>{{ category.name }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import type { Category } from "@/types/categories";
import { getAllCategories } from "@/services/storeService";

const categories = ref<Category[]>([]);
const { t } = useI18n();
const router = useRouter();

const fetchCategories = async () => {
  try {
    const response = await getAllCategories();
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const goToCategory = (categoryId: string) => {
  router.push(`/collections/${categoryId}`);
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.store-view {
  padding: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.category-card {
  cursor: pointer;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s;
}

.category-card:hover {
  transform: scale(1.05);
}

.category-card img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.no-categories {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}
</style>
