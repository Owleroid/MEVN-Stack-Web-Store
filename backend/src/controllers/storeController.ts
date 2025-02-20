import { Request, Response, NextFunction } from "express";

import Product from "../models/Product.js";
import ApiError from "../utils/apiError.js";
import Category from "../models/Category.js";

export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.params;
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) return next(new ApiError(404, "Category not found"));
    const products = await Product.find({ category: categoryDoc._id });
    if (!products.length)
      return next(new ApiError(404, "No products found in this category"));
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
