/**
 * Interface for order product items
 */
export interface OrderProduct {
  productId: string;
  name: string;
  amount: number;
  productPrice: number;
}

/**
 * Interface for shipping/delivery address
 */
export interface Address {
  street: string;
  buildingNumber: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Interface for order recipient information
 */
export interface Recipient {
  name: string;
  surname: string;
  phone: string;
  email: string;
}

/**
 * Available order status options
 */
export type OrderStatus =
  | "waiting confirmation"
  | "packing"
  | "sended"
  | "delivered"
  | "canceled";

/**
 * Available currency options
 */
export type Currency = "rubles" | "euros";

/**
 * Interface for order data
 */
export interface OrderData {
  _id?: string;
  orderNumber?: string;
  userId?: string;
  products: OrderProduct[];
  totalPrice: number;
  currency: Currency;
  warehouse?: string;
  dateOfCreation?: Date;
  status: OrderStatus;
  checked: boolean;
  shippingAddress: Address;
  recipient: Recipient;
  paymentMethod?: string;
  orderNotes?: string;
  trackingNumber?: string;
}

/**
 * Response for retrieving a single order
 */
export interface OrderResponse {
  success: boolean;
  order: OrderData;
  message?: string;
}

/**
 * Response for retrieving multiple orders
 */
export interface OrdersListResponse {
  success: boolean;
  orders: OrderData[];
}

/**
 * Filter parameters for orders
 */
export interface OrderFilters {
  status?: OrderStatus;
  checked?: boolean;
  sortOrder?: "newest" | "oldest";
}
