import axios from "axios";

import type { Warehouse } from "@/types/warehouse";

const apiUrl = import.meta.env.VITE_API_URL;

const warehouseService = axios.create({
  baseURL: `${apiUrl}/api/warehouses`,
  withCredentials: true,
});

export const getWarehouses = async (): Promise<Warehouse[]> => {
  const response = await warehouseService.get("/");
  return response.data;
};

export const updateWarehouseProductAmount = async (
  warehouseId: string,
  data: { productId: string; amount: number }
): Promise<void> => {
  await warehouseService.put(`/${warehouseId}`, data);
};

export const updateWarehouse = async (
  warehouseId: string,
  data: Partial<Warehouse>
): Promise<Warehouse> => {
  const response = await warehouseService.put(`/${warehouseId}`, data);
  return response.data;
};

export default warehouseService;
