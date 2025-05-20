import express from "express";

import {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  toggleDiscountStatus,
  deleteDiscount,
} from "./discountController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Admin routes (all require authentication)
router.get("/", isAuthenticated, isAdmin, getAllDiscounts);
router.get("/:id", isAuthenticated, isAdmin, getDiscountById);
router.post("/", isAuthenticated, isAdmin, createDiscount);
router.put("/:id", isAuthenticated, isAdmin, updateDiscount);
router.put("/:id/toggle", isAuthenticated, isAdmin, toggleDiscountStatus);
router.delete("/:id", isAuthenticated, isAdmin, deleteDiscount);

export default router;
