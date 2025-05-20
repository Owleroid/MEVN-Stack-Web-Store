import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  DiscountInput,
  DiscountListResponse,
  DiscountResponse,
  DiscountActionResponse,
} from "@/types/discount";

const apiUrl = import.meta.env.VITE_API_URL;

const discountService = axios.create({
  baseURL: `${apiUrl}/api/discounts`,
  withCredentials: true,
});

// ------------------------------------------------
// ADMIN ENDPOINTS - Require admin authentication
// ------------------------------------------------

/**
 * Retrieves all discounts (ADMIN ONLY)
 * @returns Promise resolving to list of all discounts
 */
export const getAllDiscounts = async (): Promise<DiscountListResponse> => {
  const response: AxiosResponse<DiscountListResponse> =
    await discountService.get("/");
  return response.data;
};

/**
 * Retrieves a specific discount by ID (ADMIN ONLY)
 * @param id - The ID of the discount to fetch
 * @returns Promise resolving to the discount data
 */
export const getDiscountById = async (
  id: string
): Promise<DiscountResponse> => {
  const response: AxiosResponse<DiscountResponse> = await discountService.get(
    `/${id}`
  );
  return response.data;
};

/**
 * Creates a new discount (ADMIN ONLY)
 * @param discount - The discount data to create
 * @returns Promise resolving to creation result
 */
export const createDiscount = async (
  discount: DiscountInput
): Promise<DiscountActionResponse> => {
  const response: AxiosResponse<DiscountActionResponse> =
    await discountService.post("/", discount);
  return response.data;
};

/**
 * Updates an existing discount (ADMIN ONLY)
 * @param id - The ID of the discount to update
 * @param discount - The updated discount data
 * @returns Promise resolving to update result
 */
export const updateDiscount = async (
  id: string,
  discount: DiscountInput
): Promise<DiscountActionResponse> => {
  const response: AxiosResponse<DiscountActionResponse> =
    await discountService.put(`/${id}`, discount);
  return response.data;
};

/**
 * Toggles the active status of a discount (ADMIN ONLY)
 * @param id - The ID of the discount to toggle status
 * @returns Promise resolving to toggle result
 */
export const toggleDiscountStatus = async (
  id: string
): Promise<DiscountActionResponse> => {
  const response: AxiosResponse<DiscountActionResponse> =
    await discountService.put(`/${id}/toggle`);
  return response.data;
};

/**
 * Deletes a discount (ADMIN ONLY)
 * @param id - The ID of the discount to delete
 * @returns Promise resolving to deletion result
 */
export const deleteDiscount = async (
  id: string
): Promise<DiscountActionResponse> => {
  const response: AxiosResponse<DiscountActionResponse> =
    await discountService.delete(`/${id}`);
  return response.data;
};

export default discountService;
