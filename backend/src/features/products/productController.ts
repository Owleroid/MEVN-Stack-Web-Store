import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import ApiError from "../../utils/apiError.js";

import Product from "./ProductModel.js";
import Warehouse from "../warehouses/WarehouseModel.js";

import { ProductInput } from "../../types/product.js";

export const searchProductsByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.params;
    if (!name) {
      return next(new ApiError(400, "Product name is required"));
    }

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
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

export const getProductIdsByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId }).select("_id");
    const productIds = products.map((product) => product._id.toString());

    res.status(200).json({
      success: true,
      message: "Product IDs fetched successfully",
      productIds,
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
  }: ProductInput = req.body;

  try {
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

export const updateProductCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.body;

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
      message: "Product category was successfully updated",
      productId: id,
      category: categoryId,
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

    // Remove the product from all warehouses
    await Warehouse.updateMany({}, { $pull: { products: { product: id } } });

    res.status(200).json({
      success: true,
      message: "Product was successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
