export interface Product {
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

export interface OrderData {
  userId: string | null;
  products: Product[];
  totalPrice: number;
  currency: "rubles" | "euros";
  warehouse?: string;
  shippingAddress?: Address;
  recipient?: Recipient;
  status:
    | "waiting confirmation"
    | "packing"
    | "sended"
    | "delivered"
    | "canceled";
  checked: boolean;
  paymentMethod?: string;
  orderNotes?: string;
  trackingNumber?: string;
}

export interface Order extends OrderData {
  _id: string;
  orderNumber: string;
  dateOfCreation: string;
}
