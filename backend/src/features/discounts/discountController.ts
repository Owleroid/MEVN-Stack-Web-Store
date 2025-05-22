import { Request, Response, NextFunction } from "express";

import Discount from "./DiscountModel.js";
import Product from "../products/ProductModel.js";

import { getCategoryById } from "../categories/categoryService.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getAllDiscounts = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const discounts = await Discount.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      discounts,
    });
  }
);

export const getDiscountById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const discount = await Discount.findById(id);

    if (!discount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
      discount,
    });
  }
);

export const createDiscount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      description = "",
      scope,
      targetModel,
      targetIds,
      discounts,
      startDate,
      endDate,
      isActive = true,
    } = req.body;

    if (scope !== "all") {
      if (!targetModel) {
        return next(
          new ApiError(400, "Target model is required for specific scopes")
        );
      }

      if (!targetIds || !Array.isArray(targetIds) || targetIds.length === 0) {
        return next(
          new ApiError(400, "Target IDs are required for specific scopes")
        );
      }

      if (targetModel === "Category") {
        let existingCategories = await Promise.all(
          targetIds.map((id) => getCategoryById(id))
        );

        existingCategories = existingCategories.filter(Boolean);

        if (existingCategories.length !== targetIds.length) {
          return next(new ApiError(400, "One or more categories don't exist"));
        }
      } else if (targetModel === "Product") {
        const productCount = await Product.countDocuments({
          _id: { $in: targetIds },
        });
        if (productCount !== targetIds.length) {
          return next(new ApiError(400, "One or more products don't exist"));
        }
      }
    }

    const newDiscount = new Discount({
      name,
      description,
      scope,
      ...(scope !== "all" && { targetModel, targetIds }),
      discounts,
      startDate,
      endDate,
      isActive,
    });

    const savedDiscount = await newDiscount.save();

    res.status(201).json({
      success: true,
      discountId: savedDiscount._id,
      discount: savedDiscount,
    });
  }
);

export const updateDiscount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {
      name,
      description,
      scope,
      targetModel,
      targetIds,
      discounts,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (scope !== "all") {
      if (!targetModel) {
        return next(
          new ApiError(400, "Target model is required for specific scopes")
        );
      }

      if (!targetIds || !Array.isArray(targetIds) || targetIds.length === 0) {
        return next(
          new ApiError(400, "Target IDs are required for specific scopes")
        );
      }

      if (targetModel === "Category") {
        let existingCategories = await Promise.all(
          targetIds.map((id) => getCategoryById(id))
        );

        existingCategories = existingCategories.filter(Boolean);

        if (existingCategories.length !== targetIds.length) {
          return next(new ApiError(400, "One or more categories don't exist"));
        }
      } else if (targetModel === "Product") {
        const productCount = await Product.countDocuments({
          _id: { $in: targetIds },
        });
        if (productCount !== targetIds.length) {
          return next(new ApiError(400, "One or more products don't exist"));
        }
      }
    }

    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      {
        name,
        description,
        scope,
        ...(scope !== "all" && { targetModel, targetIds }),
        discounts,
        startDate,
        endDate,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!updatedDiscount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
      discountId: updatedDiscount._id,
      discount: updatedDiscount,
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
      isActive: discount.isActive,
      discount,
    });
  }
);

export const deleteDiscount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedDiscount = await Discount.findByIdAndDelete(id);

    if (!deletedDiscount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
    });
  }
);
