<template>
  <div class="px-4 py-8 md:py-10 max-w-5xl mx-auto">
    <!-- Header Section -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white">{{ $t("newsAndUpdates") }}</h1>
      <p class="text-main-gray-hover mt-2">
        {{ $t("stayUpdated") }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="relative p-[1px]">
      <!-- Gradient border -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
      ></div>

      <!-- Content with background -->
      <div class="relative bg-[#0E0E0E] flex flex-col items-center py-16">
        <div
          class="w-14 h-14 border-4 border-white border-opacity-20 border-t-main-red rounded-full animate-spin mb-6"
        ></div>
        <p class="text-white text-lg">{{ $t("loading") }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="relative p-[1px]">
      <!-- Gradient border -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
      ></div>

      <!-- Content with background -->
      <div class="relative bg-[#0E0E0E] text-center p-8 text-red-400">
        <p class="text-lg">{{ errorMessage }}</p>
        <button
          @click="fetchNews(currentPage)"
          class="mt-6 px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] hover:from-[#D20A15] hover:to-[#7A020D] transition-colors duration-200 focus:outline-none"
        >
          {{ $t("retry") }}
        </button>
      </div>
    </div>

    <!-- News List -->
    <TransitionGroup
      v-if="!loading && newsItems.length > 0"
      name="list"
      tag="div"
      class="space-y-8"
    >
      <div
        v-for="newsItem in newsItems"
        :key="newsItem._id"
        class="relative p-[1px] overflow-hidden"
      >
        <!-- Gradient border -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
        ></div>

        <!-- Content with background -->
        <div class="relative bg-[#0E0E0E] p-5 md:p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- News Image (if available) -->
            <div v-if="newsItem.imageUrl" class="md:w-1/3">
              <div class="relative h-48 md:h-full overflow-hidden">
                <img
                  :src="newsItem.imageUrl"
                  :alt="newsItem.title"
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
                ></div>
              </div>
            </div>

            <!-- News Content -->
            <div class="flex-1 flex flex-col">
              <!-- Title and Date -->
              <div class="mb-4">
                <h2 class="text-xl text-white font-semibold">
                  {{ newsItem.title }}
                </h2>
                <p class="text-main-gray-hover text-sm mt-1">
                  {{ formatDate(newsItem.createdAt) }}
                </p>
              </div>

              <!-- Preview Text -->
              <div
                class="text-white/90 prose prose-invert prose-sm max-w-none mb-4 flex-grow"
                v-html="getPreviewText(newsItem.text)"
              ></div>

              <!-- Read More Button -->
              <div v-if="textExceedsLimit(newsItem.text)" class="mt-auto pt-2">
                <button
                  @click="openNewsDetail(newsItem)"
                  class="text-main-red hover:text-main-red-hover transition-colors duration-300 flex items-center text-sm font-medium"
                >
                  {{ $t("readMore") }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Pagination Controls -->
    <Transition
      enter-active-class="transition-opacity duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="pagination && pagination.totalPages > 1"
        class="flex justify-center items-center mt-10 relative p-[1px]"
      >
        <!-- Gradient border -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
        ></div>

        <!-- Content with background -->
        <div
          class="relative bg-[#0E0E0E] p-4 w-full flex justify-center items-center"
        >
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-4 py-2 border flex items-center transition-all duration-300 ease-in-out',
              currentPage === 1
                ? 'bg-black bg-opacity-30 text-main-gray-hover cursor-not-allowed border-white border-opacity-10'
                : 'bg-transparent text-white hover:border-main-red border-white border-opacity-30',
            ]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {{ $t("previous") }}
          </button>

          <div class="flex space-x-2 mx-4">
            <TransitionGroup
              tag="div"
              class="flex space-x-2"
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 transform scale-50"
              enter-to-class="opacity-100 transform scale-100"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-50"
              move-class="transition-transform duration-300"
            >
              <button
                v-for="page in displayedPageNumbers"
                :key="page"
                @click="typeof page === 'number' ? changePage(page) : null"
                :class="[
                  'w-10 h-10 border flex items-center justify-center transition-all duration-300 ease-in-out',
                  typeof page === 'number'
                    ? page === currentPage
                      ? 'bg-main-red text-white border-main-red transform scale-110'
                      : 'bg-transparent text-white border-white border-opacity-30 hover:border-main-red'
                    : 'bg-transparent text-white border-none cursor-default',
                ]"
              >
                {{ page }}
              </button>
            </TransitionGroup>
          </div>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="pagination && currentPage === pagination.totalPages"
            :class="[
              'px-4 py-2 border flex items-center transition-all duration-300 ease-in-out',
              pagination && currentPage === pagination.totalPages
                ? 'bg-black bg-opacity-30 text-main-gray-hover cursor-not-allowed border-white border-opacity-10'
                : 'bg-transparent text-white hover:border-main-red border-white border-opacity-30',
            ]"
          >
            {{ $t("next") }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- No News State -->
    <Transition
      enter-active-class="transition-opacity duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="!loading && newsItems.length === 0" class="relative p-[1px]">
        <!-- Gradient border -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
        ></div>

        <!-- Content with background -->
        <div class="relative bg-[#0E0E0E] text-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-20 w-20 mx-auto text-main-gray-hover mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p class="text-xl text-white mb-4">{{ $t("noNewsAvailable") }}</p>
          <p class="text-main-gray-hover">{{ $t("checkBackLater") }}</p>
        </div>
      </div>
    </Transition>

    <!-- News modal component -->
    <NewsModal :news="selectedNews" @close="closeNewsDetail" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";

import { getPaginatedActiveNews } from "@/services/newsService";

import type { News, PaginationData } from "@/types/news";
import NewsModal from "@/components/general/NewsModal.vue";
import { useEventBus } from "@/utils/eventBus";

const TEXT_LIMIT = 250; // Increased limit for better previews
const ITEMS_PER_PAGE = 5; // Reduced to show fewer items per page for better viewing

const { t } = useI18n();
const newsItems = ref<News[]>([]);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref("");
const selectedNews = ref<News | null>(null);
const currentPage = ref(1);
const pagination = ref<PaginationData | null>(null);

// Event bus setup
const { on } = useEventBus();

const displayedPageNumbers = computed(() => {
  if (!pagination.value) return [];

  const totalPagesToShow = 5;
  const pages: (number | string)[] = [];
  const totalPages = pagination.value.totalPages;

  if (totalPages <= totalPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    let startPage = Math.max(2, currentPage.value - 1);
    let endPage = Math.min(totalPages - 1, currentPage.value + 1);

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
});

const fetchNews = async (page: number = 1) => {
  loading.value = true;
  error.value = false;

  try {
    const response = await getPaginatedActiveNews(page, ITEMS_PER_PAGE);

    if (response.success) {
      newsItems.value = response.news;
      pagination.value = response.pagination || null;
      currentPage.value = page;
    } else {
      throw new Error("Failed to fetch news");
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = t("errorFetchingNews");
    console.error("Error fetching news:", err);
  } finally {
    loading.value = false;
  }
};

const changePage = (page: number | string) => {
  if (
    typeof page === "number" &&
    pagination.value &&
    page >= 1 &&
    page <= pagination.value.totalPages
  ) {
    fetchNews(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const stripHtml = (html: string): string => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || "";
};

const textExceedsLimit = (text: string): boolean => {
  return stripHtml(text).length > TEXT_LIMIT;
};

const getPreviewText = (html: string): string => {
  // Always truncate HTML content for consistency
  const plainText = stripHtml(html);

  // Create a DOM element to manipulate the HTML
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  // If text is already short enough, just return it
  if (plainText.length <= TEXT_LIMIT) {
    return html;
  }

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

  // Truncate text
  let currentLength = 0;
  let truncated = false;

  for (const node of textNodes) {
    const text = node.textContent || "";
    if (currentLength + text.length > TEXT_LIMIT) {
      const remainingChars = TEXT_LIMIT - currentLength;
      const lastSpace = text.substring(0, remainingChars).lastIndexOf(" ");
      const cutPoint = lastSpace > 0 ? lastSpace : remainingChars;

      node.textContent = text.substring(0, cutPoint) + "...";
      truncated = true;

      // Find the nearest parent element that's a direct child of tempElement or its significant child
      let currentNode: Node | null = node;
      let foundContainer = false;

      while (currentNode && !foundContainer) {
        // Go up until we find a direct child of the temp element or a significant element (p, div, etc.)
        const parent: Node | null = currentNode.parentNode;
        if (!parent || parent === tempElement) {
          foundContainer = true;
        } else {
          // Keep nodes we've processed so far and remove siblings
          const nodeName = (parent as Element).nodeName.toLowerCase();
          if (
            nodeName === "p" ||
            nodeName === "div" ||
            nodeName === "h1" ||
            nodeName === "h2" ||
            nodeName === "h3" ||
            nodeName === "h4" ||
            nodeName === "h5" ||
            nodeName === "h6" ||
            nodeName === "li"
          ) {
            foundContainer = true;
          }
        }
        currentNode = parent;
      }

      // Remove all siblings that come after current node
      if (currentNode && currentNode.parentNode) {
        const parent = currentNode.parentNode;
        let nextSibling = currentNode.nextSibling;

        while (nextSibling) {
          const siblingToRemove = nextSibling;
          nextSibling = nextSibling.nextSibling;
          parent.removeChild(siblingToRemove);
        }
      }

      break;
    }
    currentLength += text.length;
  }

  return tempElement.innerHTML;
};

const openNewsDetail = (news: News) => {
  selectedNews.value = news;
};

const closeNewsDetail = () => {
  selectedNews.value = null;
};

const refreshNews = () => {
  currentPage.value = 1;
  fetchNews(1);
};

onMounted(() => {
  fetchNews(1);
  on("language-changed", refreshNews);
});
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Make sure each item animates independently */
.list-move {
  transition: transform 0.5s ease;
}
</style>
