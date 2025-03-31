import { Request, Response, NextFunction } from "express";

import ApiError from "../../utils/apiError.js";

import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Warehouse from "../../models/Warehouse.js";

export const getAllCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, imageUrl } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new ApiError(400, "Category with this name already exists"));
    }

    const newCategory = new Category({ name, imageUrl });
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
    const { name, imageUrl } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, imageUrl },
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

    // Find all products related to the category
    const products = await Product.find({ category: id });

    // Remove each product from all warehouses
    for (const product of products) {
      await Warehouse.updateMany(
        {},
        { $pull: { products: { product: product._id } } }
      );
    }

    // Delete all products related to the category
    await Product.deleteMany({ category: id });

    res.status(200).json({
      success: true,
      message: "Category and related products were successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryAndReassignProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { newCategoryId } = req.body;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return next(new ApiError(404, "Category not found"));
    }

    // Reassign products to new category
    await Product.updateMany({ category: id }, { category: newCategoryId });

    res.status(200).json({
      success: true,
      message: `Category was successfully deleted and products were reassigned to new category`,
    });
  } catch (error) {
    next(error);
  }
};
