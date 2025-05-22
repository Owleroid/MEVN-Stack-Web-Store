import mongoose from "mongoose";

import User, { UserDocument } from "./UserModel.js";

/**
 * Get all users (excluding sensitive information)
 * @returns {Promise<Array>} All users with sensitive fields excluded
 */
export const getAllUsers = async (): Promise<Partial<UserDocument>[]> => {
  return User.find().select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );
};

/**
 * Get a user by ID
 * @param {string} id - The user ID
 * @param {boolean} includeSensitive - Whether to include sensitive fields
 * @returns {Promise<Object|null>} The user or null if not found
 */
export const getUserById = async (
  id: string | mongoose.Types.ObjectId,
  includeSensitive = false
): Promise<Partial<UserDocument> | null> => {
  const query = User.findById(id);

  if (!includeSensitive) {
    query.select("-password -resetPasswordToken -resetPasswordExpires");
  }

  return query.exec();
};

/**
 * Get a user by email
 * @param {string} email - The user email
 * @param {boolean} includeSensitive - Whether to include sensitive fields
 * @returns {Promise<Object|null>} The user or null if not found
 */
export const getUserByEmail = async (
  email: string,
  includeSensitive = false
): Promise<Partial<UserDocument> | null> => {
  const query = User.findOne({ email });

  if (!includeSensitive) {
    query.select("-password -resetPasswordToken -resetPasswordExpires");
  }

  return query.exec();
};

/**
 * Create a new user
 * @param {Object} userData - The user data
 * @returns {Promise<Object>} The created user
 */
export const createUser = async (userData: {
  email: string;
  password: string;
  isAdmin?: boolean;
  name?: string;
  surname?: string;
  phone?: string;
  deliveryData?: {
    country?: string;
    city?: string;
    street?: string;
    buildingNumber?: string;
    apartment?: string;
    postalCode?: string;
  };
}): Promise<UserDocument> => {
  const newUser = new User(userData);
  return newUser.save();
};

/**
 * Update a user
 * @param {string} id - The user ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object|null>} The updated user or null if not found
 */
export const updateUser = async (
  id: string | mongoose.Types.ObjectId,
  updateData: Partial<Omit<UserDocument, "_id" | "password">>
): Promise<Partial<UserDocument> | null> => {
  return User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password -resetPasswordToken -resetPasswordExpires");
};

/**
 * Update a user's password
 * @param {string} id - The user ID
 * @param {string} newPassword - The new password
 * @returns {Promise<boolean>} True if password was updated
 */
export const updateUserPassword = async (
  id: string | mongoose.Types.ObjectId,
  newPassword: string
): Promise<boolean> => {
  const user = await User.findById(id);

  if (!user) {
    return false;
  }

  user.password = newPassword;
  await user.save();

  return true;
};

/**
 * Delete a user
 * @param {string} id - The user ID
 * @returns {Promise<Object|null>} The deleted user or null if not found
 */
export const deleteUser = async (
  id: string | mongoose.Types.ObjectId
): Promise<Partial<UserDocument> | null> => {
  return User.findByIdAndDelete(id).select(
    "-password -resetPasswordToken -resetPasswordExpires"
  );
};

/**
 * Set password reset token for a user
 * @param {string} email - The user email
 * @param {string} token - The reset token
 * @param {Date} expiryDate - The token expiry date
 * @returns {Promise<boolean>} True if token was set
 */
export const setPasswordResetToken = async (
  email: string,
  token: string,
  expiryDate: Date
): Promise<boolean> => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expiryDate;
  await user.save();

  return true;
};

/**
 * Find user by reset token
 * @param {string} token - The reset token
 * @returns {Promise<Object|null>} The user or null if not found or token expired
 */
export const getUserByResetToken = async (
  token: string
): Promise<Partial<UserDocument> | null> => {
  return User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("-password");
};
