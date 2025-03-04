import mongoose, { Document } from "mongoose";

export interface ProductAmount {
  product: mongoose.Types.ObjectId;
  name: string;
  amount: number;
}

export interface Warehouse extends Document {
  name: string;
  products: ProductAmount[];
}

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<Warehouse>("Warehouse", warehouseSchema);
