export interface Product {
  product: string;
  name: string;
  amount: number;
}

export interface Warehouse {
  _id?: string;
  name: string;
  products: Product[];
}
