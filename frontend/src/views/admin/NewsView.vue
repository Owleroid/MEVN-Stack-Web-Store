<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6">
        <button
          @click="openAddNewsModal"
          class="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <span class="material-icons text-sm">add</span>
          {{ $t("addNews") }}
        </button>
        <div></div>
      </div>

      <!-- News List Section -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="p-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-800">
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
                class="px-3 py-1.5 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">{{ $t("allLanguages") }}</option>
                <option value="en">English</option>
                <option value="ru">Russian</option>
              </select>
            </div>
          </div>
        </div>

        <transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex-1 flex items-center justify-center py-16"
            key="loading-state"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"
              ></div>
              <p class="text-gray-600 text-sm">
                {{ $t("loadingNews") || "Loading news..." }}
              </p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-6 text-center" key="error-state">
            <div
              class="bg-red-50 text-red-700 p-4 rounded-md inline-block max-w-lg"
            >
              <div class="flex items-center mb-2">
                <span class="material-icons text-red-500 mr-2"
                  >error_outline</span
                >
                <span class="font-medium">{{ $t("error") || "Error" }}</span>
              </div>
              <p>{{ error }}</p>
              <button
                @click="fetchNews()"
                class="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                {{ $t("retry") || "Retry" }}
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="newsList.length === 0"
            class="flex-1 flex flex-col items-center justify-center py-16"
            key="empty-state"
          >
            <div class="text-gray-200 mb-3">
              <span class="material-icons" style="font-size: 5rem">feed</span>
            </div>
            <p class="text-gray-700 text-lg font-medium mb-1">
              {{
                selectedLanguage
                  ? $t("noNewsItemsForLanguage")
                  : $t("noNewsItems")
              }}
            </p>
            <p class="text-gray-500 text-sm mb-6 max-w-md text-center">
              {{
                $t("noNewsItemsDescription") ||
                "News and updates help keep your users informed about important information."
              }}
            </p>
            <button
              @click="openAddNewsModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span class="material-icons text-sm">add</span>
              {{ $t("createFirstNews") }}
            </button>
          </div>

          <!-- News List -->
          <div v-else class="p-4" key="news-list">
            <transition-group
              tag="div"
              class="space-y-4"
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 transform -translate-y-4"
              enter-to-class="opacity-100 transform translate-y-0"
              leave-from-class="opacity-100 transform translate-y-0"
              leave-to-class="opacity-0 transform -translate-y-4"
            >
              <div
                v-for="newsItem in newsList"
                :key="newsItem._id"
                class="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md group"
                :class="{ 'bg-gray-50': !newsItem.isActive }"
              >
                <div class="p-4 flex flex-wrap md:flex-nowrap gap-6">
                  <!-- News Image -->
                  <div class="w-full md:w-40 flex-shrink-0">
                    <div
                      class="aspect-video md:aspect-square bg-gray-50 rounded overflow-hidden border border-gray-200 transition-all duration-200 group-hover:border-gray-300 shadow-sm"
                    >
                      <img
                        v-if="newsItem.imageUrl"
                        :src="newsItem.imageUrl"
                        :alt="newsItem.title"
                        class="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-300 text-sm"
                      >
                        <span class="material-icons text-3xl"
                          >image_not_supported</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- News Content -->
                  <div class="flex-1">
                    <div class="flex justify-between items-start mb-2 gap-2">
                      <h3
                        class="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200"
                      >
                        {{ newsItem.title }}
                      </h3>
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0"
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

                    <div
                      class="flex flex-wrap justify-between items-center gap-3"
                    >
                      <!-- Action Buttons -->
                      <div class="flex flex-wrap gap-2">
                        <button
                          @click="editNews(newsItem)"
                          class="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors border border-blue-100 flex items-center justify-center"
                          :title="$t('edit')"
                        >
                          <span class="material-icons text-sm leading-none"
                            >edit</span
                          >
                        </button>
                        <button
                          @click="toggleNewsStatus(newsItem)"
                          class="p-2 rounded transition-colors flex items-center justify-center"
                          :class="
                            newsItem.isActive
                              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                          "
                          :title="
                            newsItem.isActive
                              ? $t('deactivate')
                              : $t('activate')
                          "
                        >
                          <span class="material-icons text-sm leading-none">{{
                            newsItem.isActive ? "visibility_off" : "visibility"
                          }}</span>
                        </button>
                        <button
                          @click="confirmDeleteNews(newsItem._id)"
                          class="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center"
                          :title="$t('delete')"
                        >
                          <span class="material-icons text-sm leading-none"
                            >delete</span
                          >
                        </button>
                      </div>

                      <!-- Status and Date -->
                      <div class="flex items-center gap-3 text-sm">
                        <span
                          class="px-2.5 py-1 rounded-full text-xs font-medium inline-block min-w-[70px] text-center"
                          :class="
                            newsItem.isActive
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          "
                        >
                          {{
                            newsItem.isActive ? $t("active") : $t("inactive")
                          }}
                        </span>
                        <span
                          class="text-gray-500 whitespace-nowrap flex items-center gap-1"
                        >
                          <span class="material-icons text-xs"
                            >calendar_today</span
                          >
                          {{ formatDate(newsItem.createdAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </transition>
      </div>
    </div>

    <!-- Add/Edit News Modal -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      appear
    >
      <add-edit-news-modal
        v-if="showAddEditModal"
        :show="showAddEditModal"
        :is-edit="isEditMode"
        :news="selectedNews"
        :is-submitting="isSubmitting"
        @close="closeAddEditModal"
        @submit="handleSubmitNews"
        @open-image-manager="openImageManager"
      />
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      appear
    >
      <delete-news-modal
        v-if="showDeleteModal"
        :show="showDeleteModal"
        :is-loading="isDeleting"
        @confirm="handleDeleteNews"
        @cancel="closeDeleteModal"
      />
    </transition>
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
const fetchNews = async (page: number = 1) => {
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
    setTimeout(() => {
      loading.value = false;
    }, 300); // Add a small delay for smoother transitions
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
