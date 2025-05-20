export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
  slug: string;
}

export interface CategorySearchResult {
  _id: string;
  name: string;
}

export interface CategoryListResponse {
  success: boolean;
  categories: Category[];
}

export interface CategorySearchResponse {
  success: boolean;
  categories: CategorySearchResult[];
}

export interface CategoryResponse {
  success: boolean;
  category: Category;
}

export interface CategoryActionResponse {
  success: boolean;
  categoryId?: string;
}
