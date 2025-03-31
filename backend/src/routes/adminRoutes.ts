import express from "express";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryAndReassignProducts,
} from "../controllers/admin/categoryController.js";
import {
  searchProductsByName,
  getProductsByCategoryId,
  getProductIdsByCategoryId,
  getProductById,
  addProduct,
  editProduct,
  updateProductCategory,
  deleteProduct,
} from "../controllers/admin/productController.js";
import {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../controllers/admin/warehouseController.js";
import {
  getOrderById,
  deleteOrderById,
  editOrderById,
  getAllOrders,
  filterOrders,
} from "../controllers/admin/orderController.js";
import {
  fetchImages,
  uploadImages,
  deleteImages,
} from "../controllers/admin/imageManagerController.js";

import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Category routes
router.get("/categories", isAuthenticated, isAdmin, getAllCategories);
router.get("/category/:id", isAuthenticated, isAdmin, getCategoryById);
router.post("/add-category", isAuthenticated, isAdmin, createCategory);
router.put("/update-category/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/delete-category/:id", isAuthenticated, isAdmin, deleteCategory);
router.put(
  "/delete-and-reassign-category/:id",
  isAuthenticated,
  isAdmin,
  deleteCategoryAndReassignProducts
);

// Product routes
router.get(
  "/products/search/:name",
  isAuthenticated,
  isAdmin,
  searchProductsByName
);
router.get(
  "/products/category/:categoryId",
  isAuthenticated,
  isAdmin,
  getProductsByCategoryId
);
router.get("/products/category/:categoryId/ids", getProductIdsByCategoryId);
router.get("/product/:id", isAuthenticated, isAdmin, getProductById);
router.post("/add-product", isAuthenticated, isAdmin, addProduct);
router.put("/edit-product/:id", isAuthenticated, isAdmin, editProduct);
router.put(
  "/edit-product-category/:id",
  isAuthenticated,
  isAdmin,
  updateProductCategory
);
router.delete("/delete-product/:id", isAuthenticated, isAdmin, deleteProduct);

// Warehouse routes
router.get("/warehouses", isAuthenticated, isAdmin, getAllWarehouses);
router.get("/warehouse/:id", isAuthenticated, isAdmin, getWarehouseById);
router.post("/add-warehouse", isAuthenticated, isAdmin, createWarehouse);
router.put("/update-warehouse/:id", isAuthenticated, isAdmin, updateWarehouse);
router.delete(
  "/delete-warehouse/:id",
  isAuthenticated,
  isAdmin,
  deleteWarehouse
);

// Order routes
router.get("/orders", isAuthenticated, isAdmin, getAllOrders);
router.get("/filter-orders", isAuthenticated, isAdmin, filterOrders);
router.get("/order/:orderId", isAuthenticated, isAdmin, getOrderById);
router.put("/edit-order/:orderId", isAuthenticated, isAdmin, editOrderById);
router.delete(
  "/delete-order/:orderId",
  isAuthenticated,
  isAdmin,
  deleteOrderById
);

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
