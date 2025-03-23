<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h3>
        {{
          $t("adminProductsView.changeCategoryFor", {
            name: productToChangeCategory?.name,
          })
        }}
      </h3>
      <select v-model="selectedNewCategory">
        <option
          v-for="category in filteredCategories"
          :key="category._id"
          :value="category._id"
        >
          {{ category.name }}
        </option>
      </select>
      <div class="form-actions">
        <button @click="changeCategory(selectedNewCategory)">
          {{ $t("adminProductsView.change") }}
        </button>
        <button @click="close">{{ $t("adminProductsView.cancel") }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from "@/types/categories";
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  show: Boolean,
  productToChangeCategory: Object,
  categories: Array,
});

const emits = defineEmits(["close", "changeCategory"]);

const selectedNewCategory = ref<string>("");

const filteredCategories = computed(() => {
  return ((props.categories ?? []) as Category[]).filter(
    (category: Category) =>
      category._id !== props.productToChangeCategory?.category
  );
});

const close = () => {
  emits("close");
};

const changeCategory = (newCategoryId: string) => {
  if (!newCategoryId) {
    alert("Please select a new category");
    return;
  }
  emits("changeCategory", newCategoryId);
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  max-height: 90%;
  overflow-y: auto;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"] {
  background-color: #6c757d;
}

button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
