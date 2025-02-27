import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/apiError.js";

import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.params;

    const categoryDoc = await Category.findOne({ name: category });
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
