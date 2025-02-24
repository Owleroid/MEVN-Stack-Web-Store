import axios from "axios";
import type { ProductInput } from "../types/products";

const apiUrl = import.meta.env.VITE_API_URL;

const productService = axios.create({
  baseURL: `${apiUrl}/api/admin`,
  withCredentials: true,
});

export const getProductsByCategory = async (categoryId: string) => {
  return productService.get(`/category/${categoryId}`);
};

export const getProduct = async (id: string) => {
  return productService.get(`/${id}`);
};

export const createProduct = async (product: ProductInput) => {
  return productService.post("/add-product", product);
};

export const updateProduct = async (id: string, product: ProductInput) => {
  return productService.put(`/edit-product/${id}`, product);
};

export const deleteProduct = async (id: string) => {
  return productService.delete(`/delete-product/${id}`);
};

export default productService;
