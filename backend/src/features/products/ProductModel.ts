import mongoose, { Document, Model } from "mongoose";

export interface CurrencyDetails {
  amount: number;
  discount?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
}

export interface ProductDocument extends Document {
  _id: string;
  name: string;
  slug: string; // Added slug field
  category: mongoose.Types.ObjectId;
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

const currencyDetailsSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  discount: { type: Number, required: false },
  discountStartDate: { type: Date, required: false },
  discountEndDate: { type: Date, required: false },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
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

// Pre-save middleware to generate slug from name if not provided
productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

// Pre-update middleware to generate slug if name is changed but no slug is provided
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;

  // Only generate a slug if name is being updated AND no slug is provided
  if (update && update.name && update.slug === undefined) {
    update.slug = update.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

const Product = mongoose.model<ProductDocument>("Product", productSchema);
export default Product;
