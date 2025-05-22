import { Request, Response, NextFunction } from "express";

import * as discountService from "./discountService.js";
import { getProductsByIds } from "../products/productService.js";
import { getCategoryById } from "../categories/categoryService.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getAllDiscountsController = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const discounts = await discountService.getAllDiscounts();

    res.status(200).json({
      success: true,
      discounts,
    });
  }
);

export const getDiscountByIdController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const discount = await discountService.getDiscountById(id);

    if (!discount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
      discount,
    });
  }
);

export const createDiscountController = asyncHandler(
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
        const products = await getProductsByIds(targetIds);
        if (products.length !== targetIds.length) {
          return next(new ApiError(400, "One or more products don't exist"));
        }
      }
    }

    const savedDiscount = await discountService.createDiscount({
      name,
      description,
      scope,
      ...(scope !== "all" && { targetModel, targetIds }),
      discounts,
      startDate,
      endDate,
      isActive,
    });

    res.status(201).json({
      success: true,
      discountId: savedDiscount._id,
      discount: savedDiscount,
    });
  }
);

export const updateDiscountController = asyncHandler(
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
        const products = await getProductsByIds(targetIds);
        if (products.length !== targetIds.length) {
          return next(new ApiError(400, "One or more products don't exist"));
        }
      }
    }

    const updatedDiscount = await discountService.updateDiscount(id, {
      name,
      description,
      scope,
      ...(scope !== "all" && { targetModel, targetIds }),
      discounts,
      startDate,
      endDate,
      isActive,
    });

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

export const toggleDiscountStatusController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const discount = await discountService.toggleDiscountStatus(id);

    if (!discount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
      isActive: discount.isActive,
      discount,
    });
  }
);

export const deleteDiscountController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedDiscount = await discountService.deleteDiscount(id);

    if (!deletedDiscount) {
      return next(new ApiError(404, "Discount not found"));
    }

    res.status(200).json({
      success: true,
    });
  }
);
