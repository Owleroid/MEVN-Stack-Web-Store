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

import {
  validateSignup,
  validateLogin,
  validateResetPassword,
  validateUpdateUser,
  validateChangePassword,
} from "../middleware/authValidation.js";

const router = express.Router();

router.get("/user/:userId", isAuthenticated, getUserData);
router.get("/check-email/:email", checkEmail);

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", isAuthenticated, logout);
router.post("/reset-password", validateResetPassword, resetPassword);

router.put(
  "/update-user/:userId",
  isAuthenticated,
  validateUpdateUser,
  updateUserData
);
router.put(
  "/user/:userId/change-password",
  isAuthenticated,
  validateChangePassword,
  changeUserPassword
);

export default router;
