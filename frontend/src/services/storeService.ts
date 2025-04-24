import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const storeService = axios.create({
  baseURL: `${apiUrl}/api/store`,
  withCredentials: true,
});

export const getAllCategories = async () => {
  return storeService.get(`/categories`);
};

export const getProductsByCategoryId = async (categoryId: string) => {
  return storeService.get(`/categories/${categoryId}/products`);
};

export default storeService;
