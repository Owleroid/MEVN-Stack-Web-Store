import axios from "axios";
import type { AxiosResponse } from "axios";

import type { Category } from "@/types/category";
import type { Product } from "@/types/products";

const apiUrl = import.meta.env.VITE_API_URL;

const storeService = axios.create({
  baseURL: `${apiUrl}/api/store`,
  withCredentials: true,
});

/**
 * Retrieves all product categories
 * @returns Promise resolving to array of categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const response: AxiosResponse<Category[]> = await storeService.get(
    "/categories"
  );
  return response.data;
};

/**
 * Retrieves all products for a specific category
 * @param categoryId - ID of the category to fetch products for
 * @returns Promise resolving to array of products
 */
export const getProductsByCategoryId = async (
  categoryId: string
): Promise<Product[]> => {
  const response: AxiosResponse<Product[]> = await storeService.get(
    `/categories/${categoryId}/products`
  );
  return response.data;
};

/**
 * Retrieves a specific product by ID
 * @param productId - ID of the product to fetch
 * @returns Promise resolving to product data
 */
export const getProductById = async (productId: string): Promise<Product> => {
  const response: AxiosResponse<Product> = await storeService.get(
    `/products/${productId}`
  );
  return response.data;
};

export default storeService;
