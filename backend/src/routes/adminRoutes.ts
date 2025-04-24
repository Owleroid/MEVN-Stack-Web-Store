import express from "express";

import {
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
} from "../controllers/admin/warehouseController.js";

import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/warehouses", isAuthenticated, isAdmin, getAllWarehouses);
router.get("/warehouse/:id", isAuthenticated, isAdmin, getWarehouseById);
router.put("/update-warehouse/:id", isAuthenticated, isAdmin, updateWarehouse);

export default router;
