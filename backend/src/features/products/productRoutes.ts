import express from "express";

import {
  searchProductsByName,
  getProductsByCategoryId,
  getProductIdsByCategoryId,
  getProductById,
  addProduct,
  editProduct,
  updateProductCategory,
  deleteProduct,
} from "./productController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

router.get("/search/:name", isAuthenticated, isAdmin, searchProductsByName);
router.get(
  "/category/:categoryId",
  isAuthenticated,
  isAdmin,
  getProductsByCategoryId
);
router.get("/category/:categoryId/ids", getProductIdsByCategoryId);
router.get("/:id", isAuthenticated, isAdmin, getProductById);
router.post("/", isAuthenticated, isAdmin, addProduct);
router.put("/:id", isAuthenticated, isAdmin, editProduct);
router.put("/:id/category", isAuthenticated, isAdmin, updateProductCategory);
router.delete("/delete-product/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
