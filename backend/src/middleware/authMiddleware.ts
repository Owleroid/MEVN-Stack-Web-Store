import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError.js";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return next(new ApiError(401, "Unauthorized"));
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isAdmin) {
    return next(new ApiError(401, "Not an administrator"));
  }
  next();
};
