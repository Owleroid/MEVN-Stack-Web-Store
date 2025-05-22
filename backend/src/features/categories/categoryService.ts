import mongoose from "mongoose";

import Category from "./CategoryModel.js";

import { removeProductFromWarehouses } from "../warehouses/warehouseService.js";

/**
 * Gets all categories
 * @returns {Promise<Array>} All categories
 */
export const getAllCategories = async (): Promise<any[]> => {
  return Category.find();
};

/**
 * Searches for categories by name or slug
 * @param {string} query - The search query
 * @returns {Promise<Array>} Matching categories
 */
export const searchCategories = async (query: string): Promise<any[]> => {
  return Category.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { slug: { $regex: query, $options: "i" } },
    ],
  }).select("_id name");
};

/**
 * Gets a category by ID
 * @param {string} id - The category ID
 * @returns {Promise<Object|null>} The category or null if not found
 */
export const getCategoryById = async (
  id: string | mongoose.Types.ObjectId
): Promise<any | null> => {
  return Category.findById(id);
};

/**
 * Gets a category by slug
 * @param {string} slug - The category slug
 * @returns {Promise<Object|null>} The category or null if not found
 */
export const getCategoryBySlug = async (slug: string): Promise<any | null> => {
  return Category.findOne({ slug });
};

/**
 * Checks if a category with the given name exists
 * @param {string} name - The category name to check
 * @returns {Promise<boolean>} True if a category with the name exists
 */
export const checkCategoryNameExists = async (
  name: string
): Promise<boolean> => {
  const category = await Category.findOne({ name });
  return !!category;
};

/**
 * Checks if a category with the given slug exists (excluding a specific category)
 * @param {string} slug - The slug to check
 * @param {string} excludeCategoryId - Category ID to exclude from the check
 * @returns {Promise<boolean>} True if a category with the slug exists
 */
export const checkCategorySlugExists = async (
  slug: string,
  excludeCategoryId?: string
): Promise<boolean> => {
  const query = excludeCategoryId
    ? { slug, _id: { $ne: excludeCategoryId } }
    : { slug };

  const category = await Category.findOne(query);
  return !!category;
};

/**
 * Creates a new category
 * @param {Object} categoryData - The category data
 * @returns {Promise<Object>} The created category
 */
export const createCategory = async (categoryData: {
  name: string;
  imageUrl?: string;
  slug?: string;
}): Promise<any> => {
  const newCategory = new Category(categoryData);
  return newCategory.save();
};

/**
 * Updates a category
 * @param {string} id - The category ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object|null>} The updated category or null if not found
 */
export const updateCategory = async (
  id: string | mongoose.Types.ObjectId,
  updateData: {
    name?: string;
    imageUrl?: string;
    slug?: string;
  }
): Promise<any | null> => {
  return Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Deletes a category and its products
 * @param {string} id - The category ID
 * @param {mongoose.ClientSession} session - Mongoose session for transaction
 * @returns {Promise<Object|null>} The deleted category or null if not found
 */
export const deleteCategory = async (
  id: string | mongoose.Types.ObjectId,
  session?: mongoose.ClientSession
): Promise<any | null> => {
  const options = session ? { session } : {};

  const deletedCategory = await Category.findByIdAndDelete(id, options);

  if (!deletedCategory) {
    return null;
  }

  // Import a local copy of Product for the operation
  const Product = (await import("../products/ProductModel.js")).default;

  const products = await Product.find({ category: id }, null, options);

  for (const product of products) {
    await removeProductFromWarehouses(product._id, session);
  }

  await Product.deleteMany({ category: id }, options);

  return deletedCategory;
};

/**
 * Deletes a category and reassigns its products to another category
 * @param {string} id - The category ID to delete
 * @param {string} newCategoryId - The category ID to reassign products to
 * @param {mongoose.ClientSession} session - Mongoose session for transaction
 * @returns {Promise<Object|null>} The deleted category or null if not found
 */
export const deleteCategoryAndReassignProducts = async (
  id: string | mongoose.Types.ObjectId,
  newCategoryId: string | mongoose.Types.ObjectId,
  session?: mongoose.ClientSession
): Promise<any | null> => {
  const options = session ? { session } : {};

  const deletedCategory = await Category.findByIdAndDelete(id, options);

  if (!deletedCategory) {
    return null;
  }

  const Product = (await import("../products/ProductModel.js")).default;

  await Product.updateMany(
    { category: id },
    { category: newCategoryId },
    options
  );

  return deletedCategory;
};
