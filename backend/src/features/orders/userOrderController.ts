import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import Order, { Address, Recipient } from "./OrderModel.js";

import * as userOrderService from "./userOrderService.js";
import * as warehouseService from "../warehouses/warehouseService.js";

import ApiError, { ErrorType } from "../../utils/apiError.js";
import { asyncHandler, transactionHandler } from "../../utils/asyncHandlers.js";

interface CreateOrderRequest {
  userId?: string;
  products: {
    productId: string;
    amount: number;
  }[];
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
      currency,
      shippingAddress,
      status,
      checked,
      paymentMethod,
      orderNotes,
      trackingNumber,
    } = req.body as CreateOrderRequest;

    // Step 1: Process products and calculate prices server-side
    const { products: processedProducts, totalPrice } =
      await userOrderService.processOrderProducts(products, currency);

    // Step 2: Handle user creation or update
    const user = await userOrderService.handleUser(
      userId,
      recipient,
      shippingAddress,
      session
    );

    // Step 3: Determine the warehouse based on country
    const countryToWarehouseMap = warehouseService.loadCountryToWarehouseMap();
    const warehouseName =
      countryToWarehouseMap[shippingAddress.country] || null;

    let warehouse = null;
    if (warehouseName) {
      warehouse = await warehouseService.findWarehouseByName(
        warehouseName,
        session
      );

      if (!warehouse) {
        throw new ApiError(
          404,
          `Warehouse "${warehouseName}" not found for country ${shippingAddress.country}`,
          ErrorType.RESOURCE_NOT_FOUND
        );
      }

      // Step 4: Update warehouse stock if applicable
      try {
        await warehouseService.removeProductsFromWarehouse(
          warehouse,
          processedProducts,
          session
        );
      } catch (error: unknown) {
        throw new ApiError(
          500,
          `Failed to update warehouse stock: ${
            error instanceof Error ? error.message : String(error)
          }`,
          ErrorType.INTERNAL
        );
      }
    }

    // Step 5: Create the order
    const order = await userOrderService.createNewOrder(
      user._id,
      processedProducts,
      totalPrice,
      currency,
      shippingAddress,
      recipient,
      status,
      checked,
      paymentMethod,
      orderNotes,
      trackingNumber,
      warehouse ? { _id: warehouse._id as mongoose.Types.ObjectId } : null,
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
