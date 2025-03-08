import mongoose, { Document } from "mongoose";

interface CurrencyDetails {
  amount: number;
  discount?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
}

export interface Product extends Document {
  _id: string;
  title: string;
  category: mongoose.Types.ObjectId;
  price: {
    rubles: CurrencyDetails;
    euros: CurrencyDetails;
  };
  artist: string;
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

const currencyDetailsSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  discount: { type: Number, required: false },
  discountStartDate: { type: Date, required: false },
  discountEndDate: { type: Date, required: false },
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    rubles: { type: currencyDetailsSchema, required: true },
    euros: { type: currencyDetailsSchema, required: true },
  },
  artist: { type: String, required: false },
  size: { type: String, required: true },
  material: { type: String, required: true },
  parts: { type: String, required: false },
  boxArt: { type: String, required: true },
  description: { type: String, required: false },
  imageUrls: {
    main: { type: String, required: true },
    secondary: { type: [String], required: false },
  },
});

export default mongoose.model<Product>("Product", productSchema);
