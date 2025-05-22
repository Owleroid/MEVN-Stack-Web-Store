import mongoose, { Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  imageUrl: string;
  slug: string;
}

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
});

categorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

const Category = mongoose.model<CategoryDocument>("Category", categorySchema);
export default Category;
