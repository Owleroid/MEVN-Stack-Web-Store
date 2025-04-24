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
} from "./authController.js";

import { isAuthenticated } from "./authMiddleware.js";

import {
  validateSignup,
  validateLogin,
  validateResetPassword,
  validateUpdateUser,
  validateChangePassword,
} from "./authValidation.js";

const router = express.Router();

// User Data
router.get("/users/:userId", isAuthenticated, getUserData);
router.put(
  "/users/:userId",
  isAuthenticated,
  validateUpdateUser,
  updateUserData
);
router.put(
  "/users/:userId/password",
  isAuthenticated,
  validateChangePassword,
  changeUserPassword
);

// Authentication
router.get("/check-email/:email", checkEmail);
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", isAuthenticated, logout);
router.post("/reset-password", validateResetPassword, resetPassword);

export default router;
