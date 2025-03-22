import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/apiError.js";

import User from "../models/User.js";

export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { name, surname, phone, deliveryData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.phone = phone || user.phone;
    user.deliveryData = deliveryData || user.deliveryData;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User data updated",
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Current password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const checkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    next(error);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const user = new User({ email, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User created",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(401, "Invalid credentials");
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
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new ApiError(500, "Error logging out"));
    }

    res.clearCookie("connect.sid");
    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  });
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

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
  } catch (error) {
    next(error);
  }
};
