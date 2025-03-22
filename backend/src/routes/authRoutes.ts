import express from "express";

import {
  getUserData,
  checkEmail,
  signup,
  login,
  logout,
  resetPassword,
  updateUserData,
  changeUserPassword,
} from "../controllers/authController.js";

import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user/:userId", isAuthenticated, getUserData);
router.get("/check-email/:email", checkEmail);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/reset-password", resetPassword);
router.put("/update-user/:userId", isAuthenticated, updateUserData);
router.put(
  "/user/:userId/change-password",
  isAuthenticated,
  changeUserPassword
);

export default router;
