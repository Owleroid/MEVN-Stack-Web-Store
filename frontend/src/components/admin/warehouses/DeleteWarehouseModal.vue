<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <span class="close" @click="cancelDelete">&times;</span>
      <h2>{{ $t("deleteWarehouseModal.deleteWarehouse") }}</h2>
      <p>{{ $t("deleteWarehouseModal.selectWarehouseToDelete") }}</p>
      <div class="form-group">
        <label for="warehouseSelect">{{
          $t("deleteWarehouseModal.warehouse")
        }}</label>
        <select id="warehouseSelect" v-model="selectedWarehouseId">
          <option
            v-for="warehouse in warehouses"
            :key="warehouse._id"
            :value="warehouse._id"
          >
            {{ warehouse.name }}
          </option>
        </select>
      </div>
      <div class="form-actions">
        <button @click="confirmDelete">
          {{ $t("deleteWarehouseModal.delete") }}
        </button>
        <button type="button" @click="cancelDelete">
          {{ $t("deleteWarehouseModal.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { Warehouse } from "@/types/warehouse";

const props = defineProps<{
  show: boolean;
  warehouses: Warehouse[];
}>();

const emits = defineEmits(["confirmDelete", "cancelDelete"]);

const selectedWarehouseId = ref<string | null>(null);

const confirmDelete = () => {
  if (selectedWarehouseId.value) {
    emits("confirmDelete", selectedWarehouseId.value);
  }
};

const cancelDelete = () => {
  emits("cancelDelete");
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

p {
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
