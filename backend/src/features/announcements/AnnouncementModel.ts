import mongoose, { Document } from "mongoose";

export interface AnnouncementDocument extends Document {
  _id: string;
  product: mongoose.Types.ObjectId;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Announcement = mongoose.model<AnnouncementDocument>(
  "Announcement",
  announcementSchema
);
export default Announcement;
