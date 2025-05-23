import { Request, Response, NextFunction } from "express";

export const sessionRefresh = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.userId) {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
  }
  next();
};
