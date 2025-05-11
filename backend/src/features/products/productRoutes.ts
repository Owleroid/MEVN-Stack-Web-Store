import express from "express";

import {
  searchProductsByName,
  getProductsByCategoryId,
  getProductIdsByCategoryId,
  getProductById,
  getProductBySlug,
  addProduct,
  editProduct,
  updateProductCategory,
  deleteProduct,
} from "./productController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Public routes - specific routes first
router.get("/category/:categoryId/ids", getProductIdsByCategoryId);
router.get("/category/:categoryId", getProductsByCategoryId);
router.get("/search/:name", searchProductsByName);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin routes
router.post("/", isAuthenticated, isAdmin, addProduct);
router.put("/:id", isAuthenticated, isAdmin, editProduct);
router.put("/:id/category", isAuthenticated, isAdmin, updateProductCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
