import axios from "axios";

import type { OrderData } from "../types/orders";

const apiUrl = import.meta.env.VITE_API_URL;

const ordersService = axios.create({
  baseURL: `${apiUrl}/api/orders`,
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
