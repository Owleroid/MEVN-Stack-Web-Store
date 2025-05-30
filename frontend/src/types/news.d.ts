export interface News {
  _id: string;
  title: string;
  text: string;
  imageUrl?: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsInput {
  title: string;
  text: string;
  imageUrl?: string;
  language: string;
}

export interface UpdateNewsStatus {
  isActive: boolean;
}

export interface UpdateNewsInput {
  title?: string;
  text?: string;
  imageUrl?: string;
  language?: string;
  isActive?: boolean;
}

export interface PaginationData {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface NewsListResponse {
  success: boolean;
  news: News[];
  pagination?: PaginationData;
}

export interface NewsResponse {
  success: boolean;
  news: News;
}

export interface NewsActionResponse {
  success: boolean;
  message?: string;
}
