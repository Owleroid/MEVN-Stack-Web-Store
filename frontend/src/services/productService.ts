import axios from "axios";
import type { ProductInput } from "../types/products";

const apiUrl = import.meta.env.VITE_API_URL;

const productService = axios.create({
  baseURL: `${apiUrl}/api/admin`,
  withCredentials: true,
});

export const getProductsByCategory = async (categoryId: string) => {
  return productService.get(`/products/category/${categoryId}`);
};

export const getProductIdsByCategory = async (categoryId: string) => {
  return productService.get(`/products/category/${categoryId}/ids`);
};

export const getProductById = async (id: string) => {
  return productService.get(`/product/${id}`);
};

export const searchProductsByName = async (name: string) => {
  return productService.get(`/products/search/${name}`);
};

export const addProduct = async (product: ProductInput) => {
  return productService.post("/add-product", product);
};

export const updateProduct = async (id: string, product: ProductInput) => {
  return productService.put(`/edit-product/${id}`, product);
};

export const updateProductCategory = async (id: string, categoryId: string) => {
  return productService.put(`/edit-product-category/${id}`, { categoryId });
};

export const deleteProduct = async (id: string) => {
  return productService.delete(`/delete-product/${id}`);
};

export default productService;
