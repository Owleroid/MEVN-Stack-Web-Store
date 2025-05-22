import { Request, Response, NextFunction } from "express";

import { getAllUsers } from "../authorization/authService.js";

import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getAllUsersController = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  }
);
