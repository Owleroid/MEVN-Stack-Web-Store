import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import Product from "./ProductModel.js";
import Warehouse from "../warehouses/WarehouseModel.js";
import Category from "../categories/CategoryModel.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const searchProductsByName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    if (!name) {
      return next(new ApiError(400, "Product name is required"));
    }

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });

    res.status(200).json({
      success: true,
      products,
    });
  }
);

export const getProductsByCategoryId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    // Validate that the category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return next(new ApiError(404, "Category not found"));
    }

    const products = await Product.find({ category: categoryId });

    res.status(200).json({
      success: true,
      products,
    });
  }
);

export const getProductIdsByCategoryId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    // Validate that the category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return next(new ApiError(404, "Category not found"));
    }

    const products = await Product.find({ category: categoryId }).select("_id");
    const productIds = products.map((product) => product._id.toString());

    res.status(200).json({
      success: true,
      productIds,
    });
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    console.log("Slug:", slug);

    const product = await Product.findOne({ slug });

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const addProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      category,
      price,
      artist,
      size,
      material,
      parts = "",
      boxArt,
      description = "",
      imageUrls = { main: "", secondary: [] },
    } = req.body;

    // Validate that the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new ApiError(404, "Category not found"));
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return next(new ApiError(400, "Product with this name already exists"));
    }

    const newProduct = new Product({
      name,
      category,
      price,
      artist,
      size,
      material,
      parts,
      boxArt,
      description,
      imageUrls,
    });

    const savedProduct = await newProduct.save();

    // Fetch all warehouses and update each with the new product and amount 0
    const warehouses = await Warehouse.find();
    for (const warehouse of warehouses) {
      warehouse.products.push({
        product: new mongoose.Types.ObjectId(savedProduct._id),
        name: savedProduct.name,
        amount: 0,
      });
      await warehouse.save();
    }

    res.status(201).json({
      success: true,
      productId: savedProduct._id,
    });
  }
);

export const editProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updatedProduct = req.body;

    // If category is being updated, validate it exists
    if (updatedProduct.category) {
      const categoryExists = await Category.findById(updatedProduct.category);
      if (!categoryExists) {
        return next(new ApiError(404, "Category not found"));
      }
    }

    const product = await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json({
      success: true,
      productId: id,
    });
  }
);

export const updateProductCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { categoryId } = req.body;

    // Validate that the category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return next(new ApiError(404, "Category not found"));
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { category: categoryId },
      { new: true }
    );

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json({
      success: true,
      productId: id,
      category: categoryId,
    });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    // Remove the product from all warehouses
    await Warehouse.updateMany({}, { $pull: { products: { product: id } } });

    res.status(200).json({
      success: true,
    });
  }
);
