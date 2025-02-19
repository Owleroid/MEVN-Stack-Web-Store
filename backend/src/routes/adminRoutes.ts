import express from "express";

import {
  addProduct,
  editProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-product", isAuthenticated, isAdmin, addProduct);
router.put("/edit-product", isAuthenticated, isAdmin, editProduct);
router.delete("/delete-product", isAuthenticated, isAdmin, deleteProduct);

export default router;
