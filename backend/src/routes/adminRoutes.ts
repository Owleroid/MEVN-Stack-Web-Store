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

import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

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

export default router;
