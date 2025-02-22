import express from "express";

import {
  getProductsByCategory,
  getProductById,
} from "../controllers/storeController.js";

const router = express.Router();

router.get("/products/category/:category", getProductsByCategory);
router.get("/products/:id", getProductById);

export default router;
