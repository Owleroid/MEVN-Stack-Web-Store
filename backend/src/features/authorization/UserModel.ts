import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  name?: string;
  surname?: string;
  phone?: string;
  registrationDate: Date;
  deliveryData?: {
    country?: string;
    city?: string;
    street?: string;
    buildingNumber?: string;
    apartment?: string;
    postalCode?: string;
  };
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    required: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  name: { type: String, required: false },
  surname: { type: String, required: false },
  phone: { type: String, required: false },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  deliveryData: {
    country: { type: String, required: false },
    city: { type: String, required: false },
    street: { type: String, required: false },
    buildingNumber: { type: String, required: false },
    apartment: { type: String, required: false },
    postalCode: { type: String, required: false },
  },
});

userSchema.pre<UserDocument>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
