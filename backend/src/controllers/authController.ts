import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Request, Response } from "express";

import User from "../models/User.js";

// Fixing the session custom parameter
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export const signup = async (req: Request, res: Response) => {
  console.log("Request triggered");
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(500).json({ error: "Invalid credentials" });
      return;
    }

    // req.session.userId = user._id;
    res.cookie("userId", user._id, {
      httpOnly: true, // The cookie is not accessible via JavaScript
      secure: true, // The cookie is only sent over HTTPS
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
    });
    res.status(200).json({ message: "Logged in" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Error logging out" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send email with reset link
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

    res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
};
