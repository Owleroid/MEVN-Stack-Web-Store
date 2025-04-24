import axios from "axios";

import type { ProductInput } from "@/types/products";

const apiUrl = import.meta.env.VITE_API_URL;

const productService = axios.create({
  baseURL: `${apiUrl}/api/products`,
  withCredentials: true,
});

export const getProductsByCategory = async (categoryId: string) => {
  return productService.get(`/category/${categoryId}`);
};

export const getProductIdsByCategory = async (categoryId: string) => {
  return productService.get(`/category/${categoryId}/ids`);
};

export const getProductById = async (id: string) => {
  return productService.get(`/${id}`);
};

export const searchProductsByName = async (name: string) => {
  return productService.get(`/search/${name}`);
};

export const addProduct = async (product: ProductInput) => {
  return productService.post("/", product);
};

export const updateProduct = async (id: string, product: ProductInput) => {
  return productService.put(`/${id}`, product);
};

export const updateProductCategory = async (id: string, categoryId: string) => {
  return productService.put(`/${id}/category`, { categoryId });
};

export const deleteProduct = async (id: string) => {
  return productService.delete(`/${id}`);
};

export default productService;
