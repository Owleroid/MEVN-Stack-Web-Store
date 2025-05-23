import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  OrderData,
  ClientOrderData,
  OrderResponse,
  OrdersListResponse,
  OrderFilters,
} from "@/types/orders";

const apiUrl = import.meta.env.VITE_API_URL;

const ordersService = axios.create({
  baseURL: `${apiUrl}/api/orders`,
  withCredentials: true,
});

/**
 * Creates a new order
 * @param orderData - The client order data to create (without prices)
 * @returns Promise resolving to the created order with server-calculated prices
 */
export const createOrder = async (
  orderData: ClientOrderData
): Promise<OrderResponse> => {
  const response: AxiosResponse<OrderResponse> = await ordersService.post(
    "/",
    orderData
  );
  return response.data;
};

/**
 * Retrieves all orders for a specific user
 * @param userId - The ID of the user
 * @returns Promise resolving to the list of user orders
 */
export const getOrdersByUserId = async (
  userId: string
): Promise<OrdersListResponse> => {
  const response: AxiosResponse<OrdersListResponse> = await ordersService.get(
    `/user/${userId}`
  );
  return response.data;
};

/**
 * Retrieves a specific order by ID
 * @param orderId - The ID of the order to fetch
 * @returns Promise resolving to the order data
 */
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const response: AxiosResponse<OrderResponse> = await ordersService.get(
    `/${orderId}`
  );
  return response.data;
};

// Admin API routes

/**
 * Retrieves all orders (admin only)
 * @returns Promise resolving to the list of all orders
 */
export const getAllOrders = async (): Promise<OrdersListResponse> => {
  const response: AxiosResponse<OrdersListResponse> = await ordersService.get(
    "/admin"
  );
  return response.data;
};

/**
 * Updates an existing order (admin only)
 * @param orderId - The ID of the order to update
 * @param updateData - The data to update
 * @returns Promise resolving to the updated order
 */
export const editOrderById = async (
  orderId: string,
  updateData: Partial<OrderData>
): Promise<OrderResponse> => {
  const response: AxiosResponse<OrderResponse> = await ordersService.put(
    `/admin/edit-order/${orderId}`,
    updateData
  );
  return response.data;
};

/**
 * Filters orders based on provided criteria (admin only)
 * @param filters - The filter criteria
 * @returns Promise resolving to the filtered list of orders
 */
export const filterOrders = async (
  filters: OrderFilters
): Promise<OrdersListResponse> => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.checked !== undefined)
    params.append("checked", filters.checked.toString());
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const response: AxiosResponse<OrdersListResponse> = await ordersService.get(
    "/admin/filter-orders",
    { params }
  );
  return response.data;
};

export default ordersService;
