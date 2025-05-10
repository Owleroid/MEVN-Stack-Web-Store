import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import Order from "./OrderModel.js";
import { OrderProduct, Address, Recipient } from "./OrderModel.js";

import ApiError, { ErrorType } from "../../utils/apiError.js";
import { asyncHandler, transactionHandler } from "../../utils/asyncHandler.js";

import {
  handleUser,
  determineWarehouse,
  updateWarehouseStock,
  createNewOrder,
} from "./userOrderService.js";

interface CreateOrderRequest {
  userId?: string;
  products: OrderProduct[];
  totalPrice: number;
  currency: "rubles" | "euros";
  shippingAddress: Address;
  recipient: Recipient;
  status:
    | "waiting confirmation"
    | "packing"
    | "sended"
    | "delivered"
    | "canceled";
  checked: boolean;
  paymentMethod?: string;
  orderNotes?: string;
  trackingNumber?: string;
}

export const createOrder = transactionHandler(
  async (
    req: Request,
    res: Response,
    _next: NextFunction,
    session: mongoose.ClientSession
  ): Promise<void> => {
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
    } = req.body as CreateOrderRequest;

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

    res.status(201).json({
      success: true,
      message: "New order was successfully created",
      order,
    });
  }
);

export const getOrdersByUserId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    res.status(200).json({
      success: true,
      orders,
    });
  }
);
