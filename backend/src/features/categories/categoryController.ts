import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import * as categoryService from "./categoryService.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler, transactionHandler } from "../../utils/asyncHandlers.js";

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      categories,
    });
  }
);

export const searchCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.params;

    if (!query) {
      return next(new ApiError(400, "Search query is required"));
    }

    const categories = await categoryService.searchCategories(query);

    res.status(200).json({
      success: true,
      categories,
    });
  }
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      category,
    });
  }
);

export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      category,
    });
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, imageUrl, slug } = req.body;

    // Check if a category with the same name already exists
    const nameExists = await categoryService.checkCategoryNameExists(name);
    if (nameExists) {
      return next(new ApiError(400, "Category with this name already exists"));
    }

    // Check if a category with the same slug already exists if a slug is provided
    if (slug) {
      const slugExists = await categoryService.checkCategorySlugExists(slug);
      if (slugExists) {
        return next(
          new ApiError(400, "Category with this slug already exists")
        );
      }
    }

    const savedCategory = await categoryService.createCategory({
      name,
      imageUrl,
      slug,
    });

    res.status(201).json({
      success: true,
      categoryId: savedCategory._id,
    });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, imageUrl, slug } = req.body;

    // Check if a category with the same slug already exists if a slug is provided
    if (slug) {
      const slugExists = await categoryService.checkCategorySlugExists(
        slug,
        id
      );
      if (slugExists) {
        return next(
          new ApiError(400, "Category with this slug already exists")
        );
      }
    }

    const updatedCategory = await categoryService.updateCategory(id, {
      name,
      imageUrl,
      slug,
    });

    if (!updatedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      categoryId: updatedCategory._id,
    });
  }
);

export const deleteCategory = transactionHandler(
  async (
    req: Request,
    res: Response,
    _next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { id } = req.params;

    const deletedCategory = await categoryService.deleteCategory(id, session);

    if (!deletedCategory) {
      throw new ApiError(404, "Category not found");
    }

    res.status(200).json({
      success: true,
    });
  }
);

export const deleteCategoryAndReassignProducts = transactionHandler(
  async (
    req: Request,
    res: Response,
    _next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { id } = req.params;
    const { newCategoryId } = req.body;

    const deletedCategory =
      await categoryService.deleteCategoryAndReassignProducts(
        id,
        newCategoryId,
        session
      );

    if (!deletedCategory) {
      throw new ApiError(404, "Category not found");
    }

    res.status(200).json({
      success: true,
    });
  }
);
