import axios from "axios";
import type { AxiosResponse } from "axios";

import type { Warehouse, ProductUpdateData } from "@/types/warehouse";

const apiUrl = import.meta.env.VITE_API_URL;

const warehouseService = axios.create({
  baseURL: `${apiUrl}/api/warehouses`,
  withCredentials: true,
});

/**
 * Retrieves all warehouses
 * @returns Promise resolving to array of warehouses
 */
export const getWarehouses = async (): Promise<Warehouse[]> => {
  const response: AxiosResponse<Warehouse[]> = await warehouseService.get("/");
  return response.data;
};

/**
 * Retrieves a specific warehouse by ID
 * @param warehouseId - ID of the warehouse to fetch
 * @returns Promise resolving to warehouse data
 */
export const getWarehouseById = async (
  warehouseId: string
): Promise<Warehouse> => {
  const response: AxiosResponse<Warehouse> = await warehouseService.get(
    `/${warehouseId}`
  );
  return response.data;
};

/**
 * Updates the quantity of a product in a warehouse
 * @param warehouseId - ID of the warehouse to update
 * @param data - Product ID and new quantity
 * @returns Promise resolving when update is complete
 */
export const updateWarehouseProductAmount = async (
  warehouseId: string,
  data: ProductUpdateData
): Promise<void> => {
  await warehouseService.put(`/${warehouseId}`, data);
};

/**
 * Updates warehouse information
 * @param warehouseId - ID of the warehouse to update
 * @param data - Partial warehouse data to update
 * @returns Promise resolving to updated warehouse
 */
export const updateWarehouse = async (
  warehouseId: string,
  data: Partial<Warehouse>
): Promise<Warehouse> => {
  const response: AxiosResponse<Warehouse> = await warehouseService.put(
    `/${warehouseId}`,
    data
  );
  return response.data;
};

export default warehouseService;
