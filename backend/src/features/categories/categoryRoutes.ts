import express from "express";

import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryAndReassignProducts,
  searchCategories,
} from "./categoryController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/search/:query", searchCategories);
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
