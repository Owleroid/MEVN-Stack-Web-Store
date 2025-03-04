export interface ProductAmount {
  product: string;
  amount: number;
}

// export interface WarehouseInput extends Document {
//   name: string;
//   products: ProductAmount[];
// }

export interface Warehouse extends WarehouseInput {
  _id?: string;
  name: string;
  products: [
    {
      product: string;
      name: string;
      amount: number;
    }
  ];
}
