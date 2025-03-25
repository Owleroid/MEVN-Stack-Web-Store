import axios from "axios";

import type { Warehouse } from "@/types/warehouse";

const apiUrl = import.meta.env.VITE_API_URL;

const warehouseService = axios.create({
  baseURL: `${apiUrl}/api/admin`,
  withCredentials: true,
});

export const getWarehouses = async (): Promise<Warehouse[]> => {
  const response = await warehouseService.get("/warehouses");
  return response.data;
};

export const addWarehouse = async (name: string): Promise<Warehouse> => {
  const response = await warehouseService.post("/add-warehouse", { name });
  return response.data;
};

export const deleteWarehouse = async (warehouseId: string): Promise<void> => {
  await warehouseService.delete(`/delete-warehouse/${warehouseId}`);
};

export const updateWarehouseProductAmount = async (
  warehouseId: string,
  data: { productId: string; amount: number }
): Promise<void> => {
  await warehouseService.put(`/update-warehouse/${warehouseId}`, data);
};

export const updateWarehouse = async (
  warehouseId: string,
  data: Partial<Warehouse>
): Promise<Warehouse> => {
  const response = await warehouseService.put(
    `/warehouses/${warehouseId}`,
    data
  );
  return response.data;
};

export default warehouseService;
