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

/**
 * Retrieves products by category ID
 * @param categoryId - The ID of the category to fetch products for
 * @returns Promise resolving to list of products in the category
 */
export const getProductsByCategory = async (
  categoryId: string
): Promise<ProductListResponse> => {
  const response: AxiosResponse<ProductListResponse> = await productService.get(
    `/category/${categoryId}`
  );
  return response.data;
};

/**
 * Retrieves only product IDs for a specific category
 * @param categoryId - The ID of the category to fetch product IDs for
 * @returns Promise resolving to list of product IDs in the category
 */
export const getProductIdsByCategory = async (
  categoryId: string
): Promise<ProductIdsResponse> => {
  const response: AxiosResponse<ProductIdsResponse> = await productService.get(
    `/category/${categoryId}/ids`
  );
  return response.data;
};

/**
 * Retrieves a specific product by ID
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
 * Searches for products by name (partial match)
 * @param name - The search query for product names
 * @returns Promise resolving to list of matching products
 */
export const searchProductsByName = async (
  name: string
): Promise<ProductListResponse> => {
  const response: AxiosResponse<ProductListResponse> = await productService.get(
    `/search/${name}`
  );
  return response.data;
};

/**
 * Creates a new product
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
 * Updates an existing product
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
 * Updates only the category of a product
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
 * Deletes a product
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

export default productService;
