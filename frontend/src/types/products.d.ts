/**
 * Currency details including base price and discount information
 */
export interface CurrencyDetails {
  amount: number;
  discount?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
}

/**
 * Complete product data structure from the database
 */
export interface Product {
  _id: string;
  name: string;
  category: string;
  price: {
    rubles: CurrencyDetails;
    euros: CurrencyDetails;
  };
  artist?: string;
  size: string;
  material: string;
  parts?: string;
  boxArt: string;
  description?: string;
  imageUrls: {
    main: string;
    secondary?: string[];
  };
}

/**
 * Input data structure for creating or updating products
 */
export interface ProductInput {
  name: string;
  category: string;
  price: {
    rubles: CurrencyDetails;
    euros: CurrencyDetails;
  };
  artist?: string;
  size: string;
  material: string;
  parts?: string;
  boxArt: string;
  description?: string;
  imageUrls: {
    main: string;
    secondary?: string[];
  };
}

/**
 * Response for product list operations
 */
export interface ProductListResponse {
  success: boolean;
  message: string;
  products: Product[];
}

/**
 * Response for single product operations
 */
export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

/**
 * Response for product ID list operations
 */
export interface ProductIdsResponse {
  success: boolean;
  message: string;
  productIds: string[];
}

/**
 * Response for product action operations (create, update, delete)
 */
export interface ProductActionResponse {
  success: boolean;
  message: string;
  productId?: string;
  category?: string;
}
