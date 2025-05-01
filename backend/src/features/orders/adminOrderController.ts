import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import Warehouse from "../warehouses/WarehouseModel.js";
import Order, { OrderDocument, OrderProduct } from "./OrderModel.js";
import {
  updateWarehouseStock,
  recalculateTotalPrice,
} from "./adminOrderService.js";

import ApiError, { ErrorType } from "../../utils/apiError.js";
import { asyncHandler, transactionHandler } from "../../utils/asyncHandler.js";

interface OrderUpdateData {
  currency: "rubles" | "euros";
  products: OrderProduct[];
  status: OrderDocument["status"];
  checked?: boolean;
  totalPrice?: number;
  shippingAddress?: OrderDocument["shippingAddress"];
  recipient?: OrderDocument["recipient"];
  paymentMethod?: string;
  orderNotes?: string;
  trackingNumber?: string;
}

interface FilterQuery {
  status?: OrderDocument["status"];
  checked?: boolean;
}

// Fetch a specific order by ID
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found", ErrorType.RESOURCE_NOT_FOUND);
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);

// Edit an order and update warehouse stock accordingly
export const editOrderById = transactionHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { orderId } = req.params;
    const updateData: OrderUpdateData = req.body;
    const {
      currency,
      products: updatedProducts,
      status: newStatus,
    } = updateData;

    const existingOrder = await Order.findById(orderId).session(session);
    if (!existingOrder) {
      throw new ApiError(404, "Order not found", ErrorType.RESOURCE_NOT_FOUND);
    }

    if (
      existingOrder.status === "waiting confirmation" &&
      newStatus !== "waiting confirmation"
    ) {
      updateData.checked = true;
    }

    const warehouse = await Warehouse.findById(existingOrder.warehouse).session(
      session
    );
    if (!warehouse) {
      throw new ApiError(
        404,
        "Warehouse not found for this order",
        ErrorType.RESOURCE_NOT_FOUND
      );
    }

    try {
      await updateWarehouseStock(
        existingOrder,
        updatedProducts,
        warehouse,
        session
      );
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        400,
        error instanceof Error ? error.message : String(error),
        ErrorType.BAD_REQUEST
      );
    }

    updateData.totalPrice = await recalculateTotalPrice(
      updatedProducts,
      currency
    );

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      session,
    });

    if (!updatedOrder) {
      throw new ApiError(500, "Failed to update the order", ErrorType.INTERNAL);
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  }
);

// Fetch all orders
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const orders = await Order.find();

    res.status(200).json({
      success: true,
      orders,
    });
  }
);

// Filter orders based on query parameters
export const filterOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, checked, sortOrder } = req.query;

    let query: FilterQuery = {};

    if (status) {
      query.status = status as OrderDocument["status"];
    }

    if (checked !== undefined) {
      query.checked = checked === "true";
    }

    let orders = await Order.find(query);

    if (sortOrder === "newest") {
      orders = orders.sort(
        (a, b) =>
          new Date(b.dateOfCreation).getTime() -
          new Date(a.dateOfCreation).getTime()
      );
    } else if (sortOrder === "oldest") {
      orders = orders.sort(
        (a, b) =>
          new Date(a.dateOfCreation).getTime() -
          new Date(b.dateOfCreation).getTime()
      );
    }

    res.status(200).json({
      success: true,
      orders,
    });
  }
);
