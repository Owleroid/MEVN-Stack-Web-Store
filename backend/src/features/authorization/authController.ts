import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";

import {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  updateUserPassword,
  setPasswordResetToken,
} from "./authService.js";

import type { UserDocument } from "./UserModel.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getUserData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await getUserById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    res.status(200).json(user);
  }
);

export const updateUserData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { name, surname, phone, deliveryData } = req.body;

    const updatedUser = await updateUser(userId, {
      name,
      surname,
      phone,
      deliveryData,
    });

    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "User data updated",
    });
  }
);

export const changeUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = (await getUserById(userId, true)) as UserDocument;
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new ApiError(401, "Current password is incorrect"));
    }

    const updated = await updateUserPassword(userId, newPassword);
    if (!updated) {
      return next(new ApiError(500, "Failed to update password"));
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);

export const checkEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;

    const user = await getUserByEmail(email);

    res.status(200).json({ exists: !!user });
  }
);

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return next(new ApiError(400, "User already exists"));
    }

    await createUser({ email, password });

    res.status(201).json({
      success: true,
      message: "User created",
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = (await getUserByEmail(email, true)) as UserDocument;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new ApiError(401, "Invalid credentials"));
    }

    req.session.userId = user._id;
    if (user.isAdmin) {
      req.session.isAdmin = user.isAdmin;
    }

    res.status(200).json({
      success: true,
      message: "Logged in",
      userId: user._id,
      isAdmin: user.isAdmin,
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new ApiError(500, "Error logging out"));
        } else {
          resolve();
        }
      });
    });

    res.clearCookie("connect.sid");
    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const resetExpires = new Date(Date.now() + 3600000); // 1 hour
    const tokenSet = await setPasswordResetToken(email, token, resetExpires);

    if (!tokenSet) {
      return next(new ApiError(500, "Failed to set password reset token"));
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({
      success: true,
      message: "Reset email sent",
    });
  }
);
