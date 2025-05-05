/**
 * Represents a product with its quantity in a warehouse
 */
export interface ProductAmount {
  product: string;
  name: string;
  amount: number;
}

/**
 * Represents a warehouse with its product inventory
 */
export interface Warehouse {
  _id: string;
  name: string;
  products: ProductAmount[];
}

/**
 * Data for updating a product quantity in a warehouse
 */
export interface ProductUpdateData {
  productId: string;
  amount: number;
}
