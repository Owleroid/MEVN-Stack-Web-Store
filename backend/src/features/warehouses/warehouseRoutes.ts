import express from "express";

import {
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
} from "./warehouseController.js";

import { isAuthenticated, isAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllWarehouses);
router.get("/:id", isAuthenticated, isAdmin, getWarehouseById);
router.put("/:id", isAuthenticated, isAdmin, updateWarehouse);

export default router;
