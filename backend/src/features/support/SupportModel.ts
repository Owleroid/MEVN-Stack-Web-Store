import mongoose, { Document } from "mongoose";

export interface SupportDocument extends Document {
  email: string;
  message: string;
  subject?: string;
  status: "new" | "in-progress" | "resolved";
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const supportSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new",
    },
    response: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Support = mongoose.model<SupportDocument>("Support", supportSchema);
export default Support;
