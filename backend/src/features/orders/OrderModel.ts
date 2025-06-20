import mongoose, { Schema, Document } from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 6);

export interface OrderProduct {
  productId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  productPrice: number;
  discount?: {
    originalPrice: number;
    discountAmount: number;
    discountName: string;
    discountId: mongoose.Types.ObjectId;
    discountPercentage: number;
  };
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

export interface OrderDocument extends Document {
  _id: string;
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  products: OrderProduct[];
  totalPrice: number;
  currency: "rubles" | "euros";
  warehouse?: mongoose.Types.ObjectId;
  dateOfCreation: Date;
  status:
    | "waiting confirmation"
    | "packing"
    | "sended"
    | "delivered"
    | "canceled";
  checked: boolean;
  shippingAddress?: Address;
  recipient: Recipient;
  paymentMethod?: string;
  orderNotes?: string;
  trackingNumber?: string;
}

const ProductSchema: Schema = new Schema({
  productId: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  productPrice: { type: Number, required: true },
  discount: {
    type: {
      originalPrice: { type: Number, required: true },
      discountAmount: { type: Number, required: true },
      discountName: { type: String, required: true },
      discountId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Discount",
      },
      discountPercentage: { type: Number, required: true },
    },
    required: false,
  },
});

const AddressSchema: Schema = new Schema({
  street: { type: String, required: true },
  buildingNumber: { type: String, required: true },
  apartment: { type: String, required: false },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const RecipientSchema: Schema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, unique: true },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  products: { type: [ProductSchema], required: true },
  totalPrice: { type: Number, required: true },
  currency: { type: String, enum: ["rubles", "euros"], required: true },
  warehouse: {
    type: mongoose.Types.ObjectId,
    ref: "Warehouse",
    required: false,
  },
  dateOfCreation: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: [
      "waiting confirmation",
      "packing",
      "sended",
      "delivered",
      "canceled",
    ],
    default: "waiting confirmation",
  },
  checked: { type: Boolean, default: false },
  shippingAddress: { type: AddressSchema, required: false },
  recipient: { type: RecipientSchema, required: true },
  paymentMethod: { type: String, required: false },
  orderNotes: { type: String, required: false },
  trackingNumber: { type: String, required: false },
});

OrderSchema.pre<OrderDocument>("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = nanoid();
  }
  next();
});

const Order = mongoose.model<OrderDocument>("Order", OrderSchema);
export default Order;
