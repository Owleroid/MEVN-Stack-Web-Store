import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError, { ErrorType } from "./apiError.js";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

type TransactionAsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
  session: mongoose.ClientSession
) => Promise<any>;

/**
 * Wraps an async controller function to handle errors consistently
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return next(error);
      }

      console.error("Unhandled controller error:", error);

      next(
        new ApiError(
          500,
          error instanceof Error ? error.message : String(error),
          ErrorType.INTERNAL
        )
      );
    }
  };
};

/**
 * Wraps an async controller function that uses MongoDB transactions
 * Handles transaction management and error handling consistently
 */
export const transactionHandler = (fn: TransactionAsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await fn(req, res, next, session);

      await session.commitTransaction();
    } catch (error: unknown) {
      await session.abortTransaction();

      if (error instanceof ApiError) {
        return next(error);
      }

      console.error("Unhandled transaction error:", error);

      next(
        new ApiError(
          500,
          error instanceof Error ? error.message : String(error),
          ErrorType.INTERNAL
        )
      );
    } finally {
      session.endSession();
    }
  };
};
