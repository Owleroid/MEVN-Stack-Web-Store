import { Request, Response, NextFunction } from "express";
import multer from "multer";
import ApiError from "../utils/apiError.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    let message = "File upload error";

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

    res.status(400).json({ message });
    return;
  }

  // Handle other errors
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};
