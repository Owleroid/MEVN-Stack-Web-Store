<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-800">News & Updates</h1>
      <p class="text-gray-600 mt-2">
        Stay updated with our latest announcements and articles
      </p>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
      role="alert"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <div class="space-y-4" v-if="!loading && newsItems.length > 0">
      <div
        v-for="newsItem in newsItems"
        :key="newsItem._id"
        class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex flex-col sm:flex-row"
      >
        <div
          v-if="newsItem.imageUrl"
          class="sm:w-1/3 h-40 sm:h-auto overflow-hidden"
        >
          <img
            :src="newsItem.imageUrl"
            :alt="newsItem.title"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div class="p-4 sm:p-5 flex-1">
          <div class="flex flex-col h-full">
            <div>
              <h2 class="text-lg font-semibold text-gray-800 mb-1">
                {{ newsItem.title }}
              </h2>
              <p class="text-gray-600 text-xs mb-2">
                {{ formatDate(newsItem.createdAt) }}
              </p>
              <div
                class="text-gray-700 text-sm mb-3 overflow-hidden max-h-16 line-clamp-2 prose-sm prose"
                v-html="getPreviewText(newsItem.text)"
              ></div>
            </div>
            <div class="mt-auto" v-if="textExceedsLimit(newsItem.text)">
              <button
                @click="openNewsDetail(newsItem)"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
              >
                Read more
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="pagination && pagination.totalPages > 1"
        class="flex justify-center items-center mt-8 space-x-2"
      >
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md border border-gray-300 transition-colors duration-200"
          :class="
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          "
        >
          <span class="sr-only">Previous</span>
          &laquo;
        </button>

        <div class="flex space-x-1">
          <button
            v-for="page in displayedPageNumbers"
            :key="page"
            @click="changePage(page)"
            class="px-3 py-1 rounded-md transition-colors duration-200"
            :class="[
              typeof page === 'number'
                ? currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                : 'bg-white text-gray-500 border-none cursor-default',
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="pagination && currentPage === pagination.totalPages"
          class="px-3 py-1 rounded-md border border-gray-300 transition-colors duration-200"
          :class="
            pagination && currentPage === pagination.totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          "
        >
          <span class="sr-only">Next</span>
          &raquo;
        </button>
      </div>
    </div>

    <div v-if="!loading && newsItems.length === 0" class="text-center py-12">
      <h2 class="text-xl text-gray-700">
        No news articles available at the moment.
      </h2>
      <p class="text-gray-500 mt-2">Please check back later for updates.</p>
    </div>

    <!-- News modal component -->
    <NewsModal :news="selectedNews" @close="closeNewsDetail" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import { getPaginatedActiveNews } from "@/services/newsService";

import type { News, PaginationData } from "@/types/news";
import NewsModal from "@/components/general/NewsModal.vue";
import { useEventBus } from "@/utils/eventBus";

const TEXT_LIMIT = 180;
const ITEMS_PER_PAGE = 10;

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
    errorMessage.value =
      "An error occurred while fetching news. Please try again later.";
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
  const plainText = stripHtml(html);

  if (plainText.length <= TEXT_LIMIT) {
    return html;
  }

  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;

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

  for (const node of textNodes) {
    const text = node.textContent || "";
    if (currentLength + text.length > TEXT_LIMIT) {
      const remainingChars = TEXT_LIMIT - currentLength;
      const lastSpace = text.substring(0, remainingChars).lastIndexOf(" ");
      const cutPoint = lastSpace > 0 ? lastSpace : remainingChars;

      node.textContent = text.substring(0, cutPoint) + "...";
      truncated = true;
      break;
    }
    currentLength += text.length;
  }

  if (!truncated && textNodes.length > 0) {
    const lastNode = textNodes[textNodes.length - 1];
    lastNode.textContent = (lastNode.textContent || "") + "...";
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
