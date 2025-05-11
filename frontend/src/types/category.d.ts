/**
 * Category interface from backend model
 */
export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
  slug: string;
}

/**
 * Response for category list operations
 */
export interface CategoryListResponse {
  success: boolean;
  categories: Category[];
}

/**
 * Response for single category operations
 */
export interface CategoryResponse {
  success: boolean;
  category: Category;
}

/**
 * Response for category operations that return success/message pattern
 */
export interface CategoryActionResponse {
  success: boolean;
  categoryId?: string;
}
