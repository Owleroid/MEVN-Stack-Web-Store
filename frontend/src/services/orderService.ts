import axios from "axios";
import type { OrderData } from "../types/orders";

const apiUrl = import.meta.env.VITE_API_URL;

const ordersService = axios.create({
  baseURL: `${apiUrl}/api/orders`,
  withCredentials: true,
});

const adminOrdersService = axios.create({
  baseURL: `${apiUrl}/api/admin`,
  withCredentials: true,
});

export const createOrder = async (orderData: OrderData) => {
  return ordersService.post(`/create`, orderData);
};

export const getOrdersByUserId = async (userId: string) => {
  return ordersService.get(`/user/${userId}`);
};

export const getOrderById = async (orderId: string) => {
  return ordersService.get(`/${orderId}`);
};

// Admin api routes

export const getAllOrders = async () => {
  return adminOrdersService.get(`/orders`);
};

export const deleteOrderById = async (orderId: string) => {
  return adminOrdersService.delete(`/delete-order/${orderId}`);
};

export const editOrderById = async (
  orderId: string,
  updateData: Partial<OrderData>
) => {
  return adminOrdersService.put(`/edit-order/${orderId}`, updateData);
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
