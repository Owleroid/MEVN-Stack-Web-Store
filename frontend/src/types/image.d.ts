/**
 * Interface representing image information
 */
export interface ImageInfo {
  name: string;
  url: string;
  createdAt: string;
}

/**
 * Response from the API when fetching images
 */
export interface ImageListResponse {
  success: boolean;
  message: string;
  images: ImageInfo[];
}

/**
 * Response from the API when uploading images
 */
export interface ImageUploadResponse {
  success: boolean;
  message: string;
  images: ImageInfo[];
}

/**
 * Response from the API when deleting images
 */
export interface ImageDeleteResponse {
  success: boolean;
  message: string;
  deletedImages: string[];
}
