import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  CategoryListResponse,
  CategoryResponse,
  CategoryActionResponse,
  Category,
} from "@/types/category";

const apiUrl = import.meta.env.VITE_API_URL;

// Base service configuration
const categoryService = axios.create({
  baseURL: `${apiUrl}/api/categories`,
  withCredentials: true,
});

// ------------------------------------------------
// PUBLIC ENDPOINTS - No authentication required
// ------------------------------------------------

/**
 * Retrieves all categories (PUBLIC ACCESS)
 * @returns Promise resolving to all categories
 */
export const getAllCategories = async (): Promise<CategoryListResponse> => {
  const response: AxiosResponse<CategoryListResponse> =
    await categoryService.get("/");
  return response.data;
};

/**
 * Retrieves a specific category by ID (PUBLIC ACCESS)
 * @param id - The ID of the category to fetch
 * @returns Promise resolving to the category data
 */
export const getCategoryById = async (
  id: string
): Promise<CategoryResponse> => {
  const response: AxiosResponse<CategoryResponse> = await categoryService.get(
    `/${id}`
  );
  return response.data;
};

/**
 * Retrieves a specific category by slug (PUBLIC ACCESS)
 * @param slug - The slug of the category to fetch
 * @returns Promise resolving to the category data
 */
export const getCategoryBySlug = async (
  slug: string
): Promise<CategoryResponse> => {
  const response: AxiosResponse<CategoryResponse> = await categoryService.get(
    `/slug/${slug}`
  );
  return response.data;
};

// ------------------------------------------------
// ADMIN ENDPOINTS - Require authentication and admin privileges
// ------------------------------------------------

/**
 * Deletes a category and its associated products (ADMIN ONLY)
 * @param id - The ID of the category to delete
 * @returns Promise resolving to success status and message
 */
export const deleteCategory = async (
  id: string
): Promise<CategoryActionResponse> => {
  const response: AxiosResponse<CategoryActionResponse> =
    await categoryService.delete(`/${id}`);
  return response.data;
};

/**
 * Deletes a category and reassigns its products to another category (ADMIN ONLY)
 * @param id - The ID of the category to delete
 * @param newCategoryId - The ID of the category to reassign products to
 * @returns Promise resolving to success status and message
 */
export const deleteCategoryAndReassignProducts = async (
  id: string,
  newCategoryId: string
): Promise<CategoryActionResponse> => {
  const response: AxiosResponse<CategoryActionResponse> =
    await categoryService.put(`/${id}/reassign`, { newCategoryId });
  return response.data;
};

/**
 * Creates a new category (ADMIN ONLY)
 * @param category - Object containing category data
 * @returns Promise resolving to success status and new category ID
 */
export const createCategory = async (
  category: Pick<Category, "name" | "imageUrl" | "slug">
): Promise<CategoryActionResponse> => {
  const response: AxiosResponse<CategoryActionResponse> =
    await categoryService.post("/", category);
  return response.data;
};

/**
 * Updates an existing category (ADMIN ONLY)
 * @param id - The ID of the category to update
 * @param category - Object containing updated category data
 * @returns Promise resolving to success status and message
 */
export const updateCategory = async (
  id: string,
  category: Partial<Pick<Category, "name" | "imageUrl" | "slug">>
): Promise<CategoryActionResponse> => {
  const response: AxiosResponse<CategoryActionResponse> =
    await categoryService.put(`/${id}`, category);
  return response.data;
};

export default categoryService;
