<template>
  <div class="image-manager">
    <!-- Upload Section -->
    <div class="upload-section">
      <h1>{{ $t("imageManager") }}</h1>
      <h2>{{ $t("uploadImages") }}</h2>
      <input type="file" @change="handleFileUpload" multiple />
      <button
        @click="handleUploadImages"
        :disabled="selectedFiles.length === 0"
      >
        {{ $t("upload") }}
      </button>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Image List -->
      <div class="image-list">
        <h2>{{ $t("availableImages") }}</h2>
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
            :class="{ selected: selectedImages.includes(image) }"
            @click="toggleImageSelection(image)"
          >
            <img :src="image.url" :alt="image.name" />
            <p>{{ image.name }}</p>
          </div>
        </div>
      </div>

      <!-- Batch Actions -->
      <div class="batch-actions">
        <button v-if="selectedImages.length > 0" @click="copySelectedUrls">
          {{ $t("copyUrls") }}
        </button>
        <button v-if="selectedImages.length > 0" @click="deleteSelectedImages">
          {{ $t("deleteSelected") }}
        </button>
        <button v-if="selectedImages.length > 0" @click="cancelSelection">
          {{ $t("cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

import {
  fetchImages,
  uploadImages as uploadImagesService,
  deleteImages,
} from "@/services/imageManagerService";

const toast = useToast();
const { t } = useI18n();

const images = ref([]);
const selectedFiles = ref([]);
const selectedImages = ref([]);
const loading = ref(false);

// Allowed MIME types and max file size
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

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

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files) {
    const validFiles = [];
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.type)) {
        toast.error(t("invalidFileType", { fileName: file.name }));
        continue;
      }
      if (file.size > maxFileSize) {
        toast.error(t("fileTooLarge", { fileName: file.name }));
        continue;
      }
      validFiles.push(file);
    }
    selectedFiles.value = validFiles;
    if (validFiles.length > 0) {
      toast.success(t("filesSelected", { count: validFiles.length }));
    }
  }
};

const handleUploadImages = async () => {
  try {
    await uploadImagesService(selectedFiles.value);
    toast.success(t("uploadSuccess"));
    selectedFiles.value = [];
    await fetchImagesFromBackend();
  } catch (error) {
    console.error("Upload Error:", error);
    toast.error(t("uploadError"));
  }
};

const deleteSelectedImages = async () => {
  try {
    const imageNames = selectedImages.value.map((image) => image.name);
    await deleteImages(imageNames);
    images.value = images.value.filter(
      (img) => !selectedImages.value.includes(img)
    );
    selectedImages.value = [];
    toast.success(t("deleteSuccess"));
  } catch (error) {
    toast.error(t("deleteError"));
  }
};

const toggleImageSelection = (image) => {
  if (selectedImages.value.includes(image)) {
    selectedImages.value = selectedImages.value.filter((img) => img !== image);
  } else {
    selectedImages.value.push(image);
  }
};

const copySelectedUrls = () => {
  const urls = selectedImages.value.map((image) => image.url).join(", ");
  navigator.clipboard.writeText(urls).then(() => {
    toast.success(t("copySuccess"));
  });
};

const cancelSelection = () => {
  selectedImages.value = [];
};

onMounted(() => {
  fetchImagesFromBackend();
});
</script>

<style scoped>
.image-manager {
  padding: 2rem;
  background-color: #f4f6f8;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-section {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-section input {
  margin-right: 1rem;
}

.upload-section button {
  padding: 0.6rem 1.2rem;
  width: 160px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-section button:hover {
  background-color: #0056b3;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-list {
  flex: 1;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
}

.batch-actions {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  min-height: 60px;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.batch-actions button {
  padding: 0.6rem 1.2rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.batch-actions button:hover {
  background-color: #5a6268;
}

.image-item {
  text-align: center;
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease,
    transform 0.2s ease;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.image-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-item.selected {
  border-color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.image-item img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-item p {
  margin-top: 0.8rem;
  font-size: 0.95rem;
  color: #495057;
  font-weight: 500;
}
</style>
