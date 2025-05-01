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
      // If it's already an ApiError, pass it through
      if (error instanceof ApiError) {
        return next(error);
      }

      // Otherwise, create a new ApiError with appropriate context
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

      // If we reach this point without errors, commit the transaction
      await session.commitTransaction();
    } catch (error: unknown) {
      // Always abort transaction on error
      await session.abortTransaction();

      // If it's already an ApiError, pass it through
      if (error instanceof ApiError) {
        return next(error);
      }

      // Otherwise, create a new ApiError with appropriate context
      console.error("Unhandled transaction error:", error);

      next(
        new ApiError(
          500,
          error instanceof Error ? error.message : String(error),
          ErrorType.INTERNAL
        )
      );
    } finally {
      // Always end the session
      session.endSession();
    }
  };
};
