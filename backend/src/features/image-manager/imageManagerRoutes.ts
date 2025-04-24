import express from "express";

import {
  fetchImages,
  uploadImages,
  deleteImages,
} from "./imageManagerController.js";

import { isAuthenticated, isAdmin } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, fetchImages);
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  upload.array("images", 10), // Allow up to 10 files
  uploadImages
);
router.delete("/", isAuthenticated, isAdmin, deleteImages);

export default router;
