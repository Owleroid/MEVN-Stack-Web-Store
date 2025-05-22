import express from "express";

import {
  submitSupportMessage,
  getAllSupportMessages,
  getSupportMessageById,
  updateSupportMessage,
  deleteSupportMessage,
} from "./supportController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", submitSupportMessage);

// Admin routes
router.get("/", isAuthenticated, isAdmin, getAllSupportMessages);
router.get("/:id", isAuthenticated, isAdmin, getSupportMessageById);
router.put("/:id", isAuthenticated, isAdmin, updateSupportMessage);
router.delete("/:id", isAuthenticated, isAdmin, deleteSupportMessage);

export default router;
