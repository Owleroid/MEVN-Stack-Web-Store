import express from "express";

import {
  getActiveAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncementStatus,
  updateAnnouncementImage,
  deleteAnnouncement,
} from "./announcementController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveAnnouncements);

// Admin routes
router.get("/", isAuthenticated, isAdmin, getAllAnnouncements);
router.get("/:id", isAuthenticated, isAdmin, getAnnouncementById);
router.post("/", isAuthenticated, isAdmin, createAnnouncement);
router.post("/:id/status", isAuthenticated, isAdmin, updateAnnouncementStatus);
router.post("/:id/image", isAuthenticated, isAdmin, updateAnnouncementImage);
router.delete("/:id", isAuthenticated, isAdmin, deleteAnnouncement);

export default router;
