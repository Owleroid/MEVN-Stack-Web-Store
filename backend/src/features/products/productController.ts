import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import * as productService from "./productService.js";
import * as discountService from "../discounts/discountService.js";
import { getCategoryById } from "../categories/categoryService.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler, transactionHandler } from "../../utils/asyncHandlers.js";

export const searchProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.params;

    if (!query) {
      return next(new ApiError(400, "Search query is required"));
    }

    const products = await productService.searchProducts(query);

    const productsWithDiscounts =
      await discountService.applyDiscountsToProducts(products);

    res.status(200).json({
      success: true,
      products: productsWithDiscounts,
    });
  }
);

export const getProductsByCategoryId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    const categoryExists = await getCategoryById(categoryId);
    if (!categoryExists) {
      return next(new ApiError(404, "Category not found"));
    }

    const products = await productService.getProductsByCategoryId(categoryId);

    const productsWithDiscounts =
      await discountService.applyDiscountsToProducts(products);

    res.status(200).json({
      success: true,
      products: productsWithDiscounts,
    });
  }
);

export const getProductIdsByCategoryId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;

    const categoryExists = await getCategoryById(categoryId);
    if (!categoryExists) {
      return next(new ApiError(404, "Category not found"));
    }

    const productIds = await productService.getProductIdsByCategoryId(
      categoryId
    );

    res.status(200).json({
      success: true,
      productIds,
    });
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    const productWithDiscount =
      await discountService.applyDiscountToSingleProduct(product);

    res.status(200).json({
      success: true,
      product: productWithDiscount,
    });
  }
);

export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const { categorySlug } = req.query;

    const product = await productService.getProductBySlug(slug);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    const productWithDiscount =
      await discountService.applyDiscountToSingleProduct(product);

    if (categorySlug) {
      const productCategory = await getCategoryById(product.category);

      if (!productCategory) {
        return next(new ApiError(500, "Product category not found"));
      }

      if (productCategory.slug !== categorySlug) {
        return res.status(200).json({
          success: true,
          product: productWithDiscount,
          correctCategorySlug: productCategory.slug,
          redirectNeeded: true,
        });
      }
    }

    res.status(200).json({
      success: true,
      product: productWithDiscount,
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

    const products = await productService.getProductsByIds(validIds);

    const productsWithDiscounts =
      await discountService.applyDiscountsToProducts(products);

    res.status(200).json({
      success: true,
      products: productsWithDiscounts,
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

    const categoryExists = await getCategoryById(category);
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }

    const existingProductWithName = await productService.checkProductNameExists(
      name,
      session
    );
    if (existingProductWithName) {
      throw new ApiError(400, "Product with this name already exists");
    }

    if (slug) {
      const existingProductWithSlug =
        await productService.checkProductSlugExists(slug, undefined, session);
      if (existingProductWithSlug) {
        throw new ApiError(400, "Product with this slug already exists");
      }
    }

    const existingProductWithNumber =
      await productService.checkProductNumberExists(productNumber, session);
    if (existingProductWithNumber) {
      throw new ApiError(
        400,
        "Product with this product number already exists"
      );
    }

    const savedProduct = await productService.createProduct(
      {
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
      },
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
      const categoryExists = await getCategoryById(updatedProduct.category);
      if (!categoryExists) {
        return next(new ApiError(404, "Category not found"));
      }
    }

    if (updatedProduct.slug) {
      const existingProductWithSlug =
        await productService.checkProductSlugExists(updatedProduct.slug, id);

      if (existingProductWithSlug) {
        return next(new ApiError(400, "Product with this slug already exists"));
      }
    }

    const product = await productService.updateProduct(id, updatedProduct);

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

    const categoryExists = await getCategoryById(categoryId);
    if (!categoryExists) {
      return next(new ApiError(404, "Category not found"));
    }

    const product = await productService.updateProductCategory(id, categoryId);

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

    const product = await productService.deleteProduct(id);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.status(200).json({
      success: true,
    });
  }
);
