import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  ImageListResponse,
  ImageUploadResponse,
  ImageDeleteResponse,
} from "@/types/image";

const apiUrl = import.meta.env.VITE_API_URL;

const imageService = axios.create({
  baseURL: `${apiUrl}/api/image-manager`,
  withCredentials: true,
});

/**
 * Fetches all available images from the storage
 * @returns Promise resolving to the image list response
 */
export const fetchImages = async (): Promise<ImageListResponse> => {
  const response: AxiosResponse<ImageListResponse> = await imageService.get(
    "/"
  );
  return response.data;
};

/**
 * Uploads one or more image files to the storage
 * @param files - Array of File objects to upload
 * @returns Promise resolving to the upload response with image URLs
 */
export const uploadImages = async (
  files: File[]
): Promise<ImageUploadResponse> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response: AxiosResponse<ImageUploadResponse> = await imageService.post(
    "/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

/**
 * Deletes one or more images from the storage
 * @param imageNames - Array of image filenames to delete
 * @returns Promise resolving to the deletion response
 */
export const deleteImages = async (
  imageNames: string[]
): Promise<ImageDeleteResponse> => {
  const response: AxiosResponse<ImageDeleteResponse> =
    await imageService.delete("/", {
      data: { imageNames },
    });

  return response.data;
};

export default imageService;
