import express from "express";
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
} from "../controllers/userOrderController.js";

const router = express.Router();

router.get("/:orderId", getOrderById);
router.get("/user/:userId", getOrdersByUserId);
router.post("/create", createOrder);

export default router;
