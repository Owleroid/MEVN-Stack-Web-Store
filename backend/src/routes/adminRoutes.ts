import express from "express";

import {
  getAllWarehouses,
  getWarehouseById,
  updateWarehouse,
} from "../controllers/admin/warehouseController.js";
import {
  fetchImages,
  uploadImages,
  deleteImages,
} from "../controllers/admin/imageManagerController.js";

import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Category routes

// Product routes

// Warehouse routes
router.get("/warehouses", isAuthenticated, isAdmin, getAllWarehouses);
router.get("/warehouse/:id", isAuthenticated, isAdmin, getWarehouseById);
router.put("/update-warehouse/:id", isAuthenticated, isAdmin, updateWarehouse);

// Order routes

// Image Manager routes
router.get("/image-manager/images", isAuthenticated, isAdmin, fetchImages);
router.post(
  "/image-manager/upload-images",
  isAuthenticated,
  isAdmin,
  upload.array("images", 10), // Allow up to 10 files
  uploadImages
);
router.delete(
  "/image-manager/delete-images",
  isAuthenticated,
  isAdmin,
  deleteImages
);

export default router;
