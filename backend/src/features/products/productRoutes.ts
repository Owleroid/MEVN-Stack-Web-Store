import express from "express";

import {
  searchProducts,
  getProductsByCategoryId,
  getProductIdsByCategoryId,
  getProductById,
  getProductBySlug,
  addProduct,
  editProduct,
  updateProductCategory,
  deleteProduct,
  getProductsByIds,
} from "./productController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Public routes - specific routes first
router.get("/category/:categoryId/ids", getProductIdsByCategoryId);
router.get("/category/:categoryId", getProductsByCategoryId);
router.get("/search/:query", searchProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin routes
router.post("/", isAuthenticated, isAdmin, addProduct);
router.post("/byIds", isAuthenticated, isAdmin, getProductsByIds);
router.put("/:id", isAuthenticated, isAdmin, editProduct);
router.put("/:id/category", isAuthenticated, isAdmin, updateProductCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
