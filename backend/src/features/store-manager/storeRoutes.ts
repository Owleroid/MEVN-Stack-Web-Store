import express from "express";

import {
  getCategories,
  getProductsByCategoryId,
  getProductById,
} from "./storeController.js";

const router = express.Router();

// Categories
router.get("/categories", getCategories);
router.get("/categories/:id/products", getProductsByCategoryId);

// Products
router.get("/products/:id", getProductById);

export default router;
