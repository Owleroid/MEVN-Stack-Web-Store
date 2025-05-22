import express from "express";

import {
  getAllDiscountsController,
  getDiscountByIdController,
  createDiscountController,
  updateDiscountController,
  toggleDiscountStatusController,
  deleteDiscountController,
} from "./discountController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllDiscountsController);
router.get("/:id", isAuthenticated, isAdmin, getDiscountByIdController);
router.post("/", isAuthenticated, isAdmin, createDiscountController);
router.put("/:id", isAuthenticated, isAdmin, updateDiscountController);
router.put(
  "/:id/toggle",
  isAuthenticated,
  isAdmin,
  toggleDiscountStatusController
);
router.delete("/:id", isAuthenticated, isAdmin, deleteDiscountController);

export default router;
