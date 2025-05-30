<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ $t("newsManagement") }}
      </h1>
      <button
        @click="openAddNewsModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <span class="material-icons">add</span>
        {{ $t("addNews") }}
      </button>
    </div>

    <!-- News List Section -->
    <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">
          {{ $t("newsList") }}
        </h2>

        <!-- Language Filter -->
        <div class="flex items-center gap-2">
          <label for="languageFilter" class="text-sm text-gray-600"
            >{{ $t("filterByLanguage") }}:</label
          >
          <select
            id="languageFilter"
            v-model="selectedLanguage"
            @change="handleLanguageChange"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">{{ $t("allLanguages") }}</option>
            <option value="en">English</option>
            <option value="ru">Russian</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-10">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
        ></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-4">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="newsList.length === 0" class="text-center py-10">
        <div class="text-gray-400 text-4xl mb-2">
          <span class="material-icons" style="font-size: 4rem">article</span>
        </div>
        <p class="text-gray-500">
          {{
            selectedLanguage ? $t("noNewsItemsForLanguage") : $t("noNewsItems")
          }}
        </p>
        <button
          @click="openAddNewsModal"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ $t("createFirstNews") }}
        </button>
      </div>

      <!-- News List -->
      <div v-else class="space-y-6">
        <div
          v-for="newsItem in newsList"
          :key="newsItem._id"
          class="border border-gray-200 rounded-lg overflow-hidden transition-all"
          :class="{ 'bg-gray-50': !newsItem.isActive }"
        >
          <div class="p-4 flex flex-wrap md:flex-nowrap gap-6">
            <!-- News Image -->
            <div class="w-full md:w-40">
              <div
                class="w-full h-40 md:h-32 bg-gray-100 rounded overflow-hidden"
              >
                <img
                  v-if="newsItem.imageUrl"
                  :src="newsItem.imageUrl"
                  :alt="newsItem.title"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400 text-sm"
                >
                  {{ $t("noImage") }}
                </div>
              </div>
            </div>

            <!-- News Content -->
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-medium">
                  {{ newsItem.title }}
                </h3>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="
                    newsItem.language === 'en'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ newsItem.language === "en" ? "English" : "Russian" }}
                </span>
              </div>
              <div
                class="text-gray-600 mb-4 line-clamp-2 prose-sm prose max-h-16 overflow-hidden"
                v-html="getPreviewText(newsItem.text)"
              ></div>

              <div class="flex flex-wrap justify-between items-center gap-3">
                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="editNews(newsItem)"
                    class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span class="material-icons text-sm">edit</span>
                    {{ $t("edit") }}
                  </button>
                  <button
                    @click="toggleNewsStatus(newsItem)"
                    class="px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1"
                    :class="
                      newsItem.isActive
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    "
                  >
                    <span class="material-icons text-sm">{{
                      newsItem.isActive ? "visibility_off" : "visibility"
                    }}</span>
                    {{ newsItem.isActive ? $t("deactivate") : $t("activate") }}
                  </button>
                  <button
                    @click="confirmDeleteNews(newsItem._id)"
                    class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <span class="material-icons text-sm">delete</span>
                    {{ $t("delete") }}
                  </button>
                </div>

                <!-- Status and Date -->
                <div class="flex flex-wrap items-center gap-3 text-sm">
                  <div
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="
                      newsItem.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    "
                  >
                    {{ newsItem.isActive ? $t("active") : $t("inactive") }}
                  </div>
                  <div class="text-gray-500">
                    {{ formatDate(newsItem.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit News Modal -->
    <add-edit-news-modal
      :show="showAddEditModal"
      :is-edit="isEditMode"
      :news="selectedNews"
      :is-submitting="isSubmitting"
      @close="closeAddEditModal"
      @submit="handleSubmitNews"
      @open-image-manager="openImageManager"
    />

    <!-- Delete Confirmation Modal -->
    <delete-news-modal
      :show="showDeleteModal"
      :is-loading="isDeleting"
      @confirm="handleDeleteNews"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { format } from "date-fns";

import AddEditNewsModal from "@/components/admin/news/AddEditNewsModal.vue";
import DeleteNewsModal from "@/components/admin/news/DeleteNewsModal.vue";

import type {
  News,
  NewsInput,
  UpdateNewsInput,
  UpdateNewsStatus,
} from "@/types/news";

import {
  getAllNews,
  createNews,
  updateNews,
  updateNewsStatus,
  deleteNews,
} from "@/services/newsService";

// Composables
const toast = useToast();
const { t } = useI18n();

// State Management
const newsList = ref<News[]>([]);
const loading = ref(true);
const error = ref("");
const selectedLanguage = ref("");

// Modal States
const showAddEditModal = ref(false);
const showDeleteModal = ref(false);
const showImageManagerModal = ref(false);

// Action States
const isEditMode = ref(false);
const selectedNews = ref<News | null>(null);
const selectedNewsId = ref<string | null>(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);

// Helper functions for HTML content
const stripHtml = (html: string): string => {
  // Create a temporary element to strip HTML tags
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || "";
};

const getPreviewText = (html: string): string => {
  const plainText = stripHtml(html);

  // If the text is already short, just return the HTML
  if (plainText.length <= 150) {
    return html;
  }

  // For longer text, truncate and add ellipsis
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  // Get all text nodes recursively
  const textNodes: Node[] = [];
  const getTextNodes = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      node.childNodes.forEach((child) => getTextNodes(child));
    }
  };

  getTextNodes(tempElement);

  let currentLength = 0;
  let truncated = false;

  // Truncate text nodes until we reach the limit
  for (const node of textNodes) {
    const text = node.textContent || "";
    if (currentLength + text.length > 150) {
      // Find how many characters we can add
      const remainingChars = 150 - currentLength;
      const lastSpace = text.substring(0, remainingChars).lastIndexOf(" ");
      const cutPoint = lastSpace > 0 ? lastSpace : remainingChars;

      // Truncate the text node
      node.textContent = text.substring(0, cutPoint) + "...";
      truncated = true;
      break;
    }
    currentLength += text.length;
  }

  // If we haven't truncated yet, add ellipsis to the last text node
  if (!truncated && textNodes.length > 0) {
    const lastNode = textNodes[textNodes.length - 1];
    lastNode.textContent = (lastNode.textContent || "") + "...";
  }

  return tempElement.innerHTML;
};

// Fetch all news with optional language filter
const fetchNews = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAllNews(selectedLanguage.value || undefined);

    if (response.success) {
      newsList.value = response.news;
    } else {
      error.value = t("failedToLoadNews");
    }
  } catch (err) {
    console.error("Error fetching news:", err);
    error.value = t("errorFetchingNews");
  } finally {
    loading.value = false;
  }
};

// Handle language filter change
const handleLanguageChange = () => {
  fetchNews();
};

// Format date for display
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm");
  } catch (err) {
    return dateString;
  }
};

// Modal Handlers
const openAddNewsModal = () => {
  isEditMode.value = false;
  selectedNews.value = null;
  showAddEditModal.value = true;
};

const editNews = (newsItem: News) => {
  isEditMode.value = true;
  selectedNews.value = newsItem;
  showAddEditModal.value = true;
};

const closeAddEditModal = () => {
  showAddEditModal.value = false;
};

const confirmDeleteNews = (newsId: string) => {
  selectedNewsId.value = newsId;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedNewsId.value = null;
};

const openImageManager = () => {
  showImageManagerModal.value = true;
};

const toggleNewsStatus = async (newsItem: News) => {
  try {
    const statusUpdate: UpdateNewsStatus = {
      isActive: !newsItem.isActive,
    };

    const response = await updateNewsStatus(newsItem._id, statusUpdate);

    if (response.success) {
      toast.success(
        newsItem.isActive ? t("newsDeactivated") : t("newsActivated")
      );
      await fetchNews();
    } else {
      toast.error(t("failedToUpdateStatus"));
    }
  } catch (err) {
    console.error("Error updating news status:", err);
    toast.error(t("errorUpdatingStatus"));
  }
};

const handleSubmitNews = async (formData: NewsInput | UpdateNewsInput) => {
  isSubmitting.value = true;

  try {
    if (isEditMode.value && selectedNews.value) {
      const response = await updateNews(
        selectedNews.value._id,
        formData as UpdateNewsInput
      );

      if (response.success) {
        toast.success(t("newsUpdated"));
        closeAddEditModal();
        await fetchNews();
      } else {
        toast.error(t("failedToUpdateNews"));
      }
    } else {
      const response = await createNews(formData as NewsInput);

      if (response.success) {
        toast.success(t("newsCreated"));
        closeAddEditModal();
        await fetchNews();
      } else {
        toast.error(t("failedToCreateNews"));
      }
    }
  } catch (err) {
    console.error("Error submitting news:", err);
    toast.error(
      isEditMode.value ? t("errorUpdatingNews") : t("errorCreatingNews")
    );
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteNews = async () => {
  if (!selectedNewsId.value) return;

  isDeleting.value = true;

  try {
    const response = await deleteNews(selectedNewsId.value);

    if (response.success) {
      toast.success(t("newsDeleted"));
      closeDeleteModal();
      await fetchNews();
    } else {
      toast.error(t("failedToDeleteNews"));
    }
  } catch (err) {
    console.error("Error deleting news:", err);
    toast.error(t("errorDeletingNews"));
  } finally {
    isDeleting.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchNews();
});
</script>
