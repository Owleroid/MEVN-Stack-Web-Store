/**
 * Interface representing image information
 */
export interface ImageInfo {
  /** Filename of the image */
  name: string;
  /** Complete URL to access the image */
  url: string;
}

/**
 * Response from image fetching operation
 */
export interface ImageListResponse {
  /** Operation success status */
  success: boolean;
  /** Response message */
  message: string;
  /** Array of image information */
  images: ImageInfo[];
}

/**
 * Response from image upload operation
 */
export interface ImageUploadResponse {
  /** Operation success status */
  success: boolean;
  /** Response message */
  message: string;
  /** Array of uploaded image information */
  images: ImageInfo[];
}

/**
 * Response from image deletion operation
 */
export interface ImageDeleteResponse {
  /** Operation success status */
  success: boolean;
  /** Response message */
  message: string;
  /** Array of deleted image names */
  deletedImages: string[];
}
