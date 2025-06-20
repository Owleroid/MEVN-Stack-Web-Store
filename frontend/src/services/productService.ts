import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  ProductInput,
  ProductListResponse,
  ProductResponse,
  ProductIdsResponse,
  ProductActionResponse,
} from "@/types/products";

const apiUrl = import.meta.env.VITE_API_URL;

const productService = axios.create({
  baseURL: `${apiUrl}/api/products`,
  withCredentials: true,
});

// ------------------------------------------------
// PUBLIC ENDPOINTS - No authentication required
// ------------------------------------------------

/**
 * Retrieves products by category ID (PUBLIC)
 * @param categoryId - The ID of the category to fetch products for
 * @returns Promise resolving to list of products in the category
 */
export const getProductsByCategoryId = async (
  categoryId: string
): Promise<ProductListResponse> => {
  const response: AxiosResponse<ProductListResponse> = await productService.get(
    `/category/${categoryId}`
  );
  return response.data;
};

/**
 * Retrieves only product IDs for a specific category (PUBLIC)
 * @param categoryId - The ID of the category to fetch product IDs for
 * @returns Promise resolving to list of product IDs in the category
 */
export const getProductIdsByCategoryId = async (
  categoryId: string
): Promise<ProductIdsResponse> => {
  const response: AxiosResponse<ProductIdsResponse> = await productService.get(
    `/category/${categoryId}/ids`
  );
  return response.data;
};

/**
 * Retrieves a specific product by ID (PUBLIC)
 * @param id - The ID of the product to fetch
 * @returns Promise resolving to the product data
 */
export const getProductById = async (id: string): Promise<ProductResponse> => {
  const response: AxiosResponse<ProductResponse> = await productService.get(
    `/${id}`
  );
  return response.data;
};

/**
 * Retrieves a specific product by slug (PUBLIC)
 * @param slug - The slug of the product to fetch
 * @param categorySlug - Optional category slug to validate correct product-category relationship
 * @returns Promise resolving to the product data with potential redirection info
 */
export const getProductBySlug = async (
  slug: string,
  categorySlug?: string
): Promise<ProductResponse> => {
  const response: AxiosResponse<ProductResponse> = await productService.get(
    `/slug/${slug}${categorySlug ? `?categorySlug=${categorySlug}` : ""}`
  );
  return response.data;
};

/**
 * Searches for products by name, slug, or product number (partial match) (PUBLIC)
 * @param query - The search query for product names, slugs, or product numbers
 * @returns Promise resolving to list of matching products
 */
export const searchProducts = async (
  query: string
): Promise<ProductListResponse> => {
  const response: AxiosResponse<ProductListResponse> = await productService.get(
    `/search/${query}`
  );
  return response.data;
};

// ------------------------------------------------
// ADMIN ENDPOINTS - Require admin authentication
// ------------------------------------------------

/**
 * Creates a new product (ADMIN)
 * @param product - The product data to create
 * @returns Promise resolving to creation result
 */
export const addProduct = async (
  product: ProductInput
): Promise<ProductActionResponse> => {
  const response: AxiosResponse<ProductActionResponse> =
    await productService.post("/", product);
  return response.data;
};

/**
 * Updates an existing product (ADMIN)
 * @param id - The ID of the product to update
 * @param product - The updated product data
 * @returns Promise resolving to update result
 */
export const updateProduct = async (
  id: string,
  product: ProductInput
): Promise<ProductActionResponse> => {
  const response: AxiosResponse<ProductActionResponse> =
    await productService.put(`/${id}`, product);
  return response.data;
};

/**
 * Updates only the category of a product (ADMIN)
 * @param id - The ID of the product to update
 * @param categoryId - The new category ID
 * @returns Promise resolving to category update result
 */
export const updateProductCategory = async (
  id: string,
  categoryId: string
): Promise<ProductActionResponse> => {
  const response: AxiosResponse<ProductActionResponse> =
    await productService.put(`/${id}/category`, { categoryId });
  return response.data;
};

/**
 * Deletes a product (ADMIN)
 * @param id - The ID of the product to delete
 * @returns Promise resolving to deletion result
 */
export const deleteProduct = async (
  id: string
): Promise<ProductActionResponse> => {
  const response: AxiosResponse<ProductActionResponse> =
    await productService.delete(`/${id}`);
  return response.data;
};

/**
 * Retrieves products by an array of IDs (ADMIN)
 * @param ids - Array of product IDs to fetch
 * @returns Promise resolving to list of products with their IDs and names
 */
export const getProductsByIds = async (
  ids: string[]
): Promise<ProductListResponse> => {
  const response: AxiosResponse<ProductListResponse> =
    await productService.post("/byIds", { ids });
  return response.data;
};

export default productService;
