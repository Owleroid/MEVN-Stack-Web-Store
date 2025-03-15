import express from "express";

import {
  checkEmail,
  signup,
  login,
  logout,
  resetPassword,
} from "../controllers/authController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/check-email/:email", checkEmail);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/reset-password", resetPassword);

export default router;
