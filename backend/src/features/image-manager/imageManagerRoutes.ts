import express from "express";

import {
  fetchImages,
  uploadImages,
  deleteImages,
} from "./imageManagerController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";
import { upload } from "../../middleware/multer.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, fetchImages);
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  upload.array("images", 10),
  uploadImages
);
router.delete("/", isAuthenticated, isAdmin, deleteImages);

export default router;
