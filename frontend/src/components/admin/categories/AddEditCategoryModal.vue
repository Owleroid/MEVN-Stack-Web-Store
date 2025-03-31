<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h2>{{ mode === "add" ? $t("addNewCategory") : $t("editCategory") }}</h2>
      <form @submit.prevent="submitForm">
        <!-- Category Name -->
        <div class="form-group">
          <label for="categoryName">{{ $t("categoryName") }}</label>
          <input
            type="text"
            id="categoryName"
            v-model="categoryName"
            required
          />
        </div>

        <!-- Category Image -->
        <div class="form-group">
          <label for="categoryImage">{{ $t("categoryImage") }}</label>
          <div class="image-selection">
            <input
              type="text"
              id="categoryImage"
              v-model="categoryImageUrl"
              readonly
            />
            <button type="button" @click="openImageManager">
              {{ $t("selectImage") }}
            </button>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit">
            {{ mode === "add" ? $t("addCategory") : $t("updateCategory") }}
          </button>
          <button type="button" @click="cancelAction">
            {{ $t("cancel") }}
          </button>
        </div>
      </form>

      <!-- Image Manager Modal -->
      <ImageManagerModal
        :show="showImageManager"
        :allowMultiple="false"
        @close="closeImageManager"
        @confirm="handleImageSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import ImageManagerModal from "@/components/admin/image-manager/ImageManagerModal.vue";

const props = defineProps({
  show: Boolean,
  mode: {
    type: String,
    required: true,
    validator: (value: string) => ["add", "edit"].includes(value),
  },
  initialCategoryName: {
    type: String,
    default: "",
  },
  initialCategoryImageUrl: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["submitForm", "cancelAction"]);

const categoryName = ref(props.initialCategoryName);
const categoryImageUrl = ref(props.initialCategoryImageUrl);

const showImageManager = ref(false);

watch(
  () => props.initialCategoryName,
  (newValue) => {
    categoryName.value = newValue;
  }
);

watch(
  () => props.initialCategoryImageUrl,
  (newValue) => {
    categoryImageUrl.value = newValue;
  }
);

const openImageManager = () => {
  showImageManager.value = true;
};

const closeImageManager = () => {
  showImageManager.value = false;
};

const handleImageSelection = (selectedImages: { url: string }[]) => {
  if (selectedImages.length > 0) {
    categoryImageUrl.value = selectedImages[0].url;
  }
  closeImageManager();
};

const submitForm = () => {
  emits("submitForm", {
    name: categoryName.value,
    imageUrl: categoryImageUrl.value,
  });
};

const cancelAction = () => {
  emits("cancelAction");
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

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.image-selection {
  display: flex;
  gap: 10px;
  align-items: center;
}

.image-selection button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.image-selection button:hover {
  background-color: #0056b3;
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
