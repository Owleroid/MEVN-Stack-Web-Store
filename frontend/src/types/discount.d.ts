export type DiscountScope = "all" | "categories" | "products";
export type Currency = "rubles" | "euros";

export interface Discount {
  _id: string;
  name: string;
  description?: string;
  scope: DiscountScope;
  targetModel?: "Category" | "Product";
  targetIds?: string[];
  discounts: {
    [key in Currency]: number;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountInput {
  name: string;
  description?: string;
  scope: DiscountScope;
  targetModel?: "Category" | "Product";
  targetIds?: string[];
  discounts: {
    [key in Currency]: number;
  };
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface DiscountListResponse {
  success: boolean;
  discounts: Discount[];
}

export interface DiscountResponse {
  success: boolean;
  discount: Discount;
}

export interface DiscountActionResponse {
  success: boolean;
  message?: string;
  discountId?: string;
  isActive?: boolean;
}
