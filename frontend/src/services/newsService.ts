import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  NewsInput,
  UpdateNewsStatus,
  UpdateNewsInput,
  NewsListResponse,
  NewsResponse,
  NewsActionResponse,
} from "@/types/news";

const apiUrl = import.meta.env.VITE_API_URL;

const newsService = axios.create({
  baseURL: `${apiUrl}/api/news`,
  withCredentials: true,
});

// Helper to get current language from session
const getCurrentLanguage = (): string => {
  return sessionStorage.getItem("language") || "en";
};

// ------------------------------------------------
// PUBLIC ENDPOINTS - No authentication required
// ------------------------------------------------

/**
 * Retrieves all active news items for public display
 * @returns Promise resolving to list of active news items
 * @deprecated Use getPaginatedActiveNews instead for better performance with large datasets
 */
export const getActiveNews = async (): Promise<NewsListResponse> => {
  const language = getCurrentLanguage();
  const response: AxiosResponse<NewsListResponse> = await newsService.get(
    "/active",
    {
      params: { language },
    }
  );
  return response.data;
};

/**
 * Retrieves paginated active news items for public display
 * @param page - The page number to retrieve (default: 1)
 * @param limit - The number of items per page (default: 10)
 * @returns Promise resolving to paginated list of active news items
 */
export const getPaginatedActiveNews = async (
  page: number = 1,
  limit: number = 10
): Promise<NewsListResponse> => {
  const language = getCurrentLanguage();
  const response: AxiosResponse<NewsListResponse> = await newsService.get(
    "/active/paginated",
    {
      params: { page, limit, language },
    }
  );
  return response.data;
};

/**
 * Retrieves a specific news item by ID
 * @param id - The ID of the news item to fetch
 * @returns Promise resolving to the news item data
 */
export const getNewsById = async (id: string): Promise<NewsResponse> => {
  const response: AxiosResponse<NewsResponse> = await newsService.get(`/${id}`);
  return response.data;
};

// ------------------------------------------------
// ADMIN ENDPOINTS - Require admin authentication
// ------------------------------------------------

/**
 * Retrieves all news items (active and inactive) for admin
 * @param language - Optional language filter (if not provided, returns news in all languages)
 * @returns Promise resolving to list of all news items
 */
export const getAllNews = async (
  language?: string
): Promise<NewsListResponse> => {
  const params = language ? { language } : {};
  const response: AxiosResponse<NewsListResponse> = await newsService.get("/", {
    params,
  });
  return response.data;
};

/**
 * Creates a new news item
 * @param newsData - The news data to create
 * @returns Promise resolving to creation result
 */
export const createNews = async (
  newsData: NewsInput
): Promise<NewsResponse> => {
  // If language is not specified, use current language
  if (!newsData.language) {
    newsData.language = getCurrentLanguage();
  }

  const response: AxiosResponse<NewsResponse> = await newsService.post(
    "/",
    newsData
  );
  return response.data;
};

/**
 * Updates a news item
 * @param id - The ID of the news item to update
 * @param newsData - The updated news data
 * @returns Promise resolving to update result
 */
export const updateNews = async (
  id: string,
  newsData: UpdateNewsInput
): Promise<NewsResponse> => {
  const response: AxiosResponse<NewsResponse> = await newsService.put(
    `/${id}`,
    newsData
  );
  return response.data;
};

/**
 * Updates a news item's active status
 * @param id - The ID of the news item to update
 * @param statusData - The updated status data (active/inactive)
 * @returns Promise resolving to update result
 */
export const updateNewsStatus = async (
  id: string,
  statusData: UpdateNewsStatus
): Promise<NewsResponse> => {
  const response: AxiosResponse<NewsResponse> = await newsService.post(
    `/${id}/status`,
    statusData
  );
  return response.data;
};

/**
 * Deletes a news item
 * @param id - The ID of the news item to delete
 * @returns Promise resolving to deletion result
 */
export const deleteNews = async (id: string): Promise<NewsActionResponse> => {
  const response: AxiosResponse<NewsActionResponse> = await newsService.delete(
    `/${id}`
  );
  return response.data;
};

export default newsService;
