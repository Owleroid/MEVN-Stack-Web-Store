import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/apiError.js";
import Category from "../models/Category.js";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new ApiError(400, "Category with this name already exists"));
    }

    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: "New category was successfully created",
      categoryId: savedCategory._id,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      message: "Category was successfully updated",
      categoryId: updatedCategory._id,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      message: "Category was successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
