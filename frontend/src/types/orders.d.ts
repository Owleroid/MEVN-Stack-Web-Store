export interface OrderProduct {
  productId: string;
  name: string;
  amount: number;
  productPrice: number;
}

export interface Address {
  street: string;
  buildingNumber: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Recipient {
  name: string;
  surname: string;
  phone: string;
  email: string;
}

export type OrderStatus =
  | "waiting confirmation"
  | "packing"
  | "sended"
  | "delivered"
  | "canceled";
export type Currency = "rubles" | "euros";

export interface OrderData {
  _id?: string;
  orderNumber?: string;
  userId?: string;
  products: OrderProduct[];
  totalPrice: number;
  currency: Currency;
  warehouse?:
    | string
    | {
        _id: string;
        name: string;
      };
  dateOfCreation?: Date;
  status: OrderStatus;
  checked: boolean;
  shippingAddress: Address;
  recipient: Recipient;
  paymentMethod?: string;
  orderNotes?: string;
  trackingNumber?: string;
}

export interface OrderResponse {
  success: boolean;
  order: OrderData;
  message?: string;
}

export interface OrdersListResponse {
  success: boolean;
  orders: OrderData[];
}

export interface OrderFilters {
  status?: OrderStatus;
  checked?: boolean;
  sortOrder?: "newest" | "oldest";
}
