import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const imageService = axios.create({
  baseURL: `${apiUrl}/api/image-manager`,
  withCredentials: true,
});

export const fetchImages = async () => {
  try {
    const response = await imageService.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw new Error("Failed to fetch images.");
  }
};

export const uploadImages = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await imageService.post("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload images.");
  }
};

export const deleteImages = async (imageNames: string[]) => {
  try {
    const response = await imageService.delete("/", {
      data: { imageNames },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting images:", error);
    throw new Error("Failed to delete images.");
  }
};
