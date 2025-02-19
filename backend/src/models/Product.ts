import mongoose, { Document, Schema } from "mongoose";

export interface Product extends Document {
  _id: string;
  title: string;
  category: string;
  price: number;
  artist: string;
  size: string;
  material: string;
  parts?: string;
  boxArt: string;
  amount: number;
  description?: string;
  imageUrls?: {
    main: string;
    secondary: string[];
  };
}

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  artist: { type: String, required: false },
  size: { type: String, required: true },
  material: { type: String, required: true },
  parts: { type: String, required: false },
  boxArt: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: false },
  imageUrls: {
    main: { type: String, required: false },
    secondary: { type: [String], required: false },
  },
});

export default mongoose.model<Product>("Product", productSchema);
