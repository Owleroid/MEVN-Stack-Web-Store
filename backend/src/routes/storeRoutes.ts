import express from "express";

import {
  getCategories,
  getProductsByCategoryId,
  getProductById,
} from "../controllers/storeController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/products/category/:id", getProductsByCategoryId);
router.get("/products/:id", getProductById);

export default router;
