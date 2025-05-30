import mongoose, { Document } from "mongoose";

export interface NewsDocument extends Document {
  _id: string;
  title: string;
  text: string;
  imageUrl?: string;
  language: string; // 'en' or 'ru'
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    imageUrl: { type: String, required: false },
    language: {
      type: String,
      enum: ["en", "ru"],
      default: "en",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const News = mongoose.model<NewsDocument>("News", newsSchema);
export default News;
