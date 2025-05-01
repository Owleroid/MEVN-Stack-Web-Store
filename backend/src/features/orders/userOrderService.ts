import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto-js";
import mongoose from "mongoose";

import User, { UserDocument } from "./../authorization/UserModel.js";
import Warehouse, {
  WarehouseDocument,
} from "./../warehouses/WarehouseModel.js";
import Order, {
  OrderDocument,
  OrderProduct,
  Address,
  Recipient,
} from "./OrderModel.js";

import ApiError, { ErrorType } from "./../../utils/apiError.js";

const countryToWarehousePath = path.resolve(
  "src/config/secrets/country-to-warehouse.json"
);

/**
 * Loads the mapping between countries and warehouses from the configuration file
 */
export const loadCountryToWarehouseMap = (): { [key: string]: string } => {
  if (!fs.existsSync(countryToWarehousePath)) {
    console.warn(
      `Warning: Configuration file "country-to-warehouse.json" not found.`
    );
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(countryToWarehousePath, "utf-8"));
  } catch (error: unknown) {
    console.error(
      `Error parsing "country-to-warehouse.json": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return {};
  }
};

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

  // Create a new user if userId is not provided
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

  // Update existing user if userId is provided
  try {
    user = await User.findById(userId).session(session);

    if (!user) {
      throw new ApiError(404, "User not found", ErrorType.RESOURCE_NOT_FOUND);
    }

    // Update user details if they changed
    if (!user.name || user.name !== recipient.name) user.name = recipient.name;
    if (!user.surname || user.surname !== recipient.surname)
      user.surname = recipient.surname;
    if (!user.phone || user.phone !== recipient.phone)
      user.phone = recipient.phone;

    // Always update delivery data with the latest address
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
 * Determine which warehouse should be used for the order based on shipping country
 */
export const determineWarehouse = async (
  country: string,
  session: mongoose.ClientSession
): Promise<WarehouseDocument | null> => {
  const countryToWarehouseMap = loadCountryToWarehouseMap();
  const warehouseName = countryToWarehouseMap[country] || null;

  if (!warehouseName) {
    // This is expected behavior for some countries, not an error
    return null;
  }

  try {
    const warehouse = await Warehouse.findOne({ name: warehouseName }).session(
      session
    );

    if (!warehouse) {
      throw new ApiError(
        404,
        `Warehouse "${warehouseName}" not found for country ${country}`,
        ErrorType.RESOURCE_NOT_FOUND
      );
    }

    return warehouse;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Error finding warehouse for country ${country}: ${
        error instanceof Error ? error.message : String(error)
      }`,
      ErrorType.INTERNAL
    );
  }
};

/**
 * Update warehouse stock based on ordered products
 */
export const updateWarehouseStock = async (
  warehouse: WarehouseDocument,
  products: OrderProduct[],
  session: mongoose.ClientSession
): Promise<void> => {
  // Process each product and update warehouse stock
  for (const orderProduct of products) {
    const warehouseProduct = warehouse.products.find(
      (p) => p.product.toString() === orderProduct.productId.toString()
    );

    if (!warehouseProduct) {
      throw new ApiError(
        404,
        `Product with ID "${orderProduct.productId}" not found in warehouse "${warehouse.name}"`,
        ErrorType.RESOURCE_NOT_FOUND
      );
    }

    const orderAmount = orderProduct.amount;
    if (typeof orderAmount !== "number" || isNaN(orderAmount)) {
      throw new ApiError(
        400,
        `Invalid amount "${orderAmount}" for product "${orderProduct.productId}"`,
        ErrorType.VALIDATION
      );
    }

    warehouseProduct.amount = warehouseProduct.amount - orderAmount;

    if (isNaN(warehouseProduct.amount)) {
      throw new ApiError(
        500,
        `Failed to update stock for product "${orderProduct.productId}" in warehouse "${warehouse.name}". Resulting amount is NaN.`,
        ErrorType.INTERNAL
      );
    }
  }

  try {
    await warehouse.save({ session });
  } catch (error: unknown) {
    throw new ApiError(
      500,
      `Failed to update warehouse stock: ${
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
  warehouse: WarehouseDocument | null,
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
