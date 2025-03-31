import mongoose, { Document } from "mongoose";

export interface Category extends Document {
  name: string;
  imageUrl: string;
}

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true, unique: true },
});

export default mongoose.model<Category>("Category", categorySchema);
