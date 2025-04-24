import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const categoryService = axios.create({
  baseURL: `${apiUrl}/api/categories`,
  withCredentials: true,
});

export const getAllCategories = async () => {
  return categoryService.get("/");
};

export const getCategory = async (id: string) => {
  return categoryService.get(`/${id}`);
};

export const deleteCategory = async (id: string) => {
  return categoryService.delete(`/${id}`);
};

export const deleteCategoryAndReassignProducts = async (
  id: string,
  newCategoryId: string
) => {
  return await categoryService.put(`/${id}/reassign`, {
    newCategoryId,
  });
};

export const createCategory = async (category: { name: string }) => {
  return categoryService.post("/", category);
};

export const updateCategory = async (
  id: string,
  category: { name: string }
) => {
  return categoryService.put(`/${id}`, category);
};

export default categoryService;
