<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h3>
        {{ isEdit ? $t("editProduct") : $t("addNewProduct") }}
      </h3>
      <form @submit.prevent="submitForm">
        <!-- Add/Edit Product Form Fields -->
        <div class="form-group">
          <label for="name">{{ $t("productName") }}:</label>
          <input type="text" id="name" v-model="product.name" required />
        </div>
        <div class="form-group">
          <label for="priceRubles">{{ $t("priceRubles") }}:</label>
          <input
            type="number"
            id="priceRubles"
            v-model="product.priceRubles"
            required
          />
        </div>
        <div class="form-group">
          <label for="priceEuros">{{ $t("priceEuros") }}:</label>
          <input
            type="number"
            id="priceEuros"
            v-model="product.priceEuros"
            required
          />
        </div>
        <div class="form-group">
          <label for="artist">{{ $t("artist") }}:</label>
          <input type="text" id="artist" v-model="product.artist" required />
        </div>
        <div class="form-group">
          <label for="size">{{ $t("size") }}:</label>
          <input type="text" id="size" v-model="product.size" required />
        </div>
        <div class="form-group">
          <label for="material">{{ $t("material") }}:</label>
          <input
            type="text"
            id="material"
            v-model="product.material"
            required
          />
        </div>
        <div class="form-group">
          <label for="parts">{{ $t("parts") }}:</label>
          <input type="text" id="parts" v-model="product.parts" />
        </div>
        <div class="form-group">
          <label for="boxArt">{{ $t("boxArt") }}:</label>
          <input type="text" id="boxArt" v-model="product.boxArt" required />
        </div>
        <div class="form-group">
          <label for="description">{{ $t("description") }}:</label>
          <textarea id="description" v-model="product.description"></textarea>
        </div>
        <div class="form-group">
          <label for="mainImageUrl">{{ $t("mainImageUrl") }}:</label>
          <div class="image-selection">
            <input
              type="text"
              id="mainImageUrl"
              v-model="product.mainImageUrl"
              readonly
            />
            <button type="button" @click="openImageManager(false)">
              {{ $t("selectImage") }}
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="secondaryImageUrls"
            >{{ $t("secondaryImageUrls") }}:</label
          >
          <div class="image-selection">
            <textarea
              id="secondaryImageUrls"
              v-model="product.secondaryImageUrls"
              readonly
            ></textarea>
            <button type="button" @click="openImageManager(true)">
              {{ $t("selectImages") }}
            </button>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit">
            {{ isEdit ? $t("updateProduct") : $t("addProduct") }}
          </button>
          <button type="button" @click="close">
            {{ $t("cancel") }}
          </button>
        </div>
      </form>

      <!-- Image Manager Modal -->
      <ImageManagerModal
        :show="showImageManager"
        :allowMultiple="allowMultiple"
        @close="closeImageManager"
        @confirm="handleImageSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ImageManagerModal from "@/components/admin/image-manager/ImageManagerModal.vue";

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  product: {
    type: Object,
    default: () => ({
      name: "",
      priceRubles: 0,
      priceEuros: 0,
      artist: "",
      size: "",
      material: "",
      parts: "",
      boxArt: "",
      description: "",
      mainImageUrl: "",
      secondaryImageUrls: "",
    }),
  },
});

const emits = defineEmits(["close", "submitForm"]);

const showImageManager = ref(false);
const allowMultiple = ref(false);

const openImageManager = (multiple: boolean) => {
  allowMultiple.value = multiple;
  showImageManager.value = true;
};

const closeImageManager = () => {
  showImageManager.value = false;
};

const handleImageSelection = (selectedImages: { url: string }[]) => {
  if (allowMultiple.value) {
    props.product.secondaryImageUrls = selectedImages
      .map((img) => img.url)
      .join(", ");
  } else {
    props.product.mainImageUrl = selectedImages[0]?.url || "";
  }
  closeImageManager();
};

const close = () => {
  emits("close");
};

const submitForm = () => {
  emits("submitForm", props.product);
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

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
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
