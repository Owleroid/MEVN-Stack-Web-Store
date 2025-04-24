import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto-js";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import User from "../../models/User.js";
import Order from "./OrderModel.js";
import Warehouse from "../warehouses/Warehouse.js";

const countryToWarehousePath = path.resolve(
  "src/config/secrets/country-to-warehouse.json"
);

const loadCountryToWarehouseMap = (): { [key: string]: string } => {
  if (!fs.existsSync(countryToWarehousePath)) {
    console.warn(
      `Warning: Configuration file "country-to-warehouse.json" not found.`
    );
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(countryToWarehousePath, "utf-8"));
  } catch (error) {
    console.error(
      `Error parsing "country-to-warehouse.json": ${(error as Error).message}`
    );
    return {};
  }
};

const handleUser = async (
  userId: string | null,
  recipient: any,
  shippingAddress: any,
  session: mongoose.ClientSession
) => {
  let user;

  if (!userId) {
    user = await User.findOne({ email: recipient.email });

    if (user) {
      throw new Error("Email is already in use. Please log in to continue.");
    }

    const password = crypto.lib.WordArray.random(8).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email: recipient.email,
      password: hashedPassword,
      name: recipient.name,
      surname: recipient.surname,
      phone: recipient.phone,
      deliveryData: shippingAddress,
    });

    return await user.save({ session });
  }

  user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.name || user.name !== recipient.name) user.name = recipient.name;
  if (!user.surname || user.surname !== recipient.surname)
    user.surname = recipient.surname;
  if (!user.phone || user.phone !== recipient.phone)
    user.phone = recipient.phone;

  if (
    !user.deliveryData ||
    JSON.stringify(user.deliveryData) !== JSON.stringify(shippingAddress)
  ) {
    user.deliveryData = shippingAddress;
  }

  return await user.save({ session });
};

const determineWarehouse = async (
  country: string,
  session: mongoose.ClientSession
) => {
  const countryToWarehouseMap = loadCountryToWarehouseMap();
  const warehouseName = countryToWarehouseMap[country] || null;

  if (!warehouseName) {
    return null;
  }

  const warehouse = await Warehouse.findOne({ name: warehouseName }).session(
    session
  );

  if (!warehouse) {
    throw new Error(`Warehouse "${warehouseName}" not found`);
  }

  return warehouse;
};

const updateWarehouseStock = async (
  warehouse: any,
  products: any[],
  session: mongoose.ClientSession
) => {
  for (const orderProduct of products) {
    const warehouseProduct = warehouse.products.find(
      (p: any) => p.product.toString() === orderProduct.productId
    );

    if (!warehouseProduct) {
      throw new Error(
        `Product with ID "${orderProduct.productId}" not found in warehouse "${warehouse.name}"`
      );
    }

    const orderAmount = orderProduct.amount;
    if (typeof orderAmount !== "number" || isNaN(orderAmount)) {
      throw new Error(
        `Invalid amount "${orderAmount}" for product "${orderProduct.productId}"`
      );
    }

    const currentAmount = warehouseProduct.amount ?? 0;

    warehouseProduct.amount = currentAmount - orderAmount;

    if (isNaN(warehouseProduct.amount)) {
      throw new Error(
        `Failed to update stock for product "${orderProduct.productId}" in warehouse "${warehouse.name}". Resulting amount is NaN.`
      );
    }
  }

  await warehouse.save({ session });
};

const createNewOrder = async (
  userId: string,
  products: any[],
  totalPrice: number,
  currency: string,
  shippingAddress: any,
  recipient: any,
  status: string,
  checked: boolean,
  paymentMethod: string,
  orderNotes: string,
  trackingNumber: string,
  warehouse: any,
  session: mongoose.ClientSession
) => {
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
    warehouse: warehouse ? warehouse._id : null,
  });

  return await order.save({ session });
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      userId,
      recipient,
      products,
      totalPrice,
      currency,
      shippingAddress,
      status,
      checked,
      paymentMethod,
      orderNotes,
      trackingNumber,
    } = req.body;

    // Step 1: Handle user creation or update
    const user = await handleUser(userId, recipient, shippingAddress, session);

    // Step 2: Determine the warehouse
    const warehouse = await determineWarehouse(
      shippingAddress.country,
      session
    );

    // Step 3: Update warehouse stock if applicable
    if (warehouse) {
      await updateWarehouseStock(warehouse, products, session);
    }

    // Step 4: Create the order
    const order = await createNewOrder(
      user._id,
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
      warehouse,
      session
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "New order was successfully created",
      order,
    });
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();

    next(error);
  }
};

export const getOrdersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });

    if (!orders) {
      res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
      return;
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
