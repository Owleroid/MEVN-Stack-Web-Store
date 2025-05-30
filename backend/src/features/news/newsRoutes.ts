import express from "express";

import {
  getActiveNews,
  getPaginatedActiveNews,
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  updateNewsStatus,
  deleteNews,
} from "./newsController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveNews);
router.get("/active/paginated", getPaginatedActiveNews);
router.get("/:id", getNewsById);

// Admin routes
router.get("/", isAuthenticated, isAdmin, getAllNews);
router.post("/", isAuthenticated, isAdmin, createNews);
router.put("/:id", isAuthenticated, isAdmin, updateNews);
router.post("/:id/status", isAuthenticated, isAdmin, updateNewsStatus);
router.delete("/:id", isAuthenticated, isAdmin, deleteNews);

export default router;
