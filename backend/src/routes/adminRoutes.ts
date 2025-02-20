import express from "express";

import {
  addProduct,
  editProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminCategoryController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-product", isAuthenticated, isAdmin, addProduct);
router.put("/edit-product", isAuthenticated, isAdmin, editProduct);
router.delete("/delete-product", isAuthenticated, isAdmin, deleteProduct);

router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
