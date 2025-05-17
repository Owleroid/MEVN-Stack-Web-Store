import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import Warehouse from "../warehouses/WarehouseModel.js";
import Order, { OrderDocument, OrderProduct } from "./OrderModel.js";

import {
  updateWarehouseStock,
  recalculateTotalPrice,
  returnProductsToWarehouse,
  removeProductsFromWarehouse,
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
  warehouse?: mongoose.Types.ObjectId;
}

interface FilterQuery {
  status?: OrderDocument["status"];
  checked?: boolean;
}

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("warehouse", "name");

    if (!order) {
      throw new ApiError(404, "Order not found", ErrorType.RESOURCE_NOT_FOUND);
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);

export const editOrderById = transactionHandler(
  async (
    req: Request,
    res: Response,
    _next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { orderId } = req.params;
    const updateData: OrderUpdateData = req.body;
    const {
      currency,
      products: updatedProducts,
      status: newStatus,
      warehouse: newWarehouseId,
    } = updateData;

    const existingOrder = await Order.findById(orderId).session(session);
    if (!existingOrder) {
      throw new ApiError(404, "Order not found", ErrorType.RESOURCE_NOT_FOUND);
    }

    const oldStatus = existingOrder.status;
    const oldWarehouseId = existingOrder.warehouse;

    if (
      existingOrder.status === "waiting confirmation" &&
      newStatus !== "waiting confirmation"
    ) {
      updateData.checked = true;
    }

    try {
      if (
        newWarehouseId &&
        newWarehouseId.toString() !== oldWarehouseId?.toString()
      ) {
        // Case 1: Order is moving between warehouses
        if (oldWarehouseId) {
          const oldWarehouse = await Warehouse.findById(oldWarehouseId).session(
            session
          );
          if (!oldWarehouse) {
            throw new ApiError(
              404,
              "Old warehouse not found",
              ErrorType.RESOURCE_NOT_FOUND
            );
          }

          if (oldStatus !== "canceled") {
            await returnProductsToWarehouse(
              existingOrder.products,
              oldWarehouse,
              session
            );
          }
        }

        // Case 2: Order is assigning to new warehouse
        const newWarehouse = await Warehouse.findById(newWarehouseId).session(
          session
        );
        if (!newWarehouse) {
          throw new ApiError(
            404,
            "New warehouse not found",
            ErrorType.RESOURCE_NOT_FOUND
          );
        }

        if (newStatus !== "canceled") {
          await removeProductsFromWarehouse(
            updatedProducts,
            newWarehouse,
            session
          );
        }
      } else {
        const warehouse = await Warehouse.findById(
          existingOrder.warehouse
        ).session(session);

        if (!warehouse) {
          throw new ApiError(
            404,
            "Warehouse not found for this order",
            ErrorType.RESOURCE_NOT_FOUND
          );
        }

        // 1. Handle status change from active to canceled
        if (oldStatus !== "canceled" && newStatus === "canceled") {
          await returnProductsToWarehouse(
            existingOrder.products,
            warehouse,
            session
          );
        }
        // 2. Handle status change from canceled to active
        else if (oldStatus === "canceled" && newStatus !== "canceled") {
          // Remove ALL new products from warehouse
          await removeProductsFromWarehouse(
            updatedProducts,
            warehouse,
            session
          );
        }
        // 3. Handle normal product changes (no status change or between active statuses)
        else if (oldStatus !== "canceled" && newStatus !== "canceled") {
          await updateWarehouseStock(
            existingOrder,
            updatedProducts,
            warehouse,
            session
          );
        }
      }
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

export const getAllOrders = asyncHandler(
  async (_req: Request, res: Response) => {
    const orders = await Order.find().populate("warehouse", "name");

    res.status(200).json({
      success: true,
      orders,
    });
  }
);

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

    let orders = await Order.find(query).populate("warehouse", "name");

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
