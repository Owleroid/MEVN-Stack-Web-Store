import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const categoryService = axios.create({
  baseURL: `${apiUrl}/api/admin`,
  withCredentials: true,
});

export const getAllCategories = async () => {
  return categoryService.get("/categories");
};

export const getCategory = async (id: string) => {
  return categoryService.get(`/category/${id}`);
};

export const deleteCategory = async (id: string) => {
  return categoryService.delete(`/delete-category/${id}`);
};

export const createCategory = async (category: { name: string }) => {
  return categoryService.post("/add-category", category);
};

export const updateCategory = async (
  id: string,
  category: { name: string }
) => {
  return categoryService.put(`/update-category/${id}`, category);
};

export default categoryService;
