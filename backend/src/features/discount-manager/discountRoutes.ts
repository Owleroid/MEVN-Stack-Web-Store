import express from "express";

import {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getActiveDiscountsForProduct,
  toggleDiscountStatus,
} from "./discountController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllDiscounts);
router.get("/:id", getDiscountById);
router.get("/product/:productId/active", getActiveDiscountsForProduct);

// Admin routes
router.post("/", isAuthenticated, isAdmin, createDiscount);
router.put("/:id", isAuthenticated, isAdmin, updateDiscount);
router.delete("/:id", isAuthenticated, isAdmin, deleteDiscount);
router.patch("/:id/toggle", isAuthenticated, isAdmin, toggleDiscountStatus);

export default router;
