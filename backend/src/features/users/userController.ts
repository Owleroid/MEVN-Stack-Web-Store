import { Request, Response, NextFunction } from "express";

import User from "../authorization/UserModel.js";

import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getAllUsers = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await User.find().select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  }
);
