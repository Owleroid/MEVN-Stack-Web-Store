<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h3>{{ $t("imageManager") }}</h3>

      <!-- Upload Section -->
      <div class="upload-section">
        <h4>{{ $t("uploadImages") }}</h4>
        <input type="file" @change="handleFileUpload" multiple />
        <button
          @click="handleUploadImages"
          :disabled="selectedFiles.length === 0"
        >
          {{ $t("upload") }}
        </button>
      </div>

      <!-- Image List -->
      <div class="image-list">
        <h4>{{ $t("availableImages") }}</h4>
        <div v-if="loading">
          <p>{{ $t("loadingImages") }}</p>
        </div>
        <div v-else-if="images.length === 0">
          <p>{{ $t("noImages") }}</p>
        </div>
        <div v-else class="images-grid">
          <div
            v-for="image in images"
            :key="image.url"
            class="image-item"
            :class="{ selected: isSelected(image) }"
            @click="toggleImageSelection(image)"
          >
            <img :src="image.url" :alt="image.name" />
            <p>{{ image.name }}</p>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-actions">
        <button @click="confirmSelection">{{ $t("confirm") }}</button>
        <button @click="close">{{ $t("cancel") }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

import { fetchImages, uploadImages } from "@/services/imageManagerService";

const props = defineProps({
  show: Boolean,
  allowMultiple: Boolean, // Determines if multiple images can be selected
});

const { t } = useI18n();
const toast = useToast();

const emits = defineEmits(["close", "confirm"]);

const images = ref<{ url: string; name: string }[]>([]);
const selectedFiles = ref<File[]>([]);
const selectedImages = ref<{ url: string; name: string }[]>([]);
const loading = ref(false);

const fetchImagesFromBackend = async () => {
  loading.value = true;
  try {
    const response = await fetchImages();
    images.value = response.images;
  } catch (error) {
    toast.error(t("fetchImagesError"));
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    selectedFiles.value = Array.from(files);
    toast.success(`${files.length} file(s) selected.`);
  }
};

const handleUploadImages = async () => {
  try {
    await uploadImages(selectedFiles.value);
    toast.success("Images uploaded successfully.");
    selectedFiles.value = [];
    await fetchImagesFromBackend();
  } catch (error) {
    toast.error("Failed to upload images.");
  }
};

const toggleImageSelection = (image: { url: string; name: string }) => {
  if (props.allowMultiple) {
    if (selectedImages.value.includes(image)) {
      selectedImages.value = selectedImages.value.filter(
        (img) => img !== image
      );
    } else {
      selectedImages.value.push(image);
    }
  } else {
    selectedImages.value = [image];
  }
};

const isSelected = (image: { url: string; name: string }) => {
  return selectedImages.value.includes(image);
};

const confirmSelection = () => {
  emits("confirm", selectedImages.value);
};

const close = () => {
  emits("close");
};

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      selectedImages.value = [];
    }
  }
);

onMounted(() => {
  fetchImagesFromBackend();
});
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
  max-width: 800px;
  max-height: 90%;
  overflow-y: auto;
}

.upload-section {
  margin-bottom: 20px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.image-item {
  text-align: center;
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.image-item.selected {
  border-color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.image-item img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
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
