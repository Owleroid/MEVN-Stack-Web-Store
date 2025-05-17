import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Discount from "./DiscountModel.js";
import Product from "../products/ProductModel.js";
import Category from "../categories/CategoryModel.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler, transactionHandler } from "../../utils/asyncHandler.js";

export const getAllDiscounts = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { active, targetType } = req.query;

    const query: any = {};

    if (active !== undefined) {
      query.isActive = active === "true";
    }

    if (targetType) {
      query.targetType = targetType;
    }

    const discounts = await Discount.find(query)
      .populate("categories", "name slug")
      .populate("products", "name slug");

    res.status(200).json({
      success: true,
      discounts,
    });
  }
);

export const getDiscountById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const discount = await Discount.findById(id)
      .populate("categories", "name slug")
      .populate("products", "name slug");

    if (!discount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
      discount,
    });
  }
);

export const createDiscount = transactionHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const {
      name,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      discountPrices,
      targetType,
      categories,
      products,
      isActive = true,
    } = req.body;

    if (targetType === "categories") {
      if (!categories || categories.length === 0) {
        return next(
          new ApiError(
            400,
            "Categories must be specified when target type is categories"
          )
        );
      }
      const categoryCount = await Category.countDocuments({
        _id: { $in: categories },
      }).session(session);
      if (categoryCount !== categories.length) {
        return next(new ApiError(400, "One or more categories do not exist"));
      }
    }

    if (targetType === "products") {
      if (!products || products.length === 0) {
        return next(
          new ApiError(
            400,
            "Products must be specified when target type is products"
          )
        );
      }
      const productCount = await Product.countDocuments({
        _id: { $in: products },
      }).session(session);
      if (productCount !== products.length) {
        return next(new ApiError(400, "One or more products do not exist"));
      }
    }

    const discount = await Discount.create(
      [
        {
          name,
          description,
          startDate,
          startTime,
          endDate,
          endTime,
          discountPrices,
          targetType,
          categories,
          products,
          isActive,
        },
      ],
      { session }
    );

    const createdDiscount = await Discount.findById(discount[0]._id)
      .populate("categories", "name slug")
      .populate("products", "name slug")
      .session(session);

    res.status(201).json({
      success: true,
      discount: createdDiscount,
    });
  }
);

export const updateDiscount = transactionHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.targetType === "categories" && updateData.categories) {
      if (updateData.categories.length === 0) {
        return next(
          new ApiError(
            400,
            "Categories must be specified when target type is categories"
          )
        );
      }
      const categoryCount = await Category.countDocuments({
        _id: { $in: updateData.categories },
      }).session(session);
      if (categoryCount !== updateData.categories.length) {
        return next(new ApiError(400, "One or more categories do not exist"));
      }
    }

    if (updateData.targetType === "products" && updateData.products) {
      if (updateData.products.length === 0) {
        return next(
          new ApiError(
            400,
            "Products must be specified when target type is products"
          )
        );
      }
      const productCount = await Product.countDocuments({
        _id: { $in: updateData.products },
      }).session(session);
      if (productCount !== updateData.products.length) {
        return next(new ApiError(400, "One or more products do not exist"));
      }
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      session,
    })
      .populate("categories", "name slug")
      .populate("products", "name slug");

    if (!updatedDiscount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
      discount: updatedDiscount,
    });
  }
);

export const deleteDiscount = transactionHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { id } = req.params;

    const discount = await Discount.findByIdAndDelete(id).session(session);

    if (!discount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
      message: "Discount deleted successfully",
    });
  }
);

export const getActiveDiscountsForProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    const now = new Date();
    const discounts = await Discount.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { targetType: "all" },
        { targetType: "products", products: productId },
        { targetType: "categories", categories: product.category },
      ],
    });

    res.status(200).json({
      success: true,
      discounts,
    });
  }
);

export const toggleDiscountStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const discount = await Discount.findById(id);
    if (!discount) {
      return next(new ApiError(404, "Discount not found"));
    }

    discount.isActive = !discount.isActive;
    await discount.save();

    res.status(200).json({
      success: true,
      discount,
    });
  }
);
