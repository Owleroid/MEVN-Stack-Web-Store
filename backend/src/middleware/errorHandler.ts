import multer from "multer";
import { Request, Response, NextFunction } from "express";

import ApiError, { ErrorType } from "../utils/apiError.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(
    `[${new Date().toISOString()}] Error: ${err.name}: ${err.message}`
  );

  // Handle ApiError
  if (err instanceof ApiError) {
    const response = {
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
      errorType: err.errorType,
    };

    // Log with more detail for server-side debugging
    console.error(
      `[${new Date().toISOString()}] ${err.errorType}: ${err.message}`,
      {
        statusCode: err.statusCode,
        stack: err.stack,
      }
    );

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    let message = "File upload error";
    let errorType = ErrorType.BAD_REQUEST;

    // Customize error messages based on Multer error codes
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File size exceeds the allowed limit of 5MB";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded at once";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field";
        break;
      default:
        message = err.message;
    }

    console.error(`[${new Date().toISOString()}] ${errorType}: ${message}`, {
      code: err.code,
      field: err.field,
    });

    res.status(400).json({
      status: "error",
      statusCode: 400,
      message,
      errorType,
    });
    return;
  }

  // Handle other errors
  console.error(`[${new Date().toISOString()}] Unhandled Error:`, {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal Server Error",
    errorType: ErrorType.INTERNAL,
  });
};
