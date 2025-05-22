import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import Product from "./ProductModel.js";
import Category from "../categories/CategoryModel.js";
import {
  updateWarehousesWithNewProduct,
  removeProductFromWarehouses,
} from "../warehouses/warehouseService.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler, transactionHandler } from "../../utils/asyncHandler.js";

export const searchProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.params;

    if (!query) {
      return next(new ApiError(400, "Search query is required"));
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
        { productNumber: { $regex: query, $options: "i" } },
      ],
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
    const { categorySlug } = req.query;

    const product = await Product.findOne({ slug });

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    if (categorySlug) {
      const productCategory = await Category.findById(product.category);

      if (!productCategory) {
        return next(new ApiError(500, "Product category not found"));
      }

      if (productCategory.slug !== categorySlug) {
        return res.status(200).json({
          success: true,
          product,
          correctCategorySlug: productCategory.slug,
          redirectNeeded: true,
        });
      }
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const getProductsByIds = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return next(new ApiError(400, "Valid product IDs array is required"));
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return next(new ApiError(400, "No valid product IDs provided"));
    }

    const products = await Product.find({
      _id: { $in: validIds },
    }).select("_id name");

    res.status(200).json({
      success: true,
      products,
    });
  }
);

export const addProduct = transactionHandler(
  async (
    req: Request,
    res: Response,
    _next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const {
      name,
      slug,
      productNumber,
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

    const categoryExists = await Category.findById(category).session(session);
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }

    const existingProduct = await Product.findOne({ name }).session(session);
    if (existingProduct) {
      throw new ApiError(400, "Product with this name already exists");
    }

    if (slug) {
      const existingSlug = await Product.findOne({ slug }).session(session);
      if (existingSlug) {
        throw new ApiError(400, "Product with this slug already exists");
      }
    }

    const existingProductNumber = await Product.findOne({
      productNumber,
    }).session(session);
    if (existingProductNumber) {
      throw new ApiError(
        400,
        "Product with this product number already exists"
      );
    }

    const newProduct = new Product({
      name,
      slug,
      productNumber,
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

    const savedProduct = await newProduct.save({ session });

    await updateWarehousesWithNewProduct(
      savedProduct._id,
      savedProduct.name,
      session
    );

    res.status(201).json({
      success: true,
      productId: savedProduct._id,
      slug: savedProduct.slug,
    });
  }
);

export const editProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updatedProduct = req.body;

    if (updatedProduct.category) {
      const categoryExists = await Category.findById(updatedProduct.category);
      if (!categoryExists) {
        return next(new ApiError(404, "Category not found"));
      }
    }

    if (updatedProduct.slug) {
      const existingSlug = await Product.findOne({
        slug: updatedProduct.slug,
        _id: { $ne: id },
      });

      if (existingSlug) {
        return next(new ApiError(400, "Product with this slug already exists"));
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
      slug: product.slug,
    });
  }
);

export const updateProductCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { categoryId } = req.body;

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

    await removeProductFromWarehouses(id);

    res.status(200).json({
      success: true,
    });
  }
);
