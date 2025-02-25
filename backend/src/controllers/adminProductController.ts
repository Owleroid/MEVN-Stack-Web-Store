import { Request, Response, NextFunction } from "express";

import Product from "../models/Product.js";
import ApiError from "../utils/apiError.js";
import { ProductInput } from "../types/product.js";

export const getProductsByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
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

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    category,
    price,
    artist,
    size,
    material,
    parts = "",
    boxArt,
    amount,
    description = "",
    imageUrls = { main: "", secondary: [] },
  }: ProductInput = req.body;

  try {
    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return next(new ApiError(400, "Product with this title already exists"));
    }

    const newProduct = new Product({
      title,
      category,
      price,
      artist,
      size,
      material,
      parts,
      boxArt,
      amount,
      description,
      imageUrls,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "New product was successfully added",
      productId: savedProduct._id,
    });
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedProduct: ProductInput = req.body;

    const product = await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json({
      success: true,
      message: "Product was successfully updated",
      productId: id,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json({
      success: true,
      message: "Product was successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
