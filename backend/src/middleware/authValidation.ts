import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validateSignup = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

export const validateResetPassword = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  validateRequest,
];

export const validateUpdateUser = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  body("name").optional().trim().escape(),
  body("surname").optional().trim().escape(),
  // body("phone")
  //   .optional()
  //   .isMobilePhone("any")
  //   .withMessage("Invalid phone number"),
  body("deliveryData.country").optional().trim().escape(),
  body("deliveryData.city").optional().trim().escape(),
  body("deliveryData.street").optional().trim().escape(),
  body("deliveryData.postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid postal code"),
  validateRequest,
];

export const validateChangePassword = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  validateRequest,
];
