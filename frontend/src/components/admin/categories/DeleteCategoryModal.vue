<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="cancelRemove">&times;</span>
      <p>{{ $t("adminCategoriesView.deleteConfirmation") }}</p>
      <div class="form-actions">
        <button @click="confirmDelete">
          {{ $t("adminCategoriesView.deleteWithProducts") }}
        </button>
        <button @click="openReassignModal">
          {{ $t("adminCategoriesView.reassignAndDelete") }}
        </button>
        <button @click="cancelRemove">
          {{ $t("adminCategoriesView.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  show: Boolean,
});

const emits = defineEmits([
  "confirmDelete",
  "openReassignModal",
  "cancelRemove",
]);

const confirmDelete = () => {
  emits("confirmDelete");
};

const openReassignModal = () => {
  emits("openReassignModal");
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

p {
  margin-top: 0;
  font-size: 18px;
  text-align: center;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
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
