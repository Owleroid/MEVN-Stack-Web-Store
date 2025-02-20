import express from "express";

import { getProductsByCategory } from "../controllers/storeController.js";

const router = express.Router();

router.get("/products/category/:category", getProductsByCategory);

export default router;
