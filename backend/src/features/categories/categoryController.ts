import { Request, Response, NextFunction } from "express";

import Product from "../../features/products/ProductModel.js";
import Category from "./CategoryModel.js";
import Warehouse from "../warehouses/WarehouseModel.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      categories,
    });
  }
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      category,
    });
  }
);

export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      category,
    });
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, imageUrl, slug } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new ApiError(400, "Category with this name already exists"));
    }

    // Check if slug already exists, if provided
    if (slug) {
      const slugExists = await Category.findOne({ slug });
      if (slugExists) {
        return next(
          new ApiError(400, "Category with this slug already exists")
        );
      }
    }

    const newCategory = new Category({ name, imageUrl, slug });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      categoryId: savedCategory._id,
    });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, imageUrl, slug } = req.body;

    // Check if slug already exists (if provided) and doesn't belong to current category
    if (slug) {
      const slugExists = await Category.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        return next(
          new ApiError(400, "Category with this slug already exists")
        );
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, imageUrl, slug },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      categoryId: updatedCategory._id,
    });
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    // Find all products related to the category
    const products = await Product.find({ category: id });

    // Remove each product from all warehouses
    for (const product of products) {
      await Warehouse.updateMany(
        {},
        { $pull: { products: { product: product._id } } }
      );
    }

    // Delete all products related to the category
    await Product.deleteMany({ category: id });

    res.status(200).json({
      success: true,
    });
  }
);

export const deleteCategoryAndReassignProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { newCategoryId } = req.body;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    // Reassign products to new category
    await Product.updateMany({ category: id }, { category: newCategoryId });

    res.status(200).json({
      success: true,
    });
  }
);
