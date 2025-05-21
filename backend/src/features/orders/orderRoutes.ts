import express from "express";

import {
  getOrderById,
  editOrderById,
  getAllOrders,
  filterOrders,
} from "./adminOrderController.js";
import { createOrder, getOrdersByUserId } from "./userOrderController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";
import { applyDiscountsToOrders } from "../discounts/discountMiddleware.js";

const router = express.Router();

// Admin
router.get("/admin/", isAuthenticated, isAdmin, getAllOrders);
router.get("/admin/filter", isAuthenticated, isAdmin, filterOrders);
router.get("/admin/:orderId", isAuthenticated, isAdmin, getOrderById);
router.put(
  "/admin/edit-order/:orderId",
  isAuthenticated,
  isAdmin,
  editOrderById
);

//User
router.get("/user/:userId", isAuthenticated, getOrdersByUserId);
router.post("/", applyDiscountsToOrders, createOrder);

export default router;
