<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="cancelRemove">&times;</span>
      <h2>{{ $t("chooseNewCategory") }}</h2>
      <div class="form-group">
        <label for="newCategory">{{ $t("chooseNewCategory") }}</label>
        <select id="newCategory" v-model="newCategoryId">
          <option
            v-for="category in categories"
            :key="category._id"
            :value="category._id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button @click="reassignAndRemoveCategory">
          {{ $t("reassignAndDelete") }}
        </button>
        <button type="button" @click="cancelRemove">
          {{ $t("cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { Category } from "@/types/categories";

const props = defineProps({
  show: Boolean,
  categories: Array as () => Category[],
  selectedCategoryId: String,
});

const emits = defineEmits(["reassignAndRemoveCategory", "cancelRemove"]);

const newCategoryId = ref<string | null>(null);

const reassignAndRemoveCategory = () => {
  emits("reassignAndRemoveCategory", newCategoryId.value);
};

const cancelRemove = () => {
  emits("cancelRemove");
};
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #ccc;
  width: 80%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

h2 {
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
