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
 * Create or update user based on order information
 */
export const handleUser = async (
  userId: string | undefined,
  recipient: Recipient,
  shippingAddress: Address,
  session: mongoose.ClientSession
): Promise<UserDocument> => {
  let user: UserDocument | null;

  if (!userId) {
    try {
      user = await User.findOne({ email: recipient.email }).session(session);

      if (user) {
        throw new ApiError(
          400,
          "Email is already in use. Please log in to continue.",
          ErrorType.CONFLICT
        );
      }

      const password = crypto.lib.WordArray.random(8).toString();
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
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
        return await user.save({ session });
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
  }

  try {
    user = await User.findById(userId).session(session);

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
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Error retrieving user data: ${
        error instanceof Error ? error.message : String(error)
      }`,
      ErrorType.INTERNAL
    );
  }
};

/**
 * Create a new order in the database
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
