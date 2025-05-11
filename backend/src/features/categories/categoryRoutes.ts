import express from "express";

import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryAndReassignProducts,
} from "./categoryController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);

// Admin routes
router.post("/", isAuthenticated, isAdmin, createCategory);
router.put("/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);
router.put(
  "/:id/reassign",
  isAuthenticated,
  isAdmin,
  deleteCategoryAndReassignProducts
);

export default router;
