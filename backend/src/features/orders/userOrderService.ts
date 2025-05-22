import bcrypt from "bcryptjs";
import crypto from "crypto-js";
import mongoose from "mongoose";

import User, { UserDocument } from "./../authorization/UserModel.js";
import Order, {
  OrderDocument,
  OrderProduct,
  Address,
  Recipient,
} from "./OrderModel.js";

import ApiError, { ErrorType } from "./../../utils/apiError.js";

/**
 * Handles user creation or update during order creation
 *
 * @param {string | undefined} userId - The user ID if the user is logged in
 * @param {Recipient} recipient - The recipient information
 * @param {Address} shippingAddress - The shipping address
 * @param {mongoose.ClientSession} session - Mongoose session for transaction
 * @returns {Promise<UserDocument>} The created or updated user
 * @throws {ApiError} If user creation/update fails or validation errors occur
 */
export const handleUser = async (
  userId: string | undefined,
  recipient: Recipient,
  shippingAddress: Address,
  session: mongoose.ClientSession
): Promise<UserDocument> => {
  try {
    // If userId is provided, update existing user
    if (userId) {
      return await updateExistingUser(
        userId,
        recipient,
        shippingAddress,
        session
      );
    }

    // Otherwise, create new user or handle guest checkout
    return await createUserFromOrder(recipient, shippingAddress, session);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Error processing user data: ${
        error instanceof Error ? error.message : String(error)
      }`,
      ErrorType.INTERNAL
    );
  }
};

/**
 * Creates a new user from order information
 *
 * @param {Recipient} recipient - The recipient information
 * @param {Address} shippingAddress - The shipping address
 * @param {mongoose.ClientSession} session - Mongoose session for transaction
 * @returns {Promise<UserDocument>} The created user
 * @throws {ApiError} If user creation fails or validation errors occur
 */
const createUserFromOrder = async (
  recipient: Recipient,
  shippingAddress: Address,
  session: mongoose.ClientSession
): Promise<UserDocument> => {
  const existingUser = await User.findOne({ email: recipient.email }).session(
    session
  );

  if (existingUser) {
    throw new ApiError(
      400,
      "Email is already in use. Please log in to continue.",
      ErrorType.CONFLICT
    );
  }

  const password = crypto.lib.WordArray.random(8).toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email: recipient.email,
    password: hashedPassword,
    name: recipient.name,
    surname: recipient.surname,
    phone: recipient.phone,
    deliveryData: {
      country: shippingAddress.country,
      city: shippingAddress.city,
      street: shippingAddress.street,
      buildingNumber: shippingAddress.buildingNumber,
      apartment: shippingAddress.apartment,
      postalCode: shippingAddress.postalCode,
    },
  });

  try {
    return await newUser.save({ session });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      throw new ApiError(
        400,
        `Validation error: ${error.message}`,
        ErrorType.VALIDATION
      );
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new ApiError(
        409,
        "A user with this email already exists",
        ErrorType.CONFLICT
      );
    }

    throw new ApiError(
      500,
      `Failed to create user: ${
        error instanceof Error ? error.message : String(error)
      }`,
      ErrorType.INTERNAL
    );
  }
};

/**
 * Updates an existing user with new order information
 *
 * @param {string} userId - The user ID
 * @param {Recipient} recipient - The recipient information
 * @param {Address} shippingAddress - The shipping address
 * @param {mongoose.ClientSession} session - Mongoose session for transaction
 * @returns {Promise<UserDocument>} The updated user
 * @throws {ApiError} If user update fails or user not found
 */
const updateExistingUser = async (
  userId: string,
  recipient: Recipient,
  shippingAddress: Address,
  session: mongoose.ClientSession
): Promise<UserDocument> => {
  const user = await User.findById(userId).session(session);

  if (!user) {
    throw new ApiError(404, "User not found", ErrorType.RESOURCE_NOT_FOUND);
  }

  if (!user.name || user.name !== recipient.name) user.name = recipient.name;
  if (!user.surname || user.surname !== recipient.surname)
    user.surname = recipient.surname;
  if (!user.phone || user.phone !== recipient.phone)
    user.phone = recipient.phone;

  user.deliveryData = {
    country: shippingAddress.country,
    city: shippingAddress.city,
    street: shippingAddress.street,
    buildingNumber: shippingAddress.buildingNumber,
    apartment: shippingAddress.apartment,
    postalCode: shippingAddress.postalCode,
  };

  try {
    return await user.save({ session });
  } catch (error: unknown) {
    throw new ApiError(
      500,
      `Failed to update user: ${
        error instanceof Error ? error.message : String(error)
      }`,
      ErrorType.INTERNAL
    );
  }
};

/**
 * Creates a new order in the database
 *
 * @param {string | mongoose.Types.ObjectId} userId - The user ID
 * @param {OrderProduct[]} products - Array of products in the order
 * @param {number} totalPrice - Total price of the order
 * @param {"rubles" | "euros"} currency - Currency used for the order
 * @param {Address} shippingAddress - Shipping address details
 * @param {Recipient} recipient - Recipient information
 * @param {OrderDocument["status"]} status - Order status
 * @param {boolean} checked - Whether the order has been checked
 * @param {string | undefined} paymentMethod - Payment method used
 * @param {string | undefined} orderNotes - Additional notes for the order
 * @param {string | undefined} trackingNumber - Tracking number for the shipment
 * @param {{ _id: mongoose.Types.ObjectId } | null} warehouse - Warehouse information
 * @param {mongoose.ClientSession} session - Mongoose session for transaction
 * @returns {Promise<OrderDocument>} The created order
 * @throws {ApiError} If order creation fails or validation errors occur
 */
export const createNewOrder = async (
  userId: string | mongoose.Types.ObjectId,
  products: OrderProduct[],
  totalPrice: number,
  currency: "rubles" | "euros",
  shippingAddress: Address,
  recipient: Recipient,
  status: OrderDocument["status"],
  checked: boolean,
  paymentMethod: string | undefined,
  orderNotes: string | undefined,
  trackingNumber: string | undefined,
  warehouse: { _id: mongoose.Types.ObjectId } | null,
  session: mongoose.ClientSession
): Promise<OrderDocument> => {
  const order = new Order({
    userId,
    products,
    totalPrice,
    currency,
    shippingAddress,
    recipient,
    status,
    checked,
    paymentMethod,
    orderNotes,
    trackingNumber,
    warehouse: warehouse ? warehouse._id : undefined,
  });

  try {
    return await order.save({ session });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      throw new ApiError(
        400,
        `Order validation error: ${error.message}`,
        ErrorType.VALIDATION
      );
    }

    throw new ApiError(
      500,
      `Failed to create order: ${
        error instanceof Error ? error.message : String(error)
      }`,
      ErrorType.INTERNAL
    );
  }
};
