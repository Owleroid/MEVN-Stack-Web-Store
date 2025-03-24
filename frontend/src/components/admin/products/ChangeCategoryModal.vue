<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h3>
        {{
          $t("adminProductsView.changeCategoryFor", {
            name: productToChangeCategory?.name,
          })
        }}
      </h3>
      <div class="form-group">
        <label for="newCategory">{{
          $t("adminProductsView.chooseNewCategory")
        }}</label>
        <select id="newCategory" v-model="selectedNewCategory">
          <option
            v-for="category in filteredCategories"
            :key="category._id"
            :value="category._id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button @click="changeCategory(selectedNewCategory)">
          {{ $t("adminProductsView.change") }}
        </button>
        <button type="button" @click="close">
          {{ $t("adminProductsView.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";

import type { Category } from "@/types/categories";

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
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 10px;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

h3 {
  margin-top: 0;
  font-size: 24px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  width: fit-content;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
}

.form-actions button:hover {
  background-color: #0056b3;
}

.form-actions button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
