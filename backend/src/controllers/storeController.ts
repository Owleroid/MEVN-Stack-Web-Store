import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/apiError.js";

import Product from "../features/products/ProductModel.js";
import Category from "../models/Category.js";

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find();
    if (!categories.length) {
      return next(new ApiError(404, "No categories found"));
    }

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
