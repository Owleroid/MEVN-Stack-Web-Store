import mongoose from "mongoose";

import Product from "./ProductModel.js";

import {
  updateWarehousesWithNewProduct,
  removeProductFromWarehouses,
} from "../warehouses/warehouseService.js";

/**
 * Search for products by query string
 * @param {string} query - The search query
 * @returns {Promise<Array>} Matching products
 */
export const searchProducts = async (query: string): Promise<any[]> => {
  return Product.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { slug: { $regex: query, $options: "i" } },
      { productNumber: { $regex: query, $options: "i" } },
    ],
  });
};

/**
 * Get products by category ID
 * @param {string} categoryId - The category ID
 * @returns {Promise<Array>} Products in the category
 */
export const getProductsByCategoryId = async (
  categoryId: string | mongoose.Types.ObjectId
): Promise<any[]> => {
  return Product.find({ category: categoryId });
};

/**
 * Get product IDs by category ID
 * @param {string} categoryId - The category ID
 * @returns {Promise<Array<string>>} Product IDs in the category
 */
export const getProductIdsByCategoryId = async (
  categoryId: string | mongoose.Types.ObjectId
): Promise<string[]> => {
  const products = await Product.find({ category: categoryId }).select("_id");
  return products.map((product) => product._id.toString());
};

/**
 * Get a product by ID
 * @param {string} id - The product ID
 * @param {mongoose.ClientSession} [session] - Optional mongoose session
 * @returns {Promise<Object|null>} The product or null if not found
 */
export const getProductById = async (
  id: string | mongoose.Types.ObjectId,
  session?: mongoose.ClientSession
): Promise<any | null> => {
  const query = Product.findById(id);
  if (session) {
    return query.session(session).exec();
  }
  return query;
};

/**
 * Get a product by slug
 * @param {string} slug - The product slug
 * @returns {Promise<Object|null>} The product or null if not found
 */
export const getProductBySlug = async (slug: string): Promise<any | null> => {
  return Product.findOne({ slug });
};

/**
 * Get products by array of IDs
 * @param {Array<string>} ids - Array of product IDs
 * @returns {Promise<Array>} Matching products
 */
export const getProductsByIds = async (
  ids: string[] | mongoose.Types.ObjectId[]
): Promise<any[]> => {
  return Product.find({
    _id: { $in: ids },
  });
};

/**
 * Check if a product with the given name exists
 * @param {string} name - The product name
 * @param {mongoose.ClientSession} [session] - Optional mongoose session
 * @returns {Promise<boolean>} True if product exists
 */
export const checkProductNameExists = async (
  name: string,
  session?: mongoose.ClientSession
): Promise<boolean> => {
  const options = session ? { session } : {};
  const product = await Product.findOne({ name }, null, options);
  return !!product;
};

/**
 * Check if a product with the given slug exists
 * @param {string} slug - The product slug
 * @param {string} [excludeProductId] - Product ID to exclude from check
 * @param {mongoose.ClientSession} [session] - Optional mongoose session
 * @returns {Promise<boolean>} True if product exists
 */
export const checkProductSlugExists = async (
  slug: string,
  excludeProductId?: string,
  session?: mongoose.ClientSession
): Promise<boolean> => {
  const options = session ? { session } : {};
  const query = excludeProductId
    ? { slug, _id: { $ne: excludeProductId } }
    : { slug };

  const product = await Product.findOne(query, null, options);
  return !!product;
};

/**
 * Check if a product with the given product number exists
 * @param {string} productNumber - The product number
 * @param {mongoose.ClientSession} [session] - Optional mongoose session
 * @returns {Promise<boolean>} True if product exists
 */
export const checkProductNumberExists = async (
  productNumber: string,
  session?: mongoose.ClientSession
): Promise<boolean> => {
  const options = session ? { session } : {};
  const product = await Product.findOne({ productNumber }, null, options);
  return !!product;
};

/**
 * Create a new product
 * @param {Object} productData - The product data
 * @param {mongoose.ClientSession} [session] - Optional mongoose session
 * @returns {Promise<Object>} The created product
 */
export const createProduct = async (
  productData: {
    name: string;
    slug?: string;
    productNumber: string;
    category: mongoose.Types.ObjectId;
    price: {
      rubles: number;
      euros: number;
    };
    artist?: string;
    size: string;
    material: string;
    parts?: string;
    boxArt: string;
    description?: string;
    imageUrls: {
      main: string;
      secondary?: string[];
    };
  },
  session?: mongoose.ClientSession
): Promise<any> => {
  const options = session ? { session } : {};
  const newProduct = new Product(productData);
  const savedProduct = await newProduct.save(options);

  await updateWarehousesWithNewProduct(
    savedProduct._id,
    savedProduct.name,
    session
  );

  return savedProduct;
};

/**
 * Update a product
 * @param {string} id - The product ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated product or null if not found
 */
export const updateProduct = async (
  id: string | mongoose.Types.ObjectId,
  updateData: Partial<{
    name: string;
    slug: string;
    productNumber: string;
    category: mongoose.Types.ObjectId;
    price: {
      rubles: number;
      euros: number;
    };
    artist: string;
    size: string;
    material: string;
    parts: string;
    boxArt: string;
    description: string;
    imageUrls: {
      main: string;
      secondary: string[];
    };
  }>
): Promise<any | null> => {
  return Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Update a product's category
 * @param {string} id - The product ID
 * @param {string} categoryId - The new category ID
 * @returns {Promise<Object|null>} Updated product or null if not found
 */
export const updateProductCategory = async (
  id: string | mongoose.Types.ObjectId,
  categoryId: string | mongoose.Types.ObjectId
): Promise<any | null> => {
  return Product.findByIdAndUpdate(id, { category: categoryId }, { new: true });
};

/**
 * Delete a product
 * @param {string} id - The product ID
 * @param {mongoose.ClientSession} [session] - Optional mongoose session
 * @returns {Promise<Object|null>} Deleted product or null if not found
 */
export const deleteProduct = async (
  id: string | mongoose.Types.ObjectId,
  session?: mongoose.ClientSession
): Promise<any | null> => {
  const options = session ? { session } : {};
  const product = await Product.findByIdAndDelete(id, options);

  if (product) {
    await removeProductFromWarehouses(id, session);
  }

  return product;
};
