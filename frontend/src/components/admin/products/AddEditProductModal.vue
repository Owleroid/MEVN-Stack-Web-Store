<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h3>
        {{
          isEdit
            ? $t("addEditProductModal.editProduct")
            : $t("addEditProductModal.addNewProduct")
        }}
      </h3>
      <form @submit.prevent="submitForm">
        <!-- Add/Edit Product Form Fields -->
        <div class="form-group">
          <label for="name">{{ $t("addEditProductModal.productName") }}:</label>
          <input type="text" id="name" v-model="product.name" required />
        </div>
        <div class="form-group">
          <label for="priceRubles"
            >{{ $t("addEditProductModal.priceRubles") }}:</label
          >
          <input
            type="number"
            id="priceRubles"
            v-model="product.priceRubles"
            required
          />
        </div>
        <div class="form-group">
          <label for="priceEuros"
            >{{ $t("addEditProductModal.priceEuros") }}:</label
          >
          <input
            type="number"
            id="priceEuros"
            v-model="product.priceEuros"
            required
          />
        </div>
        <div class="form-group">
          <label for="artist">{{ $t("addEditProductModal.artist") }}:</label>
          <input type="text" id="artist" v-model="product.artist" required />
        </div>
        <div class="form-group">
          <label for="size">{{ $t("addEditProductModal.size") }}:</label>
          <input type="text" id="size" v-model="product.size" required />
        </div>
        <div class="form-group">
          <label for="material"
            >{{ $t("addEditProductModal.material") }}:</label
          >
          <input
            type="text"
            id="material"
            v-model="product.material"
            required
          />
        </div>
        <div class="form-group">
          <label for="parts">{{ $t("addEditProductModal.parts") }}:</label>
          <input type="text" id="parts" v-model="product.parts" />
        </div>
        <div class="form-group">
          <label for="boxArt">{{ $t("addEditProductModal.boxArt") }}:</label>
          <input type="text" id="boxArt" v-model="product.boxArt" required />
        </div>
        <div class="form-group">
          <label for="description"
            >{{ $t("addEditProductModal.description") }}:</label
          >
          <textarea id="description" v-model="product.description"></textarea>
        </div>
        <div class="form-group">
          <label for="mainImageUrl"
            >{{ $t("addEditProductModal.mainImageUrl") }}:</label
          >
          <input type="text" id="mainImageUrl" v-model="product.mainImageUrl" />
        </div>
        <div class="form-group">
          <label for="secondaryImageUrls"
            >{{ $t("addEditProductModal.secondaryImageUrls") }}:</label
          >
          <textarea
            id="secondaryImageUrls"
            v-model="product.secondaryImageUrls"
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit">
            {{
              isEdit
                ? $t("addEditProductModal.updateProduct")
                : $t("addEditProductModal.addProduct")
            }}
          </button>
          <button type="button" @click="close">
            {{ $t("addEditProductModal.cancel") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
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
