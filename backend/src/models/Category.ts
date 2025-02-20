import mongoose, { Document } from "mongoose";

export interface Category extends Document {
  name: string;
}

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.model<Category>("Category", categorySchema);
