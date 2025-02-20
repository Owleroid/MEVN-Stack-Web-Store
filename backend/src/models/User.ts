import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface User extends Document {
  _id: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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
});

userSchema.pre<User>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.model<User>("User", userSchema);
