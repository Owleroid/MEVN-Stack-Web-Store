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
  console.log(categoryId);
  return storeService.get(`/products/category/${categoryId}`);
};

export default storeService;
