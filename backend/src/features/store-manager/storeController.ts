import { Request, Response, NextFunction } from "express";

import Product from "../products/ProductModel.js";
import Category from "../categories/CategoryModel.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find();
    if (!categories.length) {
      return next(new ApiError(404, "No categories found"));
    }

    res.status(200).json(categories);
  }
);

export const getProductsByCategoryId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const categoryDoc = await Category.findById(id);
    if (!categoryDoc) {
      return next(new ApiError(404, "Category not found"));
    }

    const products = await Product.find({ category: categoryDoc._id });
    if (!products.length) {
      return next(new ApiError(404, "No products found in this category"));
    }

    res.status(200).json(products);
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json(product);
  }
);
