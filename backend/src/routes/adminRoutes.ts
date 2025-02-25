import express from "express";

import {
  getProductsByCategoryId,
  getProductById,
  addProduct,
  editProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
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
router.delete("/delete-product/:id", isAuthenticated, isAdmin, deleteProduct);

// Category routes
router.get("/categories", isAuthenticated, isAdmin, getAllCategories);
router.get("/category/:id", isAuthenticated, isAdmin, getCategoryById);
router.post("/add-category", isAuthenticated, isAdmin, createCategory);
router.put("/update-category/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/delete-category/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;
