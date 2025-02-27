import express from "express";

import {
  getProductsByCategoryId,
  getProductById,
  addProduct,
  editProduct,
  updateProductCategory,
  deleteProduct,
} from "../controllers/adminProductController.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryAndReassignProducts,
} from "../controllers/adminCategoryController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Product routes
router.get(
  "/products/category/:categoryId",
  isAuthenticated,
  isAdmin,
  getProductsByCategoryId
);
router.get("/product/:id", isAuthenticated, isAdmin, getProductById);
router.post("/add-product", isAuthenticated, isAdmin, addProduct);
router.put("/edit-product/:id", isAuthenticated, isAdmin, editProduct);
router.put(
  "/edit-product-category/:id",
  isAuthenticated,
  isAdmin,
  updateProductCategory
);
router.delete("/delete-product/:id", isAuthenticated, isAdmin, deleteProduct);

// Category routes
router.get("/categories", isAuthenticated, isAdmin, getAllCategories);
router.get("/category/:id", isAuthenticated, isAdmin, getCategoryById);
router.post("/add-category", isAuthenticated, isAdmin, createCategory);
router.put("/update-category/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/delete-category/:id", isAuthenticated, isAdmin, deleteCategory);
router.put(
  "/delete-and-reassign-category/:id",
  isAuthenticated,
  isAdmin,
  deleteCategoryAndReassignProducts
);

export default router;
