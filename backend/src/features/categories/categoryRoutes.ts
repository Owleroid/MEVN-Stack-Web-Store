import express from "express";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryAndReassignProducts,
} from "./categoryController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllCategories);
router.get("/:id", isAuthenticated, isAdmin, getCategoryById);
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
