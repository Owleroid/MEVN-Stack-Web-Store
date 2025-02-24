import express from "express";

import {
  addProduct,
  editProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminCategoryController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Product routes
router.post("/add-product", isAuthenticated, isAdmin, addProduct);
router.put("/edit-product/:id", isAuthenticated, isAdmin, editProduct);
router.delete("/delete-product/:id", isAuthenticated, isAdmin, deleteProduct);

// Category routes
router.get("/categories", isAuthenticated, isAdmin, getAllCategories);
router.post("/create", isAuthenticated, isAdmin, createCategory);
router.put("/update/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;
