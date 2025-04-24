import axios from "axios";

import type { OrderData } from "@/types/orders";

const apiUrl = import.meta.env.VITE_API_URL;

const ordersService = axios.create({
  baseURL: `${apiUrl}/api/orders`,
  withCredentials: true,
});

export const createOrder = async (orderData: OrderData) => {
  return ordersService.post(`/`, orderData);
};

export const getOrdersByUserId = async (userId: string) => {
  return ordersService.get(`/user/${userId}`);
};

export const getOrderById = async (orderId: string) => {
  return ordersService.get(`/${orderId}`);
};

// Admin api routes

export const getAllOrders = async () => {
  return ordersService.get(`/admin`);
};

export const editOrderById = async (
  orderId: string,
  updateData: Partial<OrderData>
) => {
  return ordersService.put(`/admin/edit-order/${orderId}`, updateData);
};

// export const filterOrders = async (filters: {
//   status?: string;
//   checked?: boolean;
//   sortOrder?: string;
// }) => {
//   const params = new URLSearchParams();
//   if (filters.status) params.append("status", filters.status);
//   if (filters.checked !== undefined)
//     params.append("checked", filters.checked.toString());
//   if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
//   return adminOrdersService.get(`/admin/filter-orders`, { params });
// };
