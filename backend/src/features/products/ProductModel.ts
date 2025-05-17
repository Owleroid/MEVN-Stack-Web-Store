import mongoose, { Document } from "mongoose";
import { IDiscountPrice } from "../discount-manager/DiscountModel.js";

export interface CurrencyDetails {
  amount: number;
  currency: "RUB" | "EUR";
}

export interface ProductDocument extends Document {
  _id: string;
  name: string;
  slug: string;
  productNumber: string;
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
  getDiscountedPrice(currency: "RUB" | "EUR"): Promise<number>;
}

const currencyDetailsSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    currency: { type: String, required: true, enum: ["RUB", "EUR"] },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

currencyDetailsSchema.virtual("activeDiscount", {
  ref: "Discount",
  localField: "_id",
  foreignField: "products",
  justOne: true,
  match: {
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  },
  options: {
    select: "discountPrices startDate endDate",
  },
});

currencyDetailsSchema.methods.getDiscountedAmount = async function () {
  const parent = this.parent();
  if (!parent) return this.amount;

  const product = parent.ownerDocument();
  if (!product) return this.amount;

  await product.populate(
    `price.${this.currency === "RUB" ? "rubles" : "euros"}.activeDiscount`
  );
  const activeDiscount = this.activeDiscount;
  if (!activeDiscount) return this.amount;

  const discount = activeDiscount.discountPrices.find(
    (dp: IDiscountPrice) => dp.currency === this.currency
  );

  if (!discount) return this.amount;

  return this.amount * (1 - discount.percentage / 100);
};

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  productNumber: { type: String, required: true, unique: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    rubles: {
      type: currencyDetailsSchema,
      required: true,
      default: { currency: "RUB" },
    },
    euros: {
      type: currencyDetailsSchema,
      required: true,
      default: { currency: "EUR" },
    },
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

productSchema.methods.getDiscountedPrice = async function (
  currency: "RUB" | "EUR"
) {
  const priceField = currency === "RUB" ? "rubles" : "euros";
  await this.populate(`price.${priceField}.activeDiscount`);
  return this.price[priceField].getDiscountedAmount();
};

productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;

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
