import { Request, Response, NextFunction } from "express";

import User from "./UserModel.js";

import ApiError from "../../utils/apiError.js";

export const isAuthenticated = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return next(new ApiError(401, "Unauthorized"));
  }
  next();
};

export const isAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (!user.isAdmin) {
      return next(new ApiError(403, "User is not an admin"));
    }
  } catch (error) {
    return next(error);
  }

  next();
};
